import { z } from "zod";

import type { UserDataLogin, UserDataRegister } from "../types/userData";

import { departmentsData } from "@/data/departmentsData";

export interface ErrorValidate {
    error: boolean;
    field: string;
    issue: string;
    message: string;
    technicalError?: boolean;
}

const validGenders = ["masculino", "feminino", "binary", "non-binary", "outros"] as const;
const regexDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const UserDataRegisterSchema = z.object({
    full_name: z.string("formato de nome inválido!").trim().min(3, "o nome precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!").max(255, "o nome precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!").regex(/^((?!\s{3,}).)*$/, "o nome não pode conter mais de dois espaços seguidos!").regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "o nome não pode conter números e símbolos exceto '-"),
    gender: z.enum(validGenders, {
        error: () => ({ message: "informe um gênero válido!"})
    }),
    date_birth: z.string("formato de data inválido!").min(1, "a data de nascimento é obrigatória!")
    .refine((val) => regexDate.test(val), "formato de data inválido, use dd/mm/aaaa")
    .refine((val) => {
        const [dia, mes, ano] = val.split('/').map(Number);
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
        const [dia, mes, ano] = val.split('/').map(Number);
        const today = new Date();
        let age = today.getFullYear() - ano;
        const hadBirthDayThisYear = (
            today.getMonth() > (mes - 1) || 
            (today.getMonth() === (mes - 1) && today.getDate() >= dia)
        );
        const realAge = hadBirthDayThisYear ? age : age - 1;

        return realAge >= 18;
    }, "é preciso ter a idade mínima de 18 anos para comprar produtos nessa loja!"),
    email: z.email("formato de email inválido!").max(255, "o e-mail precisa ter no máximo 255 caracteres!"),
    password: z.string("formato de senha inválida!").min(6, "a senha precisa ter no mínimo 6 caracteres!").max(255, "a senha precisa ter no máximo 255 caracteres!").refine((val) => !val.includes(" "), "a senha não pode conter espaços entre os caracteres!")
});

export const validateDataRegister = async (userData: UserDataRegister, confirm_password: string): Promise<ErrorValidate | boolean> => {

    const {full_name, gender, date_birth, email, password} = userData;

    if (password !== confirm_password) {
        return {
            error: true,
            field: "confirm_password",
            issue: "password_mismatch",
            message: "As senhas não coincidem!"
        }
    }

    try {
        UserDataRegisterSchema.parse({
            full_name: full_name,
            gender: gender,
            date_birth: date_birth,
            email: email,
            password: password
        });

        return true;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return {
                error: true,
                field: firstError.path[0] as string,
                issue: firstError.code,
                message: firstError.message
            }
        }

        throw error;
    }
};

export const UserDataLoginSchema = z.object({
    email: z.email("Formato de email inválido!").max(255, "Não exagere no tamanho do email!"),
    password: z.string("formato de senha inválido!").min(1, "O campo senha é obrigatório!").min(6, "Sua senha precisa ter no mínimo 6 caracteres!").max(255, "Não exagere no tamanho da senha!").refine((val) => !val.includes(" "), "Não pode haver espaços entre os caracteres da senha!")
});

export const validateDataLogin = async (userData: UserDataLogin): Promise<ErrorValidate | boolean> => {
    const { email, password } = userData;

    try {
        UserDataLoginSchema.parse({
            email: email,
            password: password
        });

        return true;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return {
                error: true,
                field: firstError.path[0] as string,
                issue: firstError.code,
                message: firstError.message
            }
        }   

        throw error;
    }
}

const validDepartments = Object.keys(departmentsData) as [string, ...string[]];
const validSubcategories = Object.values(departmentsData).flatMap(dept => dept.subcategories.map(sub => sub.slug)) as [string, ...string[]];

const VariantsProductSchema = z.object({
  category: z.string().trim().min(2, "A categoria é obrigatória"),
  options: z.array(z.string().trim().min(1, "A opção de variante não pode ficar vazia.")).min(1, "Adicione pelo menos uma opção de variante!")
});

const MainInfoProductShema = z.object({
  id: z.number(),
  title: z.string().trim().min(2, "O titulo é obrigatório!"),
  info: z.string().trim().min(3, "A informação é obrigatória"),
});

export const createProductSchema = z.object({
    brand: z.string().trim().min(2, "A marca é obrigatória").max(100, "O nome da marca é muito longo! Simplifique"),
    name: z.string().trim().min(3, "O nome do produto precisa ter no mínimo 3 caracteres").max(100, "O nome do produto deve ter no máximo 100 caracteres"),
    code: z.string().trim().length(10, "O código precisa ter exatamente 10 caracteres"),
    quantity: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().min(0, "A quantidade não pode ser negativa")),
    department: z.enum(validDepartments, "Selecione um departamento válido da lista!"),
    subcategory: z.enum(validSubcategories, "Selecione uma subcategoria válida da lista!"),
    tags: z.array(z.string()).min(1, "Adicione pelo menos uma tag no produto!"),
    images: z.array(z.any()).min(1, "Adicione pelo menos 1 imagem do produto!"),
    prev_price: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().optional().nullable()),
    descount: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().min(1, "O desconto deve estar entre 1 a 100").max(100, "O desconto não pode passar de 100").optional().nullable()),
    price_in_card_store: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number().min(1, "Preço inválido")),
    price_part_in_card_store: z.preprocess((val) => (val === "" || val === null ? null : Number(val)), z.number("O preço total parcelado no cartão da loja é obrigatório!").min(1, "Preço obrigatório").nullable()),
    price_pix: z.preprocess((val) => (val === "" || val === null ? null : Number(val)), z.number("O preço no pix é obrigatório").min(1, "Preço inválido").nullable()),
    descount_pix: z.preprocess((val) => (val === "" || val === null ? null : Number(val)), z.number().optional().nullable()),
    variants: z.array(VariantsProductSchema).default([]),
    main_informations: z.array(MainInfoProductShema).default([]),
    specs: z.record(z.string(), z.string()).refine((obj) => Object.keys(obj).length > 0, {error: () => ({message: "Adicione pelo menos uma especificação técnica na ficha do produto"})})
});

export type createProductInput = z.input<typeof createProductSchema>;

export const validateProductData = async (productData: createProductInput): Promise<ErrorValidate | boolean> => {
    try {
        createProductSchema.parse(productData);

        return true;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return {
                error: true,
                field: firstError.path[0] as string,
                issue: firstError.code,
                message: firstError.message
            }
        }

        throw error;
    }
}