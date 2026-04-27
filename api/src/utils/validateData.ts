import { z } from 'zod';

const validGenders = ["masculino", "feminino", "binary", "non-binary", "outros"] as const;
const regexDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const parseData = (val: string) => val.split('/').map(Number) as [number, number, number];

export const UserDataRegisterSchema = z.object({
    full_name: z.string("formato de nome inválido!").trim().min(3, "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!").max(255, "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!").regex(/^((?!\s{3,}).)*$/, "o campo (nome completo) não pode conter mais de dois espaços seguidos!").regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "o campo (nome completo) não pode conter números e símbolos exceto '-"),
    gender: z.enum(validGenders, {
        error: () => ({ message: "informe um gênero válido!"})
    }),
    date_birth: z.string("formato de data inválido!").min(1, "o campo (data de nascimento) é obrigatório!")
    .refine((val) => regexDate.test(val), "formato de data inválido, use dd/mm/aaaa")
    .refine((val) => {
        const [dia, mes, ano] = parseData(val);
        const dateObj = new Date(ano, mes - 1, dia);
        const today = new Date();

        const validDate = (
            dateObj.getDate() === dia && 
            dateObj.getMonth() === mes - 1 && 
            dateObj.getFullYear() === ano
        );

        return validDate && dateObj <= today;
    }, "data inexistente!")
    .refine((val) => {
        const [dia, mes, ano] = parseData(val);
        const today = new Date();
        let age = today.getFullYear() - ano;
        const hadBirthDayThisYear = (
            today.getMonth() > (mes - 1) || 
            (today.getMonth() === (mes - 1) && today.getDate() >= dia)
        );
        const realAge = hadBirthDayThisYear ? age : age - 1;

        return realAge >= 18;
    }, "é preciso ter a idade mínima de 18 anos para comprar produtos nessa loja!"),
    email: z.email("formato de email inválido!").max(255, "o campo (email) precisa ter no máximo 255 caracteres!"),
    password: z.string("formato de senha inválida!").min(6, "o campo (senha) precisa ter no mínimo 6 caracteres!").max(255, "o campo (senha) precisa ter no máximo 255 caracteres!").refine((val) => !val.includes(" "), "o campo (senha) não pode conter espaços entre os caracteres!")
});

export type RegisterInput = z.infer<typeof UserDataRegisterSchema>;

export const UserDataLoginSchema = z.object({
    email: z.email("Formato de email inválido!").max(255, "Não exagere no tamanho do email!"),
    password: z.string("formato de senha inválido!").min(1, "O campo senha é obrigatório!").min(6, "Sua senha precisa ter no mínimo 6 caracteres!").max(255, "Não exagere no tamanho da senha!").refine((val) => !val.includes(" "), "Não pode haver espaços entre os caracteres da senha!")
});

export type LoginInput = z.infer<typeof UserDataLoginSchema>;

export const UserVerifySchema = z.object({
    code: z.string()
    .min(1, "O código é obrigatório")
    .regex(/^\d+$/, "O código deve conter apenas números")
    .length(6, "O código deve ter exatamente 6 digitos")
});

export type VerifyInput = z.infer<typeof UserVerifySchema>;