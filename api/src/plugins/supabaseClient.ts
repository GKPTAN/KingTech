import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { EnvSupabase } from '@/types/auth/authClientVerify';

dotenv.config({ path: '.env'});

const supabaseUrl = EnvSupabase.SUPABASE_URL;
const key = EnvSupabase.SUPABASE_KEY;

if (!supabaseUrl || !key) {
    throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão definidos nas variáveis de ambiente.");
};

const supabase = createClient(supabaseUrl, key, {
    auth: {
        persistSession: false,
    }
});

export default supabase;