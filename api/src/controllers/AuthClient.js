import { createClient } from "@supabase/supabase-js";

class AuthClient {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  };
  async verifyAndCreateUser(userId, verificationCode) {
    try {
      // buscar(fetch) perfil não verificado
      const {data: pendingUser, error: fetchError} = await this.supabase
        .from("unverified_profiles")
        .select("*")
        .eq("id", userId)
        .single();

        if (fetchError || !pendingUser) {
          throw new Error("Usuário não encontrado ou erro ao buscar dados.");
        };
        // verificar código de verificação
        if (pendingUser.verification_code !== verificationCode) {
          throw new Error("Código de verificação inválido.");
        }
        // criar usuário em auth.users
        const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
          email: pendingUser.email,
          password: pendingUser.password_hash,
          email_confirm: true,
          user_metadata: {
            full_name: pendingUser.full_name,
            username: pendingUser.username,
            date_birth: pendingUser.date_birth,
            gender: pendingUser.gender,
            city: pendingUser.city,
            region: pendingUser.region,
            country: pendingUser.country,
            loc: pendingUser.loc,
            ip_user: pendingUser.ipUser,
          }
        });
        if (authError) { throw authError; };
        // inserir dados na tabela profiles
        const { error: profileError } = await this.supabase
          .from("profiles")
          .insert({
            id: authUser.user.id,
            full_name: pendingUser.full_name,
            email: pendingUser.email,
            username: pendingUser.username,
            date_birth: pendingUser.date_birth,
            gender: pendingUser.gender,
            password_hash: pendingUser.password_hash,
            ip_user: pendingUser.ipUser,
            city: pendingUser.city,
            region: pendingUser.region,
            country: pendingUser.country,
            loc: pendingUser.loc,
          });
          if (profileError) { throw profileError; };
          //remover perfil não verificado da tabela unverified_profiles
          const { error: deleteError } = await this.supabase
            .from("unverified_profiles")
            .delete()
            .eq("id", userId);

            if (deleteError) { throw deleteError; };
            return {
              sucess: true,
              userId: authUser.user.id,
              message: "Usuário verificado e criado com sucesso."
            }
    } catch (error) {
      console.error("Erro ao verificar e criar usuário:", error);
      throw error;
    };
  };
};

export default new AuthClient();