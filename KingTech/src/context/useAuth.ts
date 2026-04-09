import { createContext, useContext } from "react";

import type { AuthContextData } from "@/types/api.ts";

export const AuthContext = createContext<AuthContextData | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth não pode ser usado fora do AuthProvider");
    }

    return context;
};