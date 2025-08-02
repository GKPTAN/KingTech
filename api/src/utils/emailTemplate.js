import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getEmailTemplate = async (name, codeConfirm, city, region) => {
    try {
        const confirmEmail = path.join(__dirname, "../templates/email.html");

        let confirmEmailTemplate = await fs.readFile(confirmEmail, "utf-8");

        confirmEmailTemplate = confirmEmailTemplate
        .replace("{{name}}", name)
        .replace("{{codeConfirm}}", codeConfirm)
        .replace("{{city}}", city)
        .replace("{{region}}", region);

        return confirmEmailTemplate;
    } catch (error) {
        console.error("Erro ao carregar o template de e-mail: ", error);
        return "";
    };
};

export default getEmailTemplate