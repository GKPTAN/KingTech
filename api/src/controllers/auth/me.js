const meController = async (request, reply, supabase) => {
  try {
    let token = null;
    if (request.cookies && request.cookies.token) {
      token = request.cookies.token;
    } else if (request.headers && request.headers.authorization) {
      const auth = request.headers.authorization;
      if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
        token = auth.split(' ')[1];
      };
    };

    if (!token) {
      return reply.status(401).send({
        message: "Não autenticado",
        error: false,
        technicalError: true,
      });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData?.user) {
        console.error("Token inválido: ", userError);
        return reply.status(401).send({
            message: "Usuário não autenticado",
            error: false,
            technicalError: true,
        });
    };

    const user = userData.user;
    console.log("usuário: ", user);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, username, gender, citym region, country, id, email")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") { /* ajustar código conforme lib */
        console.error("Erro ao buscar profile:", profileError);
        return reply.status(500).send({ 
            message: "Erro ao buscar perfil", 
            error: true, technicalError: true
        });
    }

    const resultUser = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || "user",
      profile: profile || null,
    };

    return reply.status(200).send({
      user: resultUser,
      error: false,
      technicalError: false,
    });
  } catch (error) {
    console.error("Erro em /auth/me: ", error);
    return reply.status(500).send({
      message: "Não autenticado",
      error: false,
      technicalError: true,
    });
  }
};

export default meController;
