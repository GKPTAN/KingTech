import type { FastifyRequest, FastifyReply } from "fastify";
import { ROLES } from "@/utils/roles";

export const authHook = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        let token = request.cookies?.token;

        if (!token && request.headers.authorization?.startsWith(`Bearer `)) {
            token = request.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return reply.status(401).send({message: "token não fornecido", error: false, technicalError: true})
        }
        const {data: { user }, error} = await request.server.supabase.auth.getUser(token);

        if (error || !user) {
            return reply.status(401).send({message: "sessão inválida ou expirada", error: false, technicalError: true})
        }

        const role = (user.role || user.user_metadata?.role || ROLES.USER) as ROLES;

        request.user = {
            ...user,
            role: role
        };
    } catch (error) {
        return reply.status(401).send({ message: "Falha na autenticação", error: true, technicalError: false });
    }
}