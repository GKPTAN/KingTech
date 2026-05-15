import logoutController from '@/controllers/auth/logout';

describe('logout controller', () => {
    let mockRequest: any;
    let mockReply: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockRequest = {
            user: {},
            body: {},
            cookies: {},
            headers: {},
            server: {
                supabase: {
                    auth: {
                        signOut: vi.fn(),
                        admin: {
                            signOut: vi.fn()
                        }
                    }
                }
            }
        };

        mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
            clearCookie: vi.fn().mockReturnThis()
        };
    });

    it('Retornar 500 quando o logout falhar', async () => {
        mockRequest.user = {
            id: 'user-id',
        }

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        mockRequest.server.supabase.auth.admin.signOut.mockResolvedValueOnce({
            data: null,
            error: {
                message: 'Logout failed',
                name: 'AuthApiError',
                status: 500,
            },
        });

        await logoutController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(consoleSpy).toHaveBeenCalledWith("Erro ao realizar logout:", expect.objectContaining({
                message: 'Logout failed',
                name: 'AuthApiError',
                status: 500,
        }));
    });

    it('Deve limpar os cookies e retornar 200 quando o logout for bem-sucedido', async () => {
        mockRequest.user = {
            id: 'user-id',
        }

        mockRequest.server.supabase.auth.admin.signOut.mockResolvedValue({
            data: null,
            error: null,
        });

        await logoutController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.clearCookie).toHaveBeenCalledWith("token", expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }));
        expect(mockReply.clearCookie).toHaveBeenCalledWith("refresh_token", expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }));
        expect(mockReply.clearCookie).toHaveBeenCalledWith("user_id", expect.objectContaining({
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }));
        expect(mockReply.status).toHaveBeenCalledWith(200);
    });
});