/* eslint-disable no-undef */
import { validateDataRegister } from "@/utils/validateData";

describe("validateDataRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("retornar true para dados válidos", async () => {
    const mockUserData = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";

    const result = await validateDataRegister(
      mockUserData,
      mock_confirm_password,
    );
    expect(result).toBe(true);
  });

  test("retornar erro para nome com espaços entre os caracteres", async () => {
    const mockNameInvalid = {
      full_name: "João Si   lva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";

    const result = await validateDataRegister(
      mockNameInvalid as any,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "full_name",
      issue: "invalid_format",
      message:
        "o campo (nome completo) não pode conter mais de dois espaços seguidos!",
    });
  });
  test("retornar erro para nome menor que 3 caracteres", async () => {
    const mockShortName = {
      full_name: "Jo",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockShortName as any,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "full_name",
      issue: "too_small",
      message:
        "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!",
    });
  });
  test("retornar erro para nome maior que 255 caracteres", async () => {
    const mockBigName = {
      full_name: "teste".repeat(100),
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockBigName,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "full_name",
      issue: "too_big",
      message:
        "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!",
    });
  });
  test("retornar erro para nome que contenha números ou simbolos", async () => {
    const mockNameHasNumber = {
      full_name: "João9!silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockNameHasNumber,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "full_name",
      issue: "invalid_format",
      message:
        "o campo (nome completo) não pode conter números e símbolos exceto '-",
    });
  });
  test("retornar erro para gênero inválido", async () => {
    const mockInvalidGender = {
      full_name: "João Silva",
      gender: "nenhum",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockInvalidGender as any,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "gender",
      issue: "invalid_value",
      message: "informe um gênero válido!",
    });
  });
  test("retornar erro para data menor que 1 caractere", async () => {
    const mockShortDate = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockShortDate,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "date_birth",
      issue: "too_small",
      message: "o campo (data de nascimento) é obrigatório!",
    });
  });
  test("retornar erro para data inválida", async () => {
    const mockInvalidDate = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "00000/0/097",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockInvalidDate,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "date_birth",
      issue: "custom",
      message: "formato de data inválido, use dd/mm/aaaa",
    });
  });
  test("retornar erro para data futura", async () => {
    const mockFutureDate = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "08/08/2100",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockFutureDate,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "date_birth",
      issue: "custom",
      message: "data inexistente!",
    });
  });
  test("retornar erro para registro de menores de 18 anos", async () => {
    const mockMinor = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "08/08/2024",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(mockMinor, mock_confirm_password);
    expect(result).toEqual({
      error: true,
      field: "date_birth",
      issue: "custom",
      message:
        "é preciso ter a idade mínima de 18 anos para comprar produtos nessa loja!",
    });
  });
  test("retornar erro para e-mail inválido", async () => {
    const mockInvalidEmail = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.c",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockInvalidEmail,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "email",
      issue: "invalid_format",
      message: "formato de email inválido!",
    });
  });
  test("retornar erro para e-mail maior que 255 caracteres", async () => {
    const mockBigEmail = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste".repeat(100) + "@gmail.c",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockBigEmail,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "email",
      issue: "invalid_format",
      message: "formato de email inválido!",
    });
  });
  test("retornar erro para senha menor que 6 caracteres", async () => {
    const mockShortPass = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "sen",
    } as const;

    const mock_confirm_pass_small = "sen";
    const result = await validateDataRegister(
      mockShortPass,
      mock_confirm_pass_small,
    );
    expect(result).toEqual({
      error: true,
      field: "password",
      issue: "too_small",
      message: "o campo (senha) precisa ter no mínimo 6 caracteres!",
    });
  });
  test("retornar erro para senha maior que 255 caracteres", async () => {
    const mockBigPass = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha".repeat(100),
    } as const;

    const mock_confirm_pass_big = "senha".repeat(100);
    const result = await validateDataRegister(
      mockBigPass,
      mock_confirm_pass_big,
    );
    expect(result).toEqual({
      error: true,
      field: "password",
      issue: "too_big",
      message: "o campo (senha) precisa ter no máximo 255 caracteres!",
    });
  });
  test("retornar erro para senha inválida", async () => {
    const mockInvalidPass = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha 123",
    } as const;

    const mock_confirm_pass_invalid = "senha 123";
    const result = await validateDataRegister(
      mockInvalidPass,
      mock_confirm_pass_invalid,
    );
    expect(result).toEqual({
      error: true,
      field: "password",
      issue: "custom",
      message: "o campo (senha) não pode conter espaços entre os caracteres!",
    });
  });
  test("retornar erro para senhas que não coincidem", async () => {
    const mockInvalidPass = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha1234",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockInvalidPass,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "confirm_password",
      issue: "password_mismatch",
      message: "As senhas não coincidem!",
    });
  });
  test("retornar erro para nome do tipo number", async () => {
    const mockNumberName = {
      full_name: 45844848,
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockNumberName as any,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "full_name",
      issue: "invalid_type",
      message: "formato de nome inválido!",
    });
  });
  test("retornar erro para data do tipo number", async () => {
    const mockNumberDate = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: 15081996,
      email: "teste@gmail.com",
      password: "senha123",
    } as const;

    const mock_confirm_password = "senha123";
    const result = await validateDataRegister(
      mockNumberDate as any,
      mock_confirm_password,
    );
    expect(result).toEqual({
      error: true,
      field: "date_birth",
      issue: "invalid_type",
      message: "formato de data inválido!",
    });
  });
  test("retornar erro para senha do tipo number", async () => {
    const mockNumberPass = {
      full_name: "João Silva",
      gender: "masculino",
      date_birth: "15/08/1996",
      email: "teste@gmail.com",
      password: 12345678,
    } as const;
    const mock_confirm_pass_number = <string>(<unknown>12345678);
    const result = await validateDataRegister(
      mockNumberPass as any,
      mock_confirm_pass_number,
    );
    expect(result).toEqual({
      error: true,
      field: "password",
      issue: "invalid_type",
      message: "formato de senha inválida!",
    });
  });
});
