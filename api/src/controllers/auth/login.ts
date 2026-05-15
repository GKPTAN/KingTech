import { hash, compare } from "bcrypt";
import type { FastifyRequest, FastifyReply } from "fastify";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { LoginInput } from "@/utils/validateData";
import type { SucessResponse, ErrorResponse, LoginData } from "@/types/response";

const loginController = async (
    request: FastifyRequest<{Body: LoginInput}>, 
    reply: FastifyReply<{Reply: SucessResponse<LoginData> | ErrorResponse}>,
    supabase: SupabaseClient<Database>,
) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return reply.status(400).send({
            message: "E-mail e senha são obrigatórios.",
            error: true,
            technicalError: true,
        });
    };

    try {

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.error("Erro na autenticação: ", authError);
            return reply.status(500).send({
                message: "Erro ao autenticar usuário.",
                error: true,
                technicalError: true,
                details: authError.message,
            });
        };

        const { data: profileData, error: detailsError } = await supabase
            .from("profiles")
            .select("full_name, username, gender, city, region, country")
            .eq("id", authData.user.id)
            .single();

        if (detailsError || !profileData) {
            return reply.status(500).send({
                message: "Erro na autenticação, tente novamente mais tarde.",
                error: true,
                technicalError: true,
                details: detailsError ? detailsError.message : "Perfil não encontrado."
            });
        }

        const { session } = authData;

        if (session?.access_token) {
            reply.setCookie("token", session.access_token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
                maxAge: session.expires_in || 60 * 60 * 8,
            });
        } else {
            throw new Error("Token de acesso não encontrado na sessão.");
        }

        console.log("token: ", session?.access_token);

        console.log("Token refresh: ", session?.refresh_token);

        if (session?.refresh_token) {
            reply.setCookie("refresh_token", session.refresh_token, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 60 * 60 * 24 * 30,
            });
        };

        if (!session?.user.email) {
            throw new Error("a propriedade e-mail está indefinida no objeto session");
        }

        return reply.status(200).send({
            message: "Login realizado com sucesso.",
            error: false,
            technicalError: false,
            user: {
                id: session?.user.id,
                name: profileData.username,
                email: session?.user.email,
                role: session?.user.user_metadata?.role,
                raw: profileData
            },
            expiresIn: session.expires_in,
            location: "/account/dashboard",
        });
    } catch (error) {
        console.error("Erro no controlador de login: ", error);
        return reply.status(500).send({
            message: "Erro interno do servidor, tente novamente mais tarde.",
            error: true,
            technicalError: false
        });
    };
};

export default loginController;