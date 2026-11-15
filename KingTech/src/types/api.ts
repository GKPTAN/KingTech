/* eslint-disable no-unused-vars */
import type { CreateProduct } from "./products";
import type { TypeStatus } from "@/context/AuthContext";
import type { User, UserDataLogin, UserDataRegister } from "./userData";
import type { Dispatch, SetStateAction } from "react";

type ServerErrorLog = string | Record<string, unknown> | null;

type RegisterFields = keyof UserDataRegister | "confirm_password";
export type LoginFields = keyof UserDataLogin;
type VerifyFields = "code";
type CreateProductFields = keyof CreateProduct; 

export interface AuthContextData {
    user: User | null;
    loading: boolean;
    login: (userData: UserDataLogin) => Promise<SucessApiResponse<LoginResponse> | ErrorApiResponse>;
    logout: () => void;
    register: (userData: UserDataRegister) => Promise<SucessApiResponse | ErrorApiResponse>;
    verify: (code: string) => Promise<SucessApiResponse<VerifyResponse> | ErrorApiResponse>;
    globalStatus: TypeStatus | null;
    globalMessage: string;
    setGlobalMessage: Dispatch<SetStateAction<string>>;
    setGlobalStatus: Dispatch<SetStateAction<TypeStatus | null>>;
}

export interface FailedRequest {
    resolve: (value?: any) => void;
    reject: (error: any) => void;
}

export interface ApiResponse {
    message: string;
    error: boolean;
    technicalError?: boolean;
} 

export interface ErrorApiResponse extends ApiResponse {
    error: true;
    details?: string;
    field?: RegisterFields | LoginFields | VerifyFields | CreateProductFields;
    log?: ServerErrorLog;
}

export type SucessApiResponse<T = {}> = ApiResponse & {error: false} & T;

interface VerifyResponse {
    location: string;
}

interface LoginResponse {
    location: string;
    user: User;
    expires_in: number;
}