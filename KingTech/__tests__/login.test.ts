/* eslint-disable no-undef */
import { validateDataLogin } from "../src/utils/validateData";

const validData = {
    email: "teste@gmail.com",
    password: "senha123"
}

const invalidEmail = {
    email: "invalid-email@g",
    password: "senha123"
}

const bigEmail = {
    email: "teste".repeat(300) + "@gmail.com",
    password: "senha123"
}
const voidPass = {
    email: "teste@gmail.com",
    password: ""
}
const shortPass = {
    email: "teste@gmail.com",
    password: "sen1"
}
const bigPass = {
    email: "teste@gmail.com",
    password: "senha123".repeat(300)
}
const invalidPass = {
    email: "teste@gmail.com",
    password: "senha 123"
}
const numberPass = {
    email: "teste@gmail.com",
    password: 18486448
}

describe("validateDataLogin", () => {
    test("Retornar true para dados válidos", async () => {
        const result = await validateDataLogin(validData);
        expect(result).toBe(true);
    });
    test("Retornar erro para e-mail inválido", async () => {
        const result = await validateDataLogin(invalidEmail);
        expect(result).toEqual({
            error: true,
            field: "email",
            issue: "invalid_format",
            message: "Formato de email inválido!"
        });
    });
    test("Retornar erro para e-mail maior que 255 caracteres", async () => {
        const result = await validateDataLogin(bigEmail);
        expect(result).toEqual({
            error: true,
            field: "email",
            issue: "too_big",
            message: "Não exagere no tamanho do email!"
        });
        console.log("email length: ", bigEmail.email.length);
    });
    test("Retornar erro para senha vazia", async () => {
        const result = await validateDataLogin(voidPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "too_small",
            message: "O campo senha é obrigatório!"
        });
    });
    test("Retornar erro para senha maior que 1 caractere e menor que 6 caracteres", async () => {
        const result = await validateDataLogin(shortPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "too_small",
            message: "Sua senha precisa ter no mínimo 6 caracteres!"
        });
    });
    test("Retornar erro para senha maior que 255 caractere", async () => {
        const result = await validateDataLogin(bigPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "too_big",
            message: "Não exagere no tamanho da senha!"
        });
    });
    test("Retornar erro para senha com espaços vazios", async () => {
        const result = await validateDataLogin(invalidPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "custom",
            message: "Não pode haver espaços entre os caracteres da senha!"
        });
    });
    test("Retornar erro para senha do tipo number", async () => {
        const result = await validateDataLogin(numberPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "invalid_type",
            message: "formato de senha inválido!"
        });
    });
});