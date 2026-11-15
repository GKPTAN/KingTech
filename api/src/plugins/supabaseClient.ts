import { createClient } from '@supabase/supabase-js';
import { EnvSupabase } from '@/types/auth/authClientVerify';

const supabaseUrl = EnvSupabase.SUPABASE_URL;
const key = EnvSupabase.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !key) {
    throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão definidos nas variáveis de ambiente.");
};

const supabase = createClient(supabaseUrl, key, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    },
});

export default supabase;