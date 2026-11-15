import React from "react";
import { useEffect, useState } from "react";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { AuthError, createClient } from "@supabase/supabase-js";

import AxiosConfig from "@/config/AxiosConfig";

import type { User, UserDataLogin, UserDataRegister } from "@/types/userData";
import type { ErrorApiResponse, FailedRequest } from "@/types/api";

import { AuthContext } from "./useAuth";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export type TypeStatus = "sucess" | "error";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [globalStatus, setGlobalStatus] = useState<TypeStatus | null>(null);
  const [globalMessage, setGlobalMessage] = useState("");

  const fetchUserFromApi = async (): Promise<User | null> => {
    try {
      const resp = await AxiosConfig.get(`/auth/me`);
      if (resp?.data?.user) {
        return resp.data.user;
      }
      return null;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      if (err?.response?.status === 401) return null;
      console.error("Erro ao buscar usuário da API: ", err);
      return null;
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      const response = await AxiosConfig.post(`auth/refresh`);
      if (response?.data?.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      console.error("Erro ao atualizar sessão: ", err);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    let interceptorId: number | null = null;
    let authSubscription: any = null;

    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      const newSession = sess;
      const u = newSession?.user ?? null;

      if (u) {
        setUser({
          id: u?.id,
          name: u?.user_metadata?.username,
          email: u?.email!,
          role: u?.user_metadata?.role || "user",
          raw: u,
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    authSubscription = sub?.subscription;

    let isRefreshing = false;
    let failedQueue: FailedRequest[] = [];

    const processQueue = (error: any | null, result: any = null) => {
      failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(result);
      });
      failedQueue = [];
    };

    interceptorId = axios.interceptors.response.use(
      (resp) => resp,
      async (err: AxiosError<ErrorApiResponse>) => {
        const originalRequest = err.config as CustomAxiosRequestConfig;
        if (!originalRequest) return Promise.reject(err);

        if (originalRequest.url?.includes("/auth/refresh")) {
          setUser(null);
          return Promise.reject(err);
        }
        if (err.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(() => axios(originalRequest));
          }
          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const ok = await refreshSession();
            isRefreshing = false;
            processQueue(null, true);
            if (ok) return axios(originalRequest);
            setUser(null);
            return Promise.reject(err);
          } catch (e) {
            isRefreshing = false;
            processQueue(e, null);
            setUser(null);
            return Promise.reject(e);
          }
        }
        return Promise.reject(err);
      },
    );

    const init = async () => {
      try {
        let apiUser = await fetchUserFromApi();
        if (!apiUser) {
          const refreshed = await refreshSession();
          if (refreshed) {
            apiUser = await fetchUserFromApi();
          }
        }

        if (apiUser && mounted) {
          setUser(apiUser);
        } else {
          const { data } = await supabase.auth.getSession();
          const session = data?.session ?? null;
          const supaUser = session?.user ?? null;
          if (supaUser && mounted) {
            setUser({
              id: supaUser.id,
              name: supaUser.user_metadata?.username,
              email: supaUser.email!,
              role: supaUser.user_metadata?.role || "user",
              raw: supaUser,
            });
            console.log("Sessão: ", data.session)
          } else if (mounted) {
            setUser(null);
          }
        }

        if (mounted) setLoading(false);
      } catch (error) {
        console.error("Auth init error: ", error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      if (interceptorId !== null) {
        axios.interceptors.response.eject(interceptorId);
      }
    };
  }, []);

  const login = async (userData: UserDataLogin) => {
    const { email, password } = userData;
    try {
      const response = await AxiosConfig.post(`auth/login`, {
        email,
        password
      });
      if (response?.data?.user) {
        setUser(response.data.user);
        setGlobalStatus("sucess");
        setTimeout(() => {
          setGlobalStatus(null);
        }, 5000);
      }
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      console.error("Erro no login: ", err);
      const apiError = err?.response?.data;
      if (!apiError?.field) {
        setGlobalStatus("error");
        setTimeout(() => {
          setGlobalStatus(null);
        }, 7000);
      }
      return {
        error: true,
        message:
          apiError?.message ||
          "Erro ao conectar com o servidor, tente novamente mais tarde",
        technicalError: apiError?.technicalError ?? false,
        log: apiError?.error,
        field: apiError?.field
      };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AxiosConfig.post(`auth/logout`);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      console.log("erro em logout", err.response?.data.message);
    }
    try {
      await supabase.auth.signOut();
    } catch (error: unknown) {
      const err = error as AuthError;
      console.log("Erro ao desautenticar na supabase", err);
    }
    setUser(null);
    setLoading(false);
    setGlobalStatus("sucess");
    setTimeout(() => {
      setGlobalStatus(null);
    }, 5000);
  };

  const register = async (userData: UserDataRegister) => {
    try {
      const response = await AxiosConfig.post(`auth/register`, userData);
      setGlobalStatus("sucess");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 5000);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      console.error("Erro no registro: ", err);
      const apiError = err?.response?.data;
      setGlobalStatus("error");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 7000);
      return {
        error: true,
        message:
          apiError?.message ||
          "Erro ao conectar com o servidor, tente novamente mais tarde",
        technicalError: apiError?.technicalError ?? false,
        log: apiError?.error,
        field: apiError?.field
      };
    }
  };

  const verify = async (code: string) => {
    try {
      const response = await AxiosConfig.post(`auth/verify`, { code });
      setGlobalStatus("sucess");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 5000);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApiResponse>;
      console.error("Erro na verificação: ", err);
      setGlobalStatus("error");
      setTimeout(() => {
        setGlobalStatus(null);
      }, 7000);
      return {
        error: true,
        message:
          err.message ||
          "Erro ao conectar com o servidor, tente novamente mais tarde",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, verify, globalStatus, globalMessage, setGlobalMessage, setGlobalStatus}}
    >
      {children}
    </AuthContext.Provider>
  );
};
