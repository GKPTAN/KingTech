import { ROLES } from '../utils/roles.js';

export const verifySupabaseToken = async (request, reply) => {
    try {
        const supabase = request.server?.supabase;
        if (!supabase) {
            console.error("Supabase client não encontrado no servidor (fastify.supabase).");
            return reply.status(500).send({
                message: "Erro interno no servidor",
                error: false,
                technicalError: true,
            });
        };

        const token = request.cookies?.token || (request.headers?.authorization && request.headers.authorization.startsWith('Bearer ') ? request.headers.authorization.split(' ')[1] : null);

        if (!token) {
            return reply.status(401).send({
                message: "Token não fornecido",
                error: false,
                technicalError: true,
            });
        };

        const { data: userData, error: userError } = await supabase.auth.getUser(token);

        if (userError || !userData?.user) {
            return reply.status(401).send({
                message: "Token inválido",
                error: false,
                technicalError: true,
            });
        };

        const user = userData.user;

        const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .maybeSingle();

        const role = profile?.role || user.user_metadata?.role || "user";

        request.user = {
            id: user.id,
            email: user.email,
            role,
        };

        return;
    } catch (error) {
        console.error("Erro ao verificar token da Supabase (verifySupabaseToken): ", error);
        return reply.status(401).send({
            message: "Erro interno no servidor",
            error: false,
            technicalError: true
        });
    };
};

export const requireRole = (...allowedRoles) => {
    return async (request, reply) => {
        if (!request.user) {
            return reply.status(401).send({
                message: "Usuário não autenticado",
                error: false,
                technicalError: true,
            });
        };
        if (allowedRoles.length === 0) return;
        if (!allowedRoles.includes(request.user.role)) {
            return reply.status(403).send({
                message: "Acesso negado",
                error: false,
                technicalError: true,
            });
        };
    };
};