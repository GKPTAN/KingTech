const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const refreshController = async (request, reply, supabase) => {

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
        console.error("Variáveis de ambiente da Supabase não estão definidas.");
        return reply.status(500).send({
            message: "Configuração do servidor inválida",
            error: false,
            technicalError: true
        });
    };

    try {
        const refreshToken = request.cookies?.refresh_token || (request.headers?.authorization && request.headers.authorization.startsWith("Bearer ") ? request.headers.authorization.split(" ")[1] : null);

        if (!refreshToken) {
            return reply.status(401).send({
                message: "Refresh token não fornecido",
                error: false,
                technicalError: true
            });
        };

        const tokenUrl = `${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/token`;
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        });

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: params.toString(),
        });

        const data = await response.json();

        if (!response.ok || !data.access_token) {
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

        const { access_token, refresh_token, expires_in } = data;

        reply.setCookie("token", access_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: expires_in || 60 * 60 * 8,
        });

        reply.setCookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 dias
        });

        const getUserResponse = await supabase.auth.getUser(access_token);
        const user = getUserResponse?.data?.user ?? null;

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