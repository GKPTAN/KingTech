import { SupabaseClient, User } from "@supabase/supabase-js";
import { ROLES } from "@/utils/roles";

declare module 'fastify' {
    interface FastifyInstance {
        supabase: SupabaseClient;
    }

    interface FastifyRequest {
        user: User & {
            role: ROLES
        };
    }
}