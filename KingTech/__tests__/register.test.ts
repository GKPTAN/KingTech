/* eslint-disable no-undef */
import { validateDataRegister } from "../src/utils/validateData";

const userData = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senha123"
}
const numberName = {
    full_name: 45844848,
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senha123"
}
const numberDate = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: 15081996,
    email: "teste@gmail.com",
    password: "senha123"
}
const numberPass = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: 12345678
}
const nameInvalid = {
    full_name: "João Si   lva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senha123"
}

const shortName = {
    full_name: "Jo",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senha123"
}

const bigName = {
    full_name: "Jofhueahsiudhuifghasduihvuhdsuhvgudhsfuguisdhuchfuvhdushfguhdsuhfughdushreugfdshuhcfuxfsughuirhuhuiredsfhuhfudhughusduhfguhrdufhgurhdsuhufghduguhfuhufghduishufghdufsdhufhusdhufhsudhfgfhusdhufhyegwygeydgfygesyfgewgyagdyufguyesgdygfyeuwsgfyuesgdyfgfagsdgfuadgsuyfagsdfuygsyugerfuygaewsuygfyuegryufgauyegeyfgaryegfyuregyfguyagfygayufgauygfyg",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senha123"
}

const nameENumber = {
    full_name: "João9!silva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senha123"
}

const invalidGender = {
    full_name: "João Silva",
    gender: "nenhum",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senha123"
}

const shortDate = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "",
    email: "teste@gmail.com",
    password: "senha123"
}

const invalidDate = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "00000/0/097",
    email: "teste@gmail.com",
    password: "senha123"
}

const futureDate = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "08/08/2100",
    email: "teste@gmail.com",
    password: "senha123"
}

const minor = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "08/08/2024",
    email: "teste@gmail.com",
    password: "senha123"
}

const invalidEmail = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.c",
    password: "senha123"
}

const bigEmail = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "fahfgfdhguhahgauhfguhguhruhgureghueahguarhdueghburefdhgbureahgburehreugaeughuraejgbhurtesteggjadiojvgieorfedhihgiaerihfodrhgriehgierfhihgireaohgreihgohreghrieahgriehgiegheaofhgiorefhgihrefihgirehghrfghrefhoihohgorihfgurhfgurhfgurhfughrhgurehtureghruehguiefahthureathurehguhrueghurehgurehguhrueghaurehgurehguhreauhaurehgureg@gmail.c",
    password: "senha123"
}

const shortPass = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "sen"
}

const bigPass = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senfuwehfuiiegfugdergtuewgdsuifgreduisgfuredsuiaguregdsufrgefureuguagfuiergugwehhfurehgtgeurifdsuuidaghufihdfguhaudgushgufdhfughuredghurehguhauhuahdguhreudghurehguhreughraughurhgurehguhaughuarhgurahguhraughauhgurehguifhuahguradhuefgrehgurhuhgfaifhiroahgreahgureahgvurefhguhaufhguhgufdhgureughureghreuhguergahgurhfguhguehguerhguerhguheugh"
}

const invalidPass = {
    full_name: "João Silva",
    gender: "masculino",
    date_birth: "15/08/1996",
    email: "teste@gmail.com",
    password: "senha 123"
}

const confirm_password = "senha123";
const confirm_pass_small = "sen";
const confirm_pass_big = "senfuwehfuiiegfugdergtuewgdsuifgreduisgfuredsuiaguregdsufrgefureuguagfuiergugwehhfurehgtgeurifdsuuidaghufihdfguhaudgushgufdhfughuredghurehguhauhuahdguhreudghurehguhreughraughurhgurehguhaughuarhgurahguhraughauhgurehguifhuahguradhuefgrehgurhuhgfaifhiroahgreahgureahgvurefhguhaufhguhgufdhgureughureghreuhguergahgurhfguhguehguerhguerhguheugh";
const confirm_pass_invalid = "senha 123";
const confirm_pass_number = <string><unknown>12345678;

describe("validateDataRegister", () => {
  test("retornar true para dados válidos", async () => {
    const result = await validateDataRegister(userData, confirm_password);
    expect(result).toBe(true);
  });
  
  test("retornar erro para nome com espaços entre os caracteres", async () => {
    const result = await validateDataRegister(nameInvalid, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "full_name",
        issue: "invalid_format",
        message: "o campo (nome completo) não pode conter mais de dois espaços seguidos!"
    });
  });
  test("retornar erro para nome menor que 3 caracteres", async () => {
    const result = await validateDataRegister(shortName, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "full_name",
        issue: "too_small",
        message: "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!"
    });
  });
  test("retornar erro para nome maior que 255 caracteres", async () => {
    const result = await validateDataRegister(bigName, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "full_name",
        issue: "too_big",
        message: "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!"
    });
  });
  test("retornar erro para nome que contenha números ou simbolos", async () => {
    const result = await validateDataRegister(nameENumber, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "full_name",
        issue: "invalid_format",
        message: "o campo (nome completo) não pode conter números e símbolos exceto '-"
    });
  });
  test("retornar erro para gênero inválido", async () => {
    const result = await validateDataRegister(invalidGender, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "gender",
        issue: "invalid_value",
        message: "informe um gênero válido!"
    });
  });
  test("retornar erro para data menor que 1 caractere", async () => {
    const result = await validateDataRegister(shortDate, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "date_birth",
        issue: "too_small",
        message: "o campo (data de nascimento) é obrigatório!"
    });
  });
  test("retornar erro para data inválida", async () => {
    const result = await validateDataRegister(invalidDate, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "date_birth",
        issue: "custom",
        message: "formato de data inválido, use dd/mm/aaaa"
    });
  });
  test("retornar erro para data futura", async () => {
    const result = await validateDataRegister(futureDate, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "date_birth",
        issue: "custom",
        message: "data inexistente!"
    });
  });
  test("retornar erro para registro de menores de 18 anos", async () => {
    const result = await validateDataRegister(minor, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "date_birth",
        issue: "custom",
        message: "é preciso ter a idade mínima de 18 anos para comprar produtos nessa loja!"
    });
  });
  test("retornar erro para e-mail inválido", async () => {
    const result = await validateDataRegister(invalidEmail, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "email",
        issue: "invalid_format",
        message: "formato de email inválido!"
    });
  });
  test("retornar erro para e-mail maior que 255 caracteres", async () => {
    const result = await validateDataRegister(bigEmail, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "email",
        issue: "invalid_format",
        message: "formato de email inválido!"
    });
  });
  test("retornar erro para senha menor que 6 caracteres", async () => {
    const result = await validateDataRegister(shortPass, confirm_pass_small);
    expect(result).toEqual({
        error: true,
        field: "password",
        issue: "too_small",
        message: "o campo (senha) precisa ter no mínimo 6 caracteres!"
    });
  });
  test("retornar erro para senha maior que 255 caracteres", async () => {
    const result = await validateDataRegister(bigPass, confirm_pass_big);
    expect(result).toEqual({
        error: true,
        field: "password",
        issue: "too_big",
        message: "o campo (senha) precisa ter no máximo 255 caracteres!"
    });
  });
  test("retornar erro para senha inválida", async () => {
    const result = await validateDataRegister(invalidPass, confirm_pass_invalid);
    expect(result).toEqual({
        error: true,
        field: "password",
        issue: "custom",
        message: "o campo (senha) não pode conter espaços entre os caracteres!"
    });
  });
  test("retornar erro para senhas que não coincidem", async () => {
    const result = await validateDataRegister(invalidPass, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "confirm_password",
        issue: "password_mismatch",
        message: "As senhas não coincidem!"
    });
  });
  test("retornar erro para nome do tipo number", async () => {
    const result = await validateDataRegister(numberName, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "full_name",
        issue: "invalid_type",
        message: "formato de nome inválido!"
    });
  });
  test("retornar erro para data do tipo number", async () => {
    const result = await validateDataRegister(numberDate, confirm_password);
    expect(result).toEqual({
        error: true,
        field: "date_birth",
        issue: "invalid_type",
        message: "formato de data inválido!"
    });
  });
  test("retornar erro para senha do tipo number", async () => {
    const result = await validateDataRegister(numberPass, confirm_pass_number);
    expect(result).toEqual({
        error: true,
        field: "password",
        issue: "invalid_type",
        message: "formato de senha inválida!"
    });
  });
});