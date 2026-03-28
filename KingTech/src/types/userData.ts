export interface UserDataRegister {
    fullname: string;
    gender: string;
    date_birth: string;
    email: string;
    password: string;
}

export const VALID_ROLES = ["user", "admin"] as const;

export type UserRole = (typeof VALID_ROLES)[number];

export interface User {
    id: string;
    email: string;
    role: UserRole;
    raw?: any;
}

