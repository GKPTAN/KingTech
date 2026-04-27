export const EnvSupabase = {
    SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const;

export interface AuthClientReturn {
    success: boolean;
    userId: string;
    message: string
}