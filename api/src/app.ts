import supabase from "./plugins/supabaseClient.js";
import AuthRoutes from "./routes/authRoutes.js";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import dotenv from "dotenv";
import { hash } from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";
import fastify, {type FastifyError} from "fastify";
import fs from "fs";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

dotenv.config({path: ".env"});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cert = fs.readFileSync(path.join(__dirname, "src/certificates/cert.pem"));
const key = fs.readFileSync(path.join(__dirname, "src/certificates/key.pem"));

const secret = process.env.SECRET_COOKIE;

if (!secret) {
    throw new Error("Erro crítico: a variável de ambiente SECRET_COOKIE não está definida!");
}

const app = fastify({
    logger: true,
    https: {
        key,
        cert,
    },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: ["http://localhost:5173"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
});
app.register(fastifyCookie, {
    secret: secret
});
app.register(AuthRoutes, { prefix: "/auth" });
app.decorate('supabase', supabase);

app.setErrorHandler((error: FastifyError, request, reply) => {

    if (error.validation) {
        return reply.status(400).send({
            message: error.message,
            error: true,
            technicalError: false
        })
    };

    app.log.error(error);
    return reply.status(500).send({ message: "Erro interno no servidor", error: true, technicalError: false});
});

try {
    await app.listen({port: 3000});
    console.log(`Servidor HTTPS rodando em https://localhost:3000`);
} catch (error) {
    console.error("erro ao iniciar o servidor: ", error);
};