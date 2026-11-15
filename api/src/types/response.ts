import { z } from "zod";
import { ROLES } from "@/utils/roles";
import { ProfileDataSchema } from "./auth/profile";
import type { UserVerifySchema } from "@/utils/validateData";

export const ResponseErrorSchema = z.object({
    message: z.string(),
    error: z.boolean(),
    /** em caso de erro técnico, uma mensagem genérica será enviada para o front-end para não gerar dúvidas nos usuários */
    technicalError: z.boolean().optional(),
    details: z.string().optional(),
    field: z.string().optional(),
});

export const UserLoginResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(ROLES),
    raw: ProfileDataSchema
})

export const ResponseSucessLoginSchema = z.object({
    message: z.string(),
    error: z.boolean(),
    technicalError: z.boolean(),
    user: UserLoginResponseSchema,
    expiresIn: z.number(),
    location: z.string()
});

export const ResponseSucessRegisterSchema = z.object({
    message: z.string(),
    error: z.boolean(),
    technicalError: z.boolean(),
});

export const ResponseSucessVerifySchema = z.object({
    message: z.string(),
    error: z.boolean(),
    technicalError: z.boolean(),
    location: z.string(),
});

export type SucessResponse<T = unknown> = {
    message: string;
    error: false;
    technicalError: false;
} & T;

export type ErrorResponse = z.infer<typeof ResponseErrorSchema & {error: true}>;
export type LoginData = z.infer<typeof ResponseSucessLoginSchema>;
export type RegisterData = z.infer<typeof ResponseSucessRegisterSchema>;
export type VerifyData = z.infer<typeof ResponseSucessVerifySchema>

// Criação | Atualização | Remoção de produtos

