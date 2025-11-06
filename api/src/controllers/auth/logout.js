const logoutController = async (request, reply, supabase) => {
  try {
    const token = request.cookies?.token || null;

    if (token) {
      try {
        const { data: userData, error: getUserError } = await supabase.auth.getUser(token);
        if (getUserError) {
          console.warn("Erro ao obter o usuário com getUser(): ", getUserError);
        } else {
          const userId = userData?.user?.id;
          if (userId && typeof supabase.auth.admin === "object") {
            if (typeof supabase.auth.admin.invalidateUserRefreshTokens === "function") {
              await supabase.auth.admin.invalidateUserRefreshTokens(userId);
            } else if (typeof supabase.auth.admin.deleteUserSessions === "function") {
              await supabase.auth.admin.deleteUserSessions(userId);
            } else {
              console.warn("Nenhum método admin para invalidar sessões de usuário disponível no SDK.");
            }
          }
        }
      } catch (e) {
        console.warn("Falha ao invalidar a sessão na Supabase...: ", e);
      }

      reply.clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      reply.clearCookie("user_id", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return reply.status(200).send({
        message: "Logout realizado",
        error: false,
        technicalError: false,
      });
    }
  } catch (error) {
    console.error("Erro em /auth/logout:", error);

    return reply.status(500).send({
      message: "Logout error",
      error: false,
      technicalError: true,
    });
  };
};

export default logoutController;
