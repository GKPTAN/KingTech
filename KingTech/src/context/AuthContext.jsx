import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await fetch('auth/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();
            setUser(data.user);
            return data;
        } catch (error) {
            console.error("Erro no login: ", error);
            return {
                error: true,
                message: "Erro ao conectar com o servidor, tente novamente mais tarde",
            };
        };
    };

    const register = async (userData) => {
        try {
            const response = await fetch('https://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
            const response = await fetch('https://localhost:3000/auth/verify', {
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
        <AuthContext.Provider value={{ user, login, register, verify }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};