import { hash } from "bcrypt";
import { pwnedPassword } from "hibp";
import validateData from "../utils/validateData.js";
import getLocationUser from "../services/locationService.js";
import generateCode from "../utils/generateCode.js";
import sendEmailToUser from "../services/emailService.js";
import getEmailTemplate from "../utils/emailTemplate.js";

const registerController = async (request, reply, supabase) => {
  const { full_name, gender, date_birth, email, password } = request.body;

  const analyzeData = await validateData(
    full_name,
    gender,
    date_birth,
    email,
    password
  );

  if (analyzeData !== true) {
    console.error("Erro: ", analyzeData.message);
    return reply
      .status(400)
      .send({ message: analyzeData, error: true, technicalError: true });
  }

  const ipUser = request.ip || request.headers["x-forwarded-for"];
  const location = await getLocationUser(ipUser);

  const { city, region, country, loc } = location;
  const verification_code = generateCode();

  try {

    const wasLeaked = await pwnedPassword(password);

    if (wasLeaked) {
      return reply.status(400).send({
        message: "A senha informada foi encontrada em vazamentos de dados. Por favor, escolha uma senha diferente.",
        error: true,
        technicalError: false,
      });
    };

    const { data: existingUser, error: findError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return reply
        .status(400)
        .send({
          message: "E-mail já cadastrado!",
          error: true,
          technicalError: false,
        });
    }

    if (findError && findError.code !== "PGRST116") {
      throw findError;
    }

    const username = full_name.split(" ")[0];
    const hashPassword = await hash(password, 10);
    const emailTemplate = await getEmailTemplate(
      username,
      verification_code,
      city,
      region
    );

    const { data, error } = await supabase
      .from("unverified_profiles")
      .insert([
        {
          full_name,
          username,
          gender,
          date_birth,
          email,
          password_hash: hashPassword,
          verification_code,
          ipUser,
          city,
          region,
          country,
          loc,
          verified: false,
        },
      ])
      .select("id");

    if (error) {
      console.error("Detailed Supabase Error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    await sendEmailToUser({
      from: `KingTech <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Código de confirmação",
      text: `Olá ${username}, agradecemos por se cadastrar na nossa loja. Para ter acesso a sua conta, você precisa verificar seu e-mail com esse código de verificação que enviamos para você. Digite esse código na página de cadastro: ${verification_code}
            
            📍 Localização do pedido de registro:
            - Cidade: ${city}
            - Estado: ${region}
    
            ⚠️ Atenção: 
            - Não compartilhe este código. 
            - Nunca pediremos códigos por e-mail ou telefone.
            - Se você não solicitou este registro, ignore esta mensagem.`,
      html: emailTemplate,
    });

    reply.setCookie("user_id", data[0].id, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 45 * 60,
    });

    return reply
      .status(200)
      .send({
        message:
          "Aguarde..., Você receberá um e-mail com o código de confirmação",
        error: false,
        technicalError: false,
      });
  } catch (error) {
    console.error("Erro ao registrar usuário: ", error);
    return reply
      .status(500)
      .send({
        message: "Erro interno no servidor.",
        error: false,
        technicalError: false,
      });
  }
};

export default registerController;
