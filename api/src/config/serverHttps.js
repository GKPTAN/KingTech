import fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverHttps = async (app, port) => {
    try {
        const cert = fs.readFileSync(path.join(__dirname, "../certificates/cert.pem"));
        const key = fs.readFileSync(path.join(__dirname, "../certificates/key.pem"));

        return fastify({
            logger: true,
            https: {
                key,
                cert,
            },
        });
    } catch (error) {
        console.error("erro ao iniciar o servidor HTTPS: ", error);
    };
};

export default serverHttps