import supabase from "./src/plugins/supabaseClient.js";
import AuthRoutes from "./src/routes/authRoutes.js";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import dotenv from "dotenv";
import { hash } from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";
import fastify from "fastify";
import fs from "fs";

dotenv.config({path: ".env"});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cert = fs.readFileSync(path.join(__dirname, "src/certificates/cert.pem"));
const key = fs.readFileSync(path.join(__dirname, "src/certificates/key.pem"));

const secret = await hash(process.env.SECRET_COOKIE, 10);

const app = fastify({
    logger: true,
    https: {
        key,
        cert,
    },
});

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

app.setErrorHandler((error, request, reply) => {
    console.error(error);
    return reply.status(500).send({ message: "Erro interno no servidor", error: true, technicalError: false});
});

try {
    await app.listen({port: 3000});
    console.log(`Servidor HTTPS rodando em https://localhost:3000`);
} catch (error) {
    console.error("erro ao iniciar o servidor: ", error);
};