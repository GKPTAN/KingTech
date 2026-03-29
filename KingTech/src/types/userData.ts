export interface UserDataRegister {
    full_name: string;
    gender: string;
    date_birth: string;
    email: string;
    password: string;
}

export interface UserDataLogin {
    email: string;
    password: string;
}

export const VALID_ROLES = ["user", "admin"] as const;

export type UserRole = (typeof VALID_ROLES)[number];

export interface User {
    id: string;
    name?: string;
    email: string;
    role: UserRole;
    raw?: any;
}

