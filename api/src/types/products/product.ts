import { z } from "zod";

export const SucessResponseProductSchema = z.object({
    message: z.string(),
    error: z.boolean(),
    technicalError: z.boolean(),
});

export const SucessUploadImageResponseSchema = z.object({
    message: z.string(),
    error: z.boolean(),
    technicalError: z.boolean(),
    urls: z.array(z.string())
})