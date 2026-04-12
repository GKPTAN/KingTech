import { z } from "zod";

import { UserDataLoginSchema, UserDataRegisterSchema } from "@/utils/validateData";

export type UserDataRegister = z.infer<typeof UserDataRegisterSchema>;

export type UserDataLogin = z.infer<typeof UserDataLoginSchema>;

export const VALID_ROLES = ["user", "admin"] as const;

const userRoleSchema = z.enum(VALID_ROLES);

export const UserSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.email(),
    role: userRoleSchema,
    raw: z.any().optional(),
})

export type UserRole = z.infer<typeof userRoleSchema>;

export type User = z.infer<typeof UserSchema>;