import transporter from "../config/emailConfig.js";

const sendEmailToUser = async ({from, to, subject, text, html}) => {
    try {
        const info = await transporter.sendMail({ from, to, subject, text, html });
        console.log("Email enviado com sucesso, id: ", info.messageId);
    } catch (error) {
        console.error("Erro ao enviar o e-mail: ", error);
        throw error;
    };
};

export default sendEmailToUser