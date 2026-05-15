import meController from '@/controllers/auth/me';

describe('me controller', () => {
    let mockRequest: any;
    let mockReply: any;
    beforeEach(() => {
        vi.clearAllMocks();

        mockRequest = {
            user: {},
            cookies: {},
            headers: {},
            server: {
                supabase: {
                    from: vi.fn().mockReturnThis(),
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    single: vi.fn().mockReturnThis(),
                }
            }
        }

        mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        }
    });

    it('Deve retornar 500 se retornar erro ao buscar dados do perfil', async () => {
        mockRequest.user = { id: 'id' };

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Erro ao buscar perfil', details: '', hint: '', code: 'PGRSTError' }
            })
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await meController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Erro ao buscar profile:", expect.objectContaining({ message: 'Erro ao buscar perfil', details: '', hint: '', code: 'PGRSTError' }));
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro ao buscar perfil", 
            error: true, 
            technicalError: true
        });
    });

    it('Deve retornar 200 ao buscar perfil com sucesso', async () => {
        mockRequest.user = { 
            id: 'id',
            email: 'teste@gmail.com',
            user_metadata: {
                role: 'user'
            }
        };

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    city: 'city',
                    country: 'country',
                    email: 'teste@gmail.com',
                    full_name: 'full_name',
                    gender: 'gender',
                    id: 'id',
                    region: 'region',
                    username: 'username'
                },
                error: null
            })
        };

        const userSend = {
            id: 'id',
            name: 'username',
            email: 'teste@gmail.com',
            role: 'user',
            raw: {
                city: 'city',
                country: 'country',
                email: 'teste@gmail.com',
                full_name: 'full_name',
                gender: 'gender',
                id: 'id',
                region: 'region',
                username: 'username'
            },
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await meController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            user: userSend,
            error: false,
            technicalError: false,
        });
    });

    it('Deve retornar 500 se ocorrer erro inesperado', async () => {
        mockRequest.user = { id: 'id' };

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Erro ao buscar perfil', details: '', hint: '', code: 'PGRST116' }
            })
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await meController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Erro em /auth/me: ", Error("Perfil não encontrado: ", expect.objectContaining({ message: 'Erro ao buscar perfil', details: '', hint: '', code: 'PGRST116' })));
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Não autenticado",
            error: false,
            technicalError: true,
        });
    });
})