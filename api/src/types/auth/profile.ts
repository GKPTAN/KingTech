import { z } from "zod";

export const ProfileDataSchema = z.object({
    full_name: z.string(),
    username: z.string(),
    gender: z.string(),
    city: z.string(),
    region: z.string(),
    country: z.string()
})