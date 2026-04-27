import type { FastifyRequest, FastifyReply } from "fastify";
import { SupabaseClient } from "@supabase/supabase-js";
import type { CookieSerializeOptions } from "@fastify/cookie";

interface logoutBody {}

const logoutController = async (
  request: FastifyRequest<{Body: logoutBody}>, 
  reply: FastifyReply, 
  supabase: SupabaseClient
) => {
  try {

    const user = request.user;

    await supabase.auth.admin.signOut(user.id, 'global');
    await supabase.auth.signOut();

    const cookieOptions: CookieSerializeOptions = {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    }

    reply.clearCookie("token", cookieOptions);
    reply.clearCookie("refresh_token", cookieOptions);
    reply.clearCookie("user_id", cookieOptions);

    return reply.status(200).send({
      message: "Logout realizado",
      error: false,
      technicalError: false,
    });
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
