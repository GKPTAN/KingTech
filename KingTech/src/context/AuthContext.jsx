import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const AuthContext = createContext();

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
const API_BASE = "https://localhost:3000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.withCredentials = true;

    const fetchUserFromApi = async () => {
        try {
            const resp = await axios.get(`${API_BASE}/auth/me`);
            if (resp?.data?.user) {
                return resp.data.user;
            };
            return null;
        } catch (error) {
            if (error?.response?.status === 401) return null;
            console.error("Erro ao buscar usuário da API: ", error);
            return null;
        };
    };

    const refreshSession = async () => {
        try {
            const response = await axios.post(`${API_BASE}/auth/refresh`);
            if (response?.data?.user) {
                setUser(response.data.user);
                return true;
            };
            return false;
        } catch (error) {
            return false;
        };
    };

    useEffect(() => {

        let mounted = true;
        let interceptorId = null;

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
                            email: supaUser.email,
                            role: supaUser.user_metadata?.role || "user",
                            raw: supaUser,
                        });
                    } else if (mounted) {
                        setUser(null);
                    };
                };

                const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
                    const newSession = sess?.session ?? null;
                    const u = newSession?.user ?? null;

                    if (u) {
                        setUser({
                            id: u?.id,
                            email: u?.email,
                            role: u?.user_metadata?.role || "user",
                            raw: u,
                        });
                    } else {
                        setUser(null);
                    };
                });

                let isRefreshing = false;
                let failedQueue = [];

                const processQueue = (error, result = null) => {
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
            cleanupPromise.then(clean => {

            });
        };
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
            if (response?.data?.user) {
                setUser(response.data.user);
            };
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error("Erro no login: ", error);
            setLoading(false);
            return {
                error: true,
                message: error?.response?.data || error.message || "Erro ao conectar com o servidor, tente novamente mais tarde",
            };
        };
    };

    const logout = async () => {
        try {
            await axios.post(`${API_BASE}/auth/logout`);
        } catch (error) {

        }
        try {
            await supabase.auth.signOut();
        } catch (error) {

        }
        setUser(null);
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                credentials: "include",
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro no registro: ", error);
            return {
                error: true,
                message: "Erro ao conectar com o servidor, tente novamente mais tarde",
            };
        };
    };

    const verify = async (code) => {
        try {
            const response = await fetch(`${API_BASE}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                credentials: "include",
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro na verificação: ", error);
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

export const useAuth = () => {
    return useContext(AuthContext);
};