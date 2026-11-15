import type { FastifyRequest, FastifyReply } from "fastify";
import type { Database } from "@/types/database.types";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { EnvSupabase } from "@/types/auth/authClientVerify";

const refreshController = async (
    request: FastifyRequest, 
    reply: FastifyReply, 
    supabase: SupabaseClient) => {

    const refreshSupabase = createClient<Database>(
        EnvSupabase.SUPABASE_URL!,
        EnvSupabase.SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        },
    );

    try {
        const refreshToken = request.cookies?.refresh_token || (request.headers?.authorization && request.headers.authorization.startsWith("Bearer ") ? request.headers.authorization.split(" ")[1] : null);

        if (!refreshToken) {
            return reply.status(401).send({
                message: "Refresh token não fornecido",
                error: false,
                technicalError: true
            });
        };

        const {data, error} = await refreshSupabase.auth.refreshSession({refresh_token: refreshToken});

        if (error || !data.session) {
            console.error("Refresh falhou: ", data);
            reply.clearCookie("token", {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            reply.clearCookie("refresh_token", {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            return reply.status(401).send({
                message: "Refresh token inválido ou expirado",
                error: false,
                technicalError: true,
            });
        };

        const { access_token, refresh_token, expires_in } = data.session;
        const user = data.user;

        reply.setCookie("token", access_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: expires_in || 60 * 60 * 8,
        });

        reply.setCookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 dias
        });

        const resultUser = user ? {
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role || "user",
        }
        : null;

        return reply.status(200).send({
            message: "Sessão renovada",
            error: false,
            user: resultUser,
            expiresIn: expires_in,
        });
    } catch (error) {
        console.error("Erro em refreshController: ", error);
        return reply.status(500).send({
            message: "Erro ao renovar sessão",
            error: false,
            technicalError: true,
        });
    };
};

export default refreshController;