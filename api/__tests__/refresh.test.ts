import refreshController from '@/controllers/auth/refresh';
import { email } from 'zod';

describe("refresh controller", () => {
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
                        refreshSession: vi.fn()
                    }
                }
            }
        };

        mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
            setCookie: vi.fn().mockReturnThis(),
            clearCookie: vi.fn().mockReturnThis()
        };
    });

    it('Deve retornar 401 se o refresh token não for fornecido', async () => {
        await refreshController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Refresh token não fornecido",
            error: false,
            technicalError: true
        });
    });

    it('Deve retornar 401 se retornar erro ou não tiver sessão', async () => {
        mockRequest.cookies = {
            refresh_token: "fake_refresh"
        };

        mockRequest.server.supabase.auth.refreshSession.mockResolvedValue({
            data: { user: null, session: null },
            error: {message: "Invalid token"}
        });

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await refreshController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Refresh falhou: ", expect.objectContaining({
            user: null,
            session: null
        }));
        expect(mockReply.clearCookie).toHaveBeenCalledWith("token", expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }));
        expect(mockReply.clearCookie).toHaveBeenCalledWith("refresh_token", expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }));
        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Refresh token inválido ou expirado",
            error: false,
            technicalError: true,
        });
    });

    it('Deve retornar 401 se não tiver uma sessão', async () => {
        mockRequest.cookies = {
            refresh_token: "fake_refresh"
        };

        mockRequest.server.supabase.auth.refreshSession.mockResolvedValue({
            data: { user: null, session: null },
            error: null
        });

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await refreshController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Refresh falhou: ", expect.objectContaining({
            user: null,
            session: null
        }));
        expect(mockReply.clearCookie).toHaveBeenCalledWith("token", expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }));
        expect(mockReply.clearCookie).toHaveBeenCalledWith("refresh_token", expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }));
        expect(mockReply.status).toHaveBeenCalledWith(401);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Refresh token inválido ou expirado",
            error: false,
            technicalError: true,
        });
    });

    it('Deve retornar 200, setar os cookies e enviar o usuário se o refresh for bem sucedido', async () => {
        mockRequest.cookies = {
            refresh_token: 'valid-refresh'
        };

        const mockUser = {
            id: 'user-id',
            app_metadata: {},
            user_metadata: {
                role: 'user'
            },
            aud: 'authenticated',
            email: 'teste@gmail.com',
            created_at: '2024-01-01T00:00:00Z',
        };

        mockRequest.server.supabase.auth.refreshSession.mockResolvedValue({
            data: {
                user: mockUser,
                session: {
                    access_token: 'new-access-token',
                    refresh_token: 'new-token',
                    expires_in: 3600
                }
            },
            error: null
        });

        await refreshController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.setCookie).toHaveBeenCalledWith("token", 'new-access-token', expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600,
        }));
        expect(mockReply.setCookie).toHaveBeenCalledWith("refresh_token", 'new-token', expect.objectContaining({
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        }));
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Sessão renovada",
            error: false,
            user: {
                id: mockUser.id,
                email: mockUser.email,
                role: mockUser.user_metadata.role
            },
            expiresIn: 3600,
        });
    });

    it('Deve retornar 500 se ocorrer um erro inesperado', async () => {
        mockRequest.cookies = {
            refresh_token: 'valid-refresh'
        };

        mockRequest.server.supabase.auth.refreshSession.mockRejectedValue(new Error("Unexpected error"));

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await refreshController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Erro em refreshController: ", Error("Unexpected error"));
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro ao renovar sessão",
            error: false,
            technicalError: true,
        });
    });

    it('Deve retornar 200 se o token vier no header Authorization', async () => {
        mockRequest.cookies = {
            refresh_token: undefined
        };
        mockRequest.headers = {
            authorization: 'Bearer valid-refresh'
        };

        const mockUser = {
            id: 'user-id',
            app_metadata: {},
            user_metadata: {
                role: 'user'
            },
            aud: 'authenticated',
            email: 'teste@gmail.com',
            created_at: '2024-01-01T00:00:00Z',
        };

        mockRequest.server.supabase.auth.refreshSession.mockResolvedValue({
            data: {
                user: mockUser,
                session: {
                    access_token: 'new-access-token',
                    refresh_token: 'new-token',
                    expires_in: 3600
                }
            },
            error: null
        });

        await refreshController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.setCookie).toHaveBeenCalledWith("token", 'new-access-token', expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600,
        }));
        expect(mockReply.setCookie).toHaveBeenCalledWith("refresh_token", 'new-token', expect.objectContaining({
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        }));
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Sessão renovada",
            error: false,
            user: {
                id: mockUser.id,
                email: mockUser.email,
                role: mockUser.user_metadata.role
            },
            expiresIn: 3600,
        });  
    });
});