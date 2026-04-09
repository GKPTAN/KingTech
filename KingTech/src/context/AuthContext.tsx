/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { createClient } from "@supabase/supabase-js";

import type { User, UserDataLogin, UserDataRegister } from "@/types/userData.ts";
import type { FailedRequest} from "@/types/api.ts";

import { AuthContext } from "./useAuth.ts";

interface AuthProviderProps {
    children: React.ReactNode;
}

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
const API_BASE = "https://localhost:3000";

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.withCredentials = true;

    const fetchUserFromApi = async (): Promise<User | null> => {
        try {
            const resp = await axios.get(`${API_BASE}/auth/me`);
            if (resp?.data?.user) {
                return resp.data.user;
            };
            return null;
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            if (err?.response?.status === 401) return null;
            console.error("Erro ao buscar usuário da API: ", err);
            return null;
        };
    };

    const refreshSession = async (): Promise<boolean> => {
        try {
            const response = await axios.post(`${API_BASE}/auth/refresh`);
            if (response?.data?.user) {
                setUser(response.data.user);
                return true;
            };
            return false;
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            console.error("Erro ao atualizar sessão: ", err);
            return false;
        };
    };

    useEffect(() => {

        let mounted = true;
        let interceptorId: number | null = null;

        const init = async () => {
            try {

                let apiUser = await fetchUserFromApi();
                if (!apiUser) {
                    const refreshed = await refreshSession();
                    if (refreshed) {
                        apiUser = await fetchUserFromApi();
                    };
                };

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
                    } else if (mounted) {
                        setUser(null);
                    };
                };

                const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
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
                    } else {
                        setUser(null);
                    };
                });

                let isRefreshing = false;
                let failedQueue: FailedRequest[] = [];

                const processQueue = (error: any | null, result: any = null) => {
                    failedQueue.forEach(prom => {
                        if (error) prom.reject(error);
                        else prom.resolve(result);
                    });
                    failedQueue = [];
                };

                interceptorId = axios.interceptors.response.use(resp => resp, async err => {
                    const originalRequest = err.config;
                    if (!originalRequest) return Promise.reject(err);
                    if (err.response?.status === 401 && !originalRequest._retry) {
                        if (isRefreshing) {
                            return new Promise((resolve, reject) => {
                                failedQueue.push({ resolve, reject });
                            }).then(() => axios(originalRequest));
                        };
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
                        };
                    };
                    return Promise.reject(err);
                });

                setLoading(false);

                return () => {
                    mounted = false;
                    if (sub?.subscription) {
                        sub.subscription.unsubscribe();
                    };
                    if (interceptorId !== null) {
                        axios.interceptors.response.eject(interceptorId);
                    };
                };
            } catch (error) {
                console.error("Auth init error: ", error);
                if (mounted) {
                    setUser(null);
                    setLoading(false);
                };
            };
        };

        const cleanupPromise = init();

        return () => {
            cleanupPromise.then(_clean => {

            });
        };
    }, []);

    const login = async (userData: UserDataLogin) => {
        setLoading(true);
        const {email, password} = userData;
        try {
            const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
            if (response?.data?.user) {
                setUser(response.data.user);
            };
            setLoading(false);
            return response.data;
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            console.error("Erro no login: ", err);
            setLoading(false);
            const apiError = err?.response?.data;
            return {
                error: true,
                message: apiError?.message || "Erro ao conectar com o servidor, tente novamente mais tarde",
                technicalError: apiError?.technicalError ?? false,
                log: apiError?.error 
            };
        };
    };

    const logout = async () => {
        try {
            await axios.post(`${API_BASE}/auth/logout`);
        } catch (_error: unknown) {
            // const err = error as AxiosError<any>;
            //
        }
        try {
            await supabase.auth.signOut();
        } catch (_error: unknown) {
            // const err = error as AuthError;
            //
        }
        setUser(null);
    };

    const register = async (userData: UserDataRegister) => {
        try {
            const response = await axios.post(`${API_BASE}/auth/register`, userData);
            return response.data;
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            console.error("Erro no registro: ", err);
            const apiError = err?.response?.data;
            return {
                error: true,
                message: apiError?.message || "Erro ao conectar com o servidor, tente novamente mais tarde",
                technicalError: apiError?.technicalError ?? false,
                log: apiError?.error 
            };
        };
    };

    const verify = async (code: string) => {
        try {
            const response = await axios.post(`${API_BASE}/auth/verify`, { code});
            return response.data;
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            console.error("Erro na verificação: ", err);
            return {
                error: true,
                message: "Erro ao conectar com o servidor, tente novamente mais tarde"
            };
        };
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, verify }}>
            {children}
        </AuthContext.Provider>
    );
};