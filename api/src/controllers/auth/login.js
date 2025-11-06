import { hash, compare } from "bcrypt";

const loginController = async (request, reply, supabase) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return reply.status(400).send({
            message: "E-mail e senha são obrigatórios.",
            error: true,
            technicalError: false,
        });
    };

    try {
        const { data: user, error: profileError } = await supabase
            .from("profiles")
            .select("id, email")
            .eq("email", email)
            .single();
        if (profileError || !user) {
            return reply.status(401).send({
                message: "Usuário não encontrado ou senha incorreta.",
                error: true,
                technicalError: false,
            });
        };

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
                details: error.message,
            });
        };

        const { data: profileData, error: detailsError } = await supabase
            .from("profiles")
            .select("full_name, username, gender, city, region, country")
            .eq("id", user.id)
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

        return reply.status(200).send({
            message: "Login realizado com sucesso.",
            error: false,
            technicalError: false,
            user: {
                id: session.user.id,
                email: session.user.email,
                ...profileData,
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