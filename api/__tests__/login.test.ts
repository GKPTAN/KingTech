import type { FastifyRequest, FastifyReply } from 'fastify';
import loginController from '@/controllers/auth/login';

describe("Login controller", () => {
    let mockRequest: any;
    let mockReply: any;
    beforeEach(() => {
        vi.clearAllMocks();

        mockRequest = {
            body: {},
            cookies: {},
            headers: {},
            server: {
                supabase: {
                    auth: {
                        signInWithPassword: vi.fn(),
                    },
                    from: vi.fn().mockReturnThis(),
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    single: vi.fn().mockReturnThis(),
                }
            }
        };

        mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
            setCookie: vi.fn().mockReturnThis(),
        };
    });

    it("Deve retornar erro 400 se email ou senha estiverem faltando", async () => {
        mockRequest.body = {
            email: null,
            password: null,
        };

        await loginController(mockRequest, mockReply, mockRequest.server.supabase);
        expect(mockReply.status).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "E-mail e senha são obrigatórios.",
            error: true,
            technicalError: true,
        });
    });

    it("Deve retornar erro 500 se ocorrer erro na autenticação", async () => {
        mockRequest.body = {
            email: "teste@gmail.com",
            password: "teste",
        };

        mockRequest.server.supabase.auth.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: "Authentication error" },
        });

        await loginController(mockRequest, mockReply, mockRequest.server.supabase);
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro ao autenticar usuário.",
            error: true,
            technicalError: true,
            details: "Authentication error",
        });
    });

    it("Deve retornar erro 500 se ocorrer erro ao buscar detalhes do perfil", async () => {
        mockRequest.body = {
            email: "teste@gmail.com",
            password: "teste",
        };

        mockRequest.server.supabase.auth.signInWithPassword.mockResolvedValue({
            data: {
                user: { id: "user-id" },
                session: {
                    access_token: "acess-token",
                    expires_in: 3600,
                }
            },
            error: null,
        });

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Profile fetch error", code: "500" },
            })
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await loginController(mockRequest, mockReply, mockRequest.server.supabase);
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro na autenticação, tente novamente mais tarde.",
            error: true,
            technicalError: true,
            details: "Profile fetch error",
        });
    });

    it("Deve setar cookie quando a autenticação for bem-sucedida", async () => {
        mockRequest.body = {
            email: "teste@gmail.com",
            password: "teste",
        };
        
        mockRequest.server.supabase.auth.signInWithPassword.mockResolvedValue({
            data: {
                user: { id: "user-id" },
                session: {
                    access_token: "acess-token",
                    expires_in: 3600,
                }
            },
            error: null,
        });

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    city: "city",
                    country: "country",
                    full_name: "fullname",
                    gender: "gender",
                    region: "region",
                    username: "username",
                },
                error: null,
            })
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await loginController(mockRequest, mockReply, mockRequest.server.supabase);
        expect(mockReply.setCookie).toHaveBeenCalledWith("token", "acess-token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 3600,
        });
    });

    it("Deve retornar erro ao setar o cookie quando o token de acesso não for encontrado", async () => {
        mockRequest.body = {
            email: "teste@gmail.com",
            password: "teste",
        };

        mockRequest.server.supabase.auth.signInWithPassword.mockResolvedValue({
            data: {
                user: { id: "user-id" },
                session: {
                    access_token: null,
                    expires_in: 3600,
                }
            },
            error: null,
        });

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    city: "city",
                    country: "country",
                    full_name: "fullname",
                    gender: "gender",
                    region: "region",
                    username: "username",
                },
                error: null,
            })
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await loginController(mockRequest, mockReply, mockRequest.server.supabase);
        expect(consoleSpy).toHaveBeenCalledWith("Erro no controlador de login: ", expect.objectContaining({ message: "Token de acesso não encontrado na sessão." }));
    });

    it("Deve setar cookie de refresh token quando a autenticação for bem-sucedida", async () => {
        mockRequest.body = {
            email: "teste@gmail.com",
            password: "teste",
        };

        mockRequest.server.supabase.auth.signInWithPassword.mockResolvedValue({
            data: {
                user: { id: "user-id" },
                session: {
                    access_token: "access-token",
                    refresh_token: "refresh-token",
                    expires_in: 3600,
                }
            },
            error: null,
        });

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    city: "city",
                    country: "country",
                    full_name: "fullname",
                    gender: "gender",
                    region: "region",
                    username: "username",
                },
                error: null,
            })
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await loginController(mockRequest, mockReply, mockRequest.server.supabase);
        expect(mockReply.setCookie).toHaveBeenCalledWith("refresh_token", "refresh-token", {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 24 * 30,
        })
    });

    it("Deve retornar erro caso não exista um email na sessão", async () => {
        mockRequest.body = {
            email: "teste@gmail.com",
            password: "teste",
        };

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        mockRequest.server.supabase.auth.signInWithPassword.mockResolvedValue({
            data: {
                user: {
                    id: "user-id",
                },
                session: {
                    access_token: "access-token",
                    refresh_token: "refresh-token",
                    expires_in: 3600,
                    user: {
                        id: "user-id",
                        email: null,
                    }
                }
            },
            error: null,
        });

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    city: "city",
                    country: "country",
                    full_name: "fullname",
                    gender: "gender",
                    region: "region",
                    username: "username",
                },
                error: null,
            })
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await loginController(mockRequest, mockReply, mockRequest.server.supabase);
        expect(consoleSpy).toHaveBeenCalledWith("Erro no controlador de login: ", expect.objectContaining({ message: "a propriedade e-mail está indefinida no objeto session" }));
    });

    it('Deve autenticar com sucesso e retornar os detalhes do perfil', async () => {
        mockRequest.body = {
            email: "teste@gmail.com",
            password: "teste",
        };

        mockRequest.server.supabase.auth.signInWithPassword.mockResolvedValue({
            data: {
                user: { id: "user-id" },
                session: {
                    access_token: "acess-token",
                    expires_in: 3600,
                    user: {
                        id: "user-id",
                        email: "teste@gmail.com",
                        user_metadata: {
                            role: "user"
                        }
                    }
                }
            },
            error: null,
        });

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    city: "city",
                    country: "country",
                    full_name: "fullname",
                    gender: "gender",
                    region: "region",
                    username: "username",
                },
                error: null,
            })
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await loginController(mockRequest, mockReply, mockRequest.server.supabase);
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Login realizado com sucesso.",
            error: false,
            technicalError: false,
            user: {
                id: "user-id",
                name: "username",
                email: "teste@gmail.com",
                role: "user",
                raw: {
                    city: "city",
                    country: "country",
                    full_name: "fullname",
                    gender: "gender",
                    region: "region",
                    username: "username",
                },
            },
            expiresIn: 3600,
            location: "/account/dashboard",
        });
    });
});