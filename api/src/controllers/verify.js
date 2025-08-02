import AuthClient from "./AuthClient.js";

const verifyController = async (request, reply, supabase) => {
    const { code } = request.body;
    const { user_id } = request.cookies;

    console.log("id do usuário: ", user_id, "Código: ", code);

    if (!user_id) {
        return reply.status(400).send({ message: "Tempo expirado! Tente novamente mais tarde", error: true });
    };

    try {
        const result = await AuthClient.verifyAndCreateUser(user_id, code);
        reply.clearCookie("user_id");
        return reply.status(200).send({ message: "E-mail confirmado com sucesso", error: false });
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        if (error.message === "Usuário não encontrado ou erro ao buscar dados.") {
            return reply.status(404).send({ message: "Usuário não encontrado ou erro ao buscar dados.", error: true });
        };
        if (error.message === "Código de verificação inválido.") {
            return reply.status(400).send({ message: "Código de verificação inválido.", error: true });
        };
        
        return reply.status(500).send({ message: "Erro ao confirmar cadastro! entre em contato com o suporte.", error: true });
    };
};

export default verifyController