import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { 
  ResponseErrorSchema, 
  ResponseSucessLoginSchema, 
  ResponseSucessRegisterSchema,
  ResponseSucessVerifySchema
} from "@/types/response";
import { UserDataRegisterSchema, UserDataLoginSchema, UserVerifySchema } from "@/utils/validateData.js";
import registerController from "../controllers/auth/register.js";
import verifyController from "../controllers/auth/verify.js";
import loginController from "../controllers/auth/login.js";
import meController from "../controllers/auth/me.js";
import logoutController from "../controllers/auth/logout.js";
import refreshController from "../controllers/auth/refresh.js";
import { authHook } from "../middlewares/authHook.js";

const AuthRoutes = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // app.post("/register",{schema: {
  //   body: UserDataRegisterSchema,
  //   response: {200: ResponseSucessRegisterSchema, default: ResponseErrorSchema}
  // }}, (request, reply) => registerController(request, reply, fastify.supabase));

  app.post("/verify", {schema: {
    body: UserVerifySchema,
    response: {200: ResponseSucessVerifySchema, default: ResponseErrorSchema}
  }}, (request, reply) => verifyController(request, reply, fastify.supabase));

  // app.post("/login", {schema: {
  //   body: UserDataLoginSchema, 
  //   response: {200: ResponseSucessLoginSchema, default: ResponseErrorSchema}
  // }}, (request, reply) => loginController(request, reply));

  fastify.post("/refresh", (request, reply) => refreshController(request, reply, fastify.supabase));


  fastify.get("/me", {preHandler: [authHook]}, (request, reply) => {
    return meController(request, reply, fastify.supabase);
  });
  fastify.post("/logout", {preHandler: [authHook]}, (request, reply) => {
    return logoutController(request, reply, fastify.supabase);
  });
};

export default AuthRoutes;