import registerController from "../controllers/auth/register.js";
import verifyController from "../controllers/auth/verify.js";
import loginController from "../controllers/auth/login.js";
import meController from "../controllers/auth/me.js";
import logoutController from "../controllers/auth/logout.js";
import refreshController from "../controllers/auth/refresh.js";

const AuthRoutes = async (fastify, options) => {
  fastify.post("/register", async (request, reply) => {
    await registerController(request, reply, fastify.supabase);
  });
  fastify.post("/verify", async (request, reply) => {
    await verifyController(request, reply, fastify.supabase);
  });
  fastify.post("/login", async (request, reply) => {
    await loginController(request, reply, fastify.supabase);
  });
  fastify.get("/me", async (request, reply) => {
    await meController(request, reply, fastify.supabase);
  });
  fastify.post("/logout", async (request, reply) => {
    await logoutController(request, reply, fastify.supabase);
  });
  fastify.post("/refresh", async (request, reply) => {
    await refreshController(request, reply, fastify.supabase);
  });
};

export default AuthRoutes;