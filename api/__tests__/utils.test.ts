import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import getEmailTemplate from "@/utils/emailTemplate";
import { isValidRole, ROLES } from "@/utils/roles";
import { UserDataRegisterSchema, UserDataLoginSchema, UserVerifySchema } from "@/utils/validateData";

vi.mock('fs/promises');

describe('Email Template', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    const filename = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(filename);

    it('Sucesso ao tranformar o e-mail template em um e-mail válido', async () => {
        const mockEmail = path.join(_dirname, '../src/templates/email.html');

        const { readFile } = await vi.importActual<typeof import('fs/promises')>('fs/promises');

        let mockConfirmEmail = await readFile(mockEmail, "utf-8") as string;

        vi.mocked(fs.readFile).mockResolvedValue(mockConfirmEmail);

        const mockData = {
            name: "Guilherme",
            code: "451236",
            city: "Teresina",
            region: "Piauí"
        };

        const sucessEmail = mockConfirmEmail
        .replace("{{name}}", mockData.name)
        .replace("{{codeConfirm}}", mockData.code)
        .replace("{{city}}", mockData.city)
        .replace("{{region}}", mockData.region);

        const result = await getEmailTemplate("Guilherme", "451236", "Teresina", "Piauí");
        expect(result).toEqual(sucessEmail);
    });

    it('Caso algum erro caia no catch, chamar o console.log e retornar nada', async () => {
        vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));
        const mockError = new Error("File not found");

        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        const result = await getEmailTemplate("Guilherme", "451236", "Teresina", "Piauí");

        expect(result).toBe("");
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Erro ao carregar o template de e-mail: "), mockError);
    });
});

describe('roles', () => {
    it('Se role for uma regra válida', async () => {
        const mockRole = 'admin';

        const result = isValidRole(mockRole);

        expect(result).toBe(true);
    });

    it('Se role for uma regra inválida', async () => {
        const mockRole = 'operator';

        const result = isValidRole(mockRole);

        expect(result).toBe(false);
    });
});

describe('ValidateData', () => {
    it('Deve retornar erro para full_name ou date_birth ou password ou code do tipo number', async () => {
        const mockData = {
            full_name: 1505451,
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934"
        };
        const mockDataDate = {
            full_name: "Guilherme",
            gender: "masculino",
            date_birth: 1515511,
            email: "teste@gmail.com",
            password: "01395934"
        };
        const mockDataPass = {
            full_name: "Guilherme",
            gender: "masculino",
            date_birth: "06/05/2003",
            email: "teste@gmail.com",
            password: 11395934
        };
        const mockDataLoginPass = {
            email: "teste@gmail.com",
            password: 11395934
        }
        const mockVerify = {
            code: 152548
        }

        const result = UserDataRegisterSchema.safeParse(mockData);
        const result2 = UserDataRegisterSchema.safeParse(mockDataDate);
        const result3 = UserDataRegisterSchema.safeParse(mockDataPass);
        const result4 = UserDataLoginSchema.safeParse(mockDataLoginPass);
        const result5 = UserVerifySchema.safeParse(mockVerify);
        expect(result.success).toBe(false);
        expect(result2.success).toBe(false);
        expect(result3.success).toBe(false);
        expect(result4.success).toBe(false);
        expect(result5.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("formato de nome inválido!");
        } else if (!result2.success) {
            expect(result2.error.issues[0]?.message).toBe("formato de data inválido!");
        } else if(!result3.success) {
            expect(result3.error.issues[0]?.message).toBe("formato de senha inválida!");
        } else if (!result4.success) {
            expect(result4.error.issues[0]?.message).toBe("formato de senha inválido!");
        };
    });

    it('Se o campo full_name ou date_birth ou password ou code for menor que três caracteres, retornar erro', async () => {
        const mockData = {
            full_name: "de",
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934"
        };
        const mockDataDate = {
            full_name: "Guilherme",
            gender: "masculino",
            date_birth: "",
            email: "teste@gmail.com",
            password: "01395934"
        };
        const mockDataPass = {
            full_name: "Guilherme",
            gender: "masculino",
            date_birth: "",
            email: "teste@gmail.com",
            password: ""
        };
        const mockDataPassLogin = {
            email: "teste@gmail.com",
            password: ""
        };
        const mockVerify = {
            code: ""
        }

        const result = UserDataRegisterSchema.safeParse(mockData);
        const result2 = UserDataRegisterSchema.safeParse(mockDataDate);
        const result3 = UserDataRegisterSchema.safeParse(mockDataPass);
        const result4 = UserDataLoginSchema.safeParse(mockDataPassLogin);
        const result5 = UserVerifySchema.safeParse(mockVerify);

        expect(result.success).toBe(false);
        expect(result2.success).toBe(false);
        expect(result3.success).toBe(false);
        expect(result4.success).toBe(false);
        expect(result5.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!");
        } else if(!result2.success) {
            expect(result2.error.issues[0]?.message).toBe("o campo (data de nascimento) é obrigatório!");
        } else if (!result3.success) {
            expect(result3.error.issues[0]?.message).toBe("o campo (senha) precisa ter no mínimo 6 caracteres!");
        } else if (!result4.success) {
            expect(result4.error.issues[0]?.message).toBe("O campo senha é obrigatório!");
        } else if (!result5.success) {
            expect(result5.error.issues[0]?.message).toBe("O código é obrigatório");
        }
    });

    it('Se o campo full_name ou email ou password for maior que 255 caracteres, retornar erro', async () => {
        const mockData = {
            full_name: "Guilherme".repeat(255),
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934"
        };
        const mockDataEmail = {
            full_name: "Guilherme",
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste".repeat(100) + "@gmail.com",
            password: "01395934"
        };
        const mockDataPass = {
            full_name: "Guilherme",
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934".repeat(100)
        };
        const mockDataLogin = {
            email: "teste".repeat(100) + "@gmail.com",
            password: "01395934"
        };
        const mockDataLoginPass = {
            email: "teste@gmail.com",
            password: "01395934".repeat(100)
        };

        const result = UserDataRegisterSchema.safeParse(mockData);
        const result2 = UserDataRegisterSchema.safeParse(mockDataEmail);
        const result3 = UserDataLoginSchema.safeParse(mockDataLogin);
        const result4 = UserDataRegisterSchema.safeParse(mockDataPass);
        const result5 = UserDataLoginSchema.safeParse(mockDataLoginPass);

        expect(result.success).toBe(false);
        expect(result2.success).toBe(false);
        expect(result3.success).toBe(false);
        expect(result4.success).toBe(false);
        expect(result5.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!");
        } else if(!result2.success) {
            expect(result2.error.issues[0]?.message).toBe("o campo (email) precisa ter no máximo 255 caracteres!");
        } else if(!result3.success) {
            expect(result3.error.issues[0]?.message).toBe("Não exagere no tamanho do email!");
        } else if(!result4.success) {
            expect(result4.error.issues[0]?.message).toBe("o campo (senha) precisa ter no máximo 255 caracteres!");
        } else if(!result5.success) {
            expect(result5.error.issues[0]?.message).toBe("Não exagere no tamanho da senha!");
        }
    });

    it('Se o campo full_name tiver mais de dois espaços seguidos, retornar erro', async () => {
        const mockData = {
            full_name: "Guil    herme",
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934"
        };

        const result = UserDataRegisterSchema.safeParse(mockData);

        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("o campo (nome completo) não pode conter mais de dois espaços seguidos!");
        };
    });

    it('Deve retornar erro caso full_name contenha números ou/e simbolos', async () => {
        const mockData = {
            full_name: "Guilh84848418",
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934"
        };
        const mockDataSymbol = {
            full_name: "Guilherme!-=",
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934"
        };
        const mockDataHifen = {
            full_name: "Guilherme-ferreira",
            gender: "masculino",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934"
        };

        const result = UserDataRegisterSchema.safeParse(mockData);
        const result2 = UserDataRegisterSchema.safeParse(mockDataSymbol);
        const result3 = UserDataRegisterSchema.safeParse(mockDataHifen);

        expect(result.success).toBe(false);
        expect(result2.success).toBe(false);
        expect(result3.success).toBe(true);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("o campo (nome completo) não pode conter números e símbolos exceto '-");
        } else if (!result2.success) {
            expect(result2.error?.issues[0]?.message).toBe("o campo (nome completo) não pode conter números e símbolos exceto '-");
        }
    });

    it('Retornar erro caso gender seja um gênero inválido', async () => {
        const mockData = {
            full_name: "Guilherme Ferreira",
            gender: "inexistente",
            date_birth: "10/06/2003",
            email: "teste@gmail.com",
            password: "01395934"
        };

        const result = UserDataRegisterSchema.safeParse(mockData);

        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("informe um gênero válido!");
        };
    });

    it('Deve retornar erro caso date_birth seja uma data inválida', async () => {
        const mockData = {
            full_name: "Guilherme Ferreira",
            gender: "masculino",
            date_birth: "1996/05/1541",
            email: "teste@gmail.com",
            password: "01395934"
        };

        const result = UserDataRegisterSchema.safeParse(mockData);

        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("formato de data inválido, use dd/mm/aaaa");
        };
    });

    it('Retornar erro se date_birth for uma data futura ou inexistente', async () => {
        const mockData = {
            full_name: "Guilherme Ferreira",
            gender: "masculino",
            date_birth: "05/06/2155",
            email: "teste@gmail.com",
            password: "01395934"
        };

        const result = UserDataRegisterSchema.safeParse(mockData);

        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("data inexistente!");
        };
    });

    it('Retornar erro caso o usuário seja menor de idade', async () => {
        const mockData = {
            full_name: "Guilherme Ferreira",
            gender: "masculino",
            date_birth: "05/07/2024",
            email: "teste@gmail.com",
            password: "01395934"
        };

        const result = UserDataRegisterSchema.safeParse(mockData);

        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("é preciso ter a idade mínima de 18 anos para comprar produtos nessa loja!");
        };
    });

    it('Retornar erro em caso de e-mail inválido', async () => {
        const mockData = {
            full_name: "Guilherme Ferreira",
            gender: "masculino",
            date_birth: "05/07/2003",
            email: "teste@teste.c",
            password: "01395934"
        };

        const mockDataLogin = {
            email: "teste@teste.c",
            password: "01395934"
        }

        const result = UserDataRegisterSchema.safeParse(mockData);
        const result2 = UserDataLoginSchema.safeParse(mockDataLogin);

        expect(result.success).toBe(false);
        expect(result2.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("formato de email inválido!");
        } else if (!result2.success) {
            expect(result2.error.issues[0]?.message).toBe("formato de email inválido!");
        }
    });

    it('Retornar erro caso o campo senha tenha espaços vazios', async () => {
        const mockData = {
            full_name: "Guilherme Ferreira",
            gender: "masculino",
            date_birth: "05/07/2003",
            email: "teste@teste.com",
            password: "0139 5934"
        };
        
        const mockDataLogin = {
            email: "teste@teste.com",
            password: "0139 5934"
        }

        const result = UserDataRegisterSchema.safeParse(mockData);
        const result2 = UserDataLoginSchema.safeParse(mockDataLogin);

        expect(result.success).toBe(false);
        expect(result2.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("o campo (senha) não pode conter espaços entre os caracteres!");
        } else if (!result2.success) {
            expect(result2.error.issues[0]?.message).toBe("Não pode haver espaços entre os caracteres da senha!");
        };
    });

    it('Deve retornar erro caso o código de confirmação tenha letras', async () => {
        const mockVerify = {
            code: "ajfoau"
        };

        const result = UserVerifySchema.safeParse(mockVerify);

        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("O código deve conter apenas números");
        };
    });

    it('Deve retornar erro caso o código de confirmação seja maior que 1 caractere mas tenha exatamente 6 caracteres', async () => {
        const mockVerify = {
            code: "153"
        };

        const result = UserVerifySchema.safeParse(mockVerify);

        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error.issues[0]?.message).toBe("O código deve ter exatamente 6 digitos");
        };
    });
});