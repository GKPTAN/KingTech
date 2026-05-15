import { create } from "node:domain";

const { mockSupabase } = vi.hoisted(() => {
    return {
        mockSupabase: {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(),
            insert: vi.fn().mockResolvedValue({ error: null }),
            delete: vi.fn().mockReturnThis(),
            auth: {
                admin: {
                    createUser: vi.fn(),
                    deleteUser: vi.fn(),
                }
            },
        },
    }
});

vi.mock("@/types/auth/authClientVerify", () => ({
    EnvSupabase: {
        SUPABASE_URL: 'http://localhost:54321',
        SUPABASE_KEY: 'fake-key'
    }
}));

vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mockSupabase),
    SupabaseClient: vi.fn(),
}));

import AuthClient from "@/controllers/auth/AuthClient";

describe("AuthClient", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockSupabase.from.mockReturnThis();
        mockSupabase.select.mockReturnThis();
        mockSupabase.eq.mockImplementation(() => {
            const promise = Promise.resolve({ error: null });
            Object.assign(promise, mockSupabase);
            return promise;
        });
        mockSupabase.delete.mockReturnThis();
    });

    it('Deve criar o usuário com sucesso quando o código for válido', async () => {
        mockSupabase.single.mockResolvedValue({
            data: {
                id: 'user-id',
                email: "teste@gmail.com",
                verification_code: "123456",
                password_hash: "hashedpassword",
                full_name: "Guilherme",
                username: "guigui",
                city: "Teresina",
                region: "Piauí",
                country: "Brasil",
                gender: "masculino",
                date_birth: "2000-01-01",
                ipUser: "127.0.0.1",
                loc: "0,0",
                role: "user",
                created_at: new Date().toISOString(),
                verified: false
            },
            error: null,
        });

        mockSupabase.auth.admin.createUser.mockResolvedValue({
            data: { user: { id: "auth-uuid-123" } },
            error: null,
        });

        mockSupabase.insert.mockResolvedValue({ error: null });

        mockSupabase.eq.mockImplementation(function() {
            return Object.assign(Promise.resolve({ error: null }), mockSupabase);
        })

        const result = await AuthClient.verifyAndCreateUser('user-id', '123456');

        expect(result.success).toBe(true);
        expect(result.userId).toBe("auth-uuid-123");
    });

    it('Deve lançar erro quando o código de verificação for inválido', async () => {
        mockSupabase.single.mockResolvedValue({
            data: {
                verification_code: "654321"
            },
            error: null,
        });

        await expect(AuthClient.verifyAndCreateUser('id', '123456')).rejects.toThrow("Código de verificação inválido.");
    });

    it('Deve deletar o usuário do Auth se a criação do perfil falhar', async () => {
        mockSupabase.single.mockResolvedValue({
            data: { verification_code: "123456", password_hash: "hashedpassword", },
            error: null,
        });

        mockSupabase.auth.admin.createUser.mockResolvedValue({
            data: { user: { id: "auth-uuid-123" } },
            error: null,
        });

        mockSupabase.insert.mockResolvedValue({
            error: new Error("Falha no banco")
        });

        await expect(AuthClient.verifyAndCreateUser('id', '123456')).rejects.toThrow();
        expect(mockSupabase.auth.admin.deleteUser).toHaveBeenCalledWith("auth-uuid-123");
    });

    it('Deve lançar erro quando o banco de dados retornar um fetch error', async () => {
        mockSupabase.single.mockResolvedValue({
            data: null,
            error: { message: "Database conection error", code: "500" },
        });

        await expect(AuthClient.verifyAndCreateUser('id', '123456')).rejects.toThrow("Usuário não encontrado ou erro ao buscar dados.");
    });

    it('Deve lançar erro quando o usuário não for encontrado', async () => {
        mockSupabase.single.mockResolvedValue({
            data: null,
            error: null,
        });

        await expect(AuthClient.verifyAndCreateUser('id', '123456')).rejects.toThrow("Usuário não encontrado ou erro ao buscar dados.");
    });
});