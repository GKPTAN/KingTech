import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import type { UserRole } from "@/types/userData.ts";

import { useAuth } from "./useAuth.ts";

interface AuthGuardProps {
    children: React.ReactNode;
    roles?: UserRole[];
}

const AuthGuard = ({children, roles = [] }: AuthGuardProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;

    if(!user) {
        return <Navigate to="/account/login" state={{ from: location }} replace />
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    };

    return children;
};

export default AuthGuard