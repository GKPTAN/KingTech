/* eslint-disable no-unused-vars */
import type { User, UserDataLogin, UserDataRegister } from "./userData";

type ServerErrorLog = string | Record<string, unknown> | null;

export interface AuthContextData {
    user: User | null;
    loading: boolean;
    login: (userData: UserDataLogin) => Promise<{error: boolean; message: string, technicalError?: boolean, location?: string, user?: User, expires_in?: number, log?: ServerErrorLog}>;
    logout: () => void;
    register: (userData: UserDataRegister) => Promise<{error: boolean; message: string, technicalError?: boolean, log?: ServerErrorLog}>;
    verify: (code: string) => Promise<{error: boolean; message: string}>;
}

export interface FailedRequest {
    resolve: (value?: any) => void;
    reject: (error: any) => void;
}