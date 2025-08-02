import registerController from "../controllers/register.js";
import verifyController from "../controllers/verify.js";

const AuthRoutes = async (fastify, options) => {
    fastify.post("/register", async (request, reply) => {
        await registerController(request, reply, fastify.supabase);
    });
    fastify.post("/verify", async (request, reply) => {
        await verifyController(request, reply, fastify.supabase);
    });
};

export default AuthRoutes