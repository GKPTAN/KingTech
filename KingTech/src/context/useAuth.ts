import { createContext, useContext } from "react";

import type { AuthContextData } from "./AuthContext.tsx";

export const AuthContext = createContext<AuthContextData | null>(null);

export const useAuth = () => {
    return useContext<AuthContextData>(AuthContext);
};