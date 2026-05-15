import { EnvSupabase, type AuthClientReturn } from "@/types/auth/authClientVerify";
import type { Database } from "@/types/database.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

class AuthClient {
  private supabase: SupabaseClient<Database>;
  constructor() {
    if (!EnvSupabase.SUPABASE_URL || !EnvSupabase.SUPABASE_KEY) {
      throw new Error("variáveis de ambiente Supabase não encontradas!");
    }

    this.supabase = createClient(
      EnvSupabase.SUPABASE_URL,
      EnvSupabase.SUPABASE_KEY,
    );
  };
/**
 * Verifica o código de verificação oferecido pelo usuário e cria o usuário na tabela Auth da Supabase e na tabela profiles
 * @param {String} userId - id do perfil não verificado
 * @param {String} verificationCode - código de verificação fornecido pelo usuário
 * @returns {Object} - resultado da verificação e criação do usuário
 */
  async verifyAndCreateUser(userId: string, verificationCode: string): Promise<AuthClientReturn> {
    try {
      // buscar(fetch) perfil não verificado
      const {data: pendingUser, error: fetchError} = await this.supabase
        .from("unverified_profiles")
        .select("*")
        .eq("id", userId)
        .single();

        console.log('DEBUG MOCK:', { pendingUser, fetchError });

        if (fetchError || !pendingUser) {
          throw new Error("Usuário não encontrado ou erro ao buscar dados.");
        };
        // verificar código de verificação
        if (pendingUser.verification_code !== verificationCode) {
          throw new Error("Código de verificação inválido.");
        }

        if(!pendingUser.password_hash || pendingUser.password_hash.length <= 0) {
          throw new Error("Senha inválida para o usuário.");
        };

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
            role: pendingUser.role || "user"
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
            ip_user: pendingUser.ipUser,
            city: pendingUser.city,
            region: pendingUser.region,
            country: pendingUser.country,
            loc: pendingUser.loc,
            role: pendingUser.role || "user"
          });
          if (profileError) {
             
            try {
              await this.supabase.auth.admin.deleteUser(authUser.user.id);
            } catch (deleteErr) {
              console.error("Erro ao remover usuário Auth após falha na criação do perfil: ", deleteErr);
            };

            throw profileError; 
          };
          //remover perfil não verificado da tabela unverified_profiles
          const { error: deleteError } = await this.supabase
            .from("unverified_profiles")
            .delete()
            .eq("id", userId);

            if (deleteError) { throw deleteError; };
            return {
              success: true,
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