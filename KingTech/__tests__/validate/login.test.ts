/* eslint-disable no-undef */
import { validateDataLogin } from "@/utils/validateData";

describe("validateDataLogin", () => {
    test("Retornar true para dados válidos", async () => {
        const mockValidData = {
            email: "teste@gmail.com",
            password: "senha123"
        }
        const result = await validateDataLogin(mockValidData);
        expect(result).toBe(true);
    });
    test("Retornar erro para e-mail inválido", async () => {
        const mockInvalidEmail = {
            email: "invalid-email@g",
            password: "senha123"
        }
        const result = await validateDataLogin(mockInvalidEmail);
        expect(result).toEqual({
            error: true,
            field: "email",
            issue: "invalid_format",
            message: "Formato de email inválido!"
        });
    });
    test("Retornar erro para e-mail maior que 255 caracteres", async () => {
        const mockBigEmail = {
            email: "teste".repeat(300) + "@gmail.com",
            password: "senha123"
        }
        const result = await validateDataLogin(mockBigEmail);
        expect(result).toEqual({
            error: true,
            field: "email",
            issue: "too_big",
            message: "Não exagere no tamanho do email!"
        });
        console.log("email length: ", mockBigEmail.email.length);
    });
    test("Retornar erro para senha vazia", async () => {
        const mockVoidPass = {
            email: "teste@gmail.com",
            password: ""
        }
        const result = await validateDataLogin(mockVoidPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "too_small",
            message: "O campo senha é obrigatório!"
        });
    });
    test("Retornar erro para senha maior que 1 caractere e menor que 6 caracteres", async () => {
        const mockShortPass = {
            email: "teste@gmail.com",
            password: "sen1"
        }
        const result = await validateDataLogin(mockShortPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "too_small",
            message: "Sua senha precisa ter no mínimo 6 caracteres!"
        });
    });
    test("Retornar erro para senha maior que 255 caractere", async () => {
        const mockBigPass = {
            email: "teste@gmail.com",
            password: "senha123".repeat(300)
        }
        const result = await validateDataLogin(mockBigPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "too_big",
            message: "Não exagere no tamanho da senha!"
        });
    });
    test("Retornar erro para senha com espaços vazios", async () => {
        const mockInvalidPass = {
            email: "teste@gmail.com",
            password: "senha 123"
        }
        const result = await validateDataLogin(mockInvalidPass);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "custom",
            message: "Não pode haver espaços entre os caracteres da senha!"
        });
    });
    test("Retornar erro para senha do tipo number", async () => {
        const mockNumberPass = {
        email: "teste@gmail.com",
        password: 18486448
    }
        const result = await validateDataLogin(mockNumberPass as any);
        expect(result).toEqual({
            error: true,
            field: "password",
            issue: "invalid_type",
            message: "formato de senha inválido!"
        });
    });
});