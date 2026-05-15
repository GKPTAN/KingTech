const {mockVerifyAndCreateUser} = vi.hoisted(() => {
    return {
        mockVerifyAndCreateUser: vi.fn()
    }
});

vi.mock('@/controllers/auth/AuthClient', () => ({
    default: {
        verifyAndCreateUser: mockVerifyAndCreateUser
    }
}));

import verifyController from '@/controllers/auth/verify';

describe('verify controller', () => {
    let mockRequest: any;
    let mockReply: any;
    beforeEach(() => {
        vi.clearAllMocks();

        mockRequest = {
            body: {},
            cookies: {},
            headers: {},
            server: {
                supabase: {}
            }
        };

        mockReply = {
            send: vi.fn().mockReturnThis(),
            status: vi.fn().mockReturnThis(),
            clearCookie: vi.fn().mockReturnThis()
        };
    });

    it('Deve retornar status 400 caso não exista o id do usuário', async () => {
        mockRequest.body = {
            code: '123456'   
        };

        mockRequest.cookies = {
            user_id: undefined
        };

        await verifyController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Tempo expirado! Tente novamente mais tarde",
            error: true,
        });
    });

    it('Deve retornar status 200 caso o usuário seja verificado com sucesso', async () => {
        mockRequest.body = {
            code: '123456'
        };

        mockRequest.cookies = {
            user_id: 'user-id'
        };

        mockVerifyAndCreateUser.mockResolvedValue({
            success: true,
            userId: 'user-id-123',
            message: "Usuário verificado e criado com sucesso."
        });

        await verifyController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.clearCookie).toHaveBeenCalledWith("user_id");
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "E-mail confirmado com sucesso",
            error: false,
            technicalError: false,
            location: "/account/login",
        });
    });

    it('Retornar status 404 caso o usuário não seja encontrado ou erro ao buscar dados', async () => {
        mockRequest.body = {
            code: '123456'
        };

        mockRequest.cookies = {
            user_id: 'user-id'
        };

        mockVerifyAndCreateUser.mockRejectedValue(new Error("Usuário não encontrado ou erro ao buscar dados."));

        await verifyController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(404);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Usuário não encontrado ou erro ao buscar dados.",
            error: true,
        })
    });

    it('Deve retornar status 400 caso o código de verificação seja inválido', async () => {
        mockRequest.body = {
            code: '123456'
        };

        mockRequest.cookies = {
            user_id: 'user-id'
        };

        mockVerifyAndCreateUser.mockRejectedValue(new Error("Código de verificação inválido."));

        await verifyController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Código de verificação inválido.",
            error: true,
        })
    });

    it('Deve retornar status 500 para erro inesperado', async () => {
        mockRequest.body = {
            code: '123456'
        };

        mockRequest.cookies = {
            user_id: 'user-id'
        };

        mockVerifyAndCreateUser.mockRejectedValue({});

        await verifyController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.status).not.toHaveBeenCalledWith(404);
        expect(mockReply.status).not.toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro ao confirmar cadastro! entre em contato com o suporte.",
            error: true,
        });
    });
});