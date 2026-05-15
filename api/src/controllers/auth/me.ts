import type { FastifyRequest, FastifyReply } from "fastify";
import type { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

interface MeBody {};

const meController = async (
  request: FastifyRequest<{Body: MeBody}>, 
  reply: FastifyReply, 
  supabase: SupabaseClient<Database>
) => {
  try {
    const user = request.user;
    console.log("usuário: ", user);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, username, gender, city, region, country, id, email")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") { /* ajustar código conforme lib */
        console.error("Erro ao buscar profile:", profileError);
        return reply.status(500).send({ 
            message: "Erro ao buscar perfil", 
            error: true, technicalError: true
        });
    } else if (profileError && profileError.code === "PGRST116") {
      throw new Error("Perfil não encontrado: ", profileError);
    }

    const resultUser = {
      id: user.id,
      name: profile?.username,
      email: user.email,
      role: user.user_metadata?.role || "user",
      raw: profile || null,
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
