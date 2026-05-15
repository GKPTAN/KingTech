import registerController from '@/controllers/auth/register';
import sendEmailToUser from '@/services/emailService';
import { pwnedPassword } from 'hibp';

vi.mock('hibp', () => ({
    pwnedPassword: vi.fn(),
}));

vi.mock('@/services/emailService', () => ({
    default: vi.fn(),
}));

describe('Register controller', () => {
    let mockRequest: any;
    let mockReply: any;
    beforeEach(() => {
        vi.clearAllMocks();

        mockRequest = {
            body: {},
            cookies: {},
            headers: {},
            ip: '',
            server: {
                supabase: {
                    from: vi.fn().mockReturnThis(),
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    single: vi.fn().mockReturnThis(),
                    maybeSingle: vi.fn().mockReturnThis(),
                    insert: vi.fn().mockReturnThis(),
                }
            }
        };

        mockReply = {
            send: vi.fn().mockReturnThis(),
            status: vi.fn().mockReturnThis(),
            setCookie: vi.fn().mockReturnThis(),
        };
    });

    it('Deve retornar status 400 se a senha foi vazada em algum vazamento de dados', async () => {
        mockRequest.body = {
            full_name: 'Test_User',
            gender: 'other',
            date_birth: '05/11/2001',
            email: 'teste@gmail.com',
            password: '12345678',
        };

        mockRequest.ip = '127.0.0.1';

        vi.mocked(pwnedPassword).mockResolvedValue(100);

        await registerController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "A senha informada foi encontrada em vazamentos de dados. Por favor, escolha uma senha diferente.",
            error: true,
            technicalError: false,
        });
    });

    it('Deve retornar status 400 se já existir um e-mail cadastrado', async () => {
        mockRequest.body = {
            full_name: 'Test_User',
            gender: 'other',
            date_birth: '05/11/2001',
            email: 'teste@gmail.com',
            password: '12345678',
        };
        
        mockRequest.ip = '127.0.0.1';

        vi.mocked(pwnedPassword).mockResolvedValue(0);

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'existing-user-id' }, error: null }),
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await registerController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "E-mail já cadastrado!",
            error: true,
            technicalError: false,
        });
    });

    it('Deve retornar status 500 caso a verificação do e-mail existente falhe', async () => {
        mockRequest.body = {
            full_name: 'Test_User',
            gender: 'other',
            date_birth: '05/11/2001',
            email: 'teste@gmail.com',
            password: '12345678',
        };
        
        mockRequest.ip = '127.0.0.1';

        vi.mocked(pwnedPassword).mockResolvedValue(0);

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Erro ao verificar e-mail', details: '', hint: '', code: 'PGRST118' } }),
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await registerController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Erro ao registrar usuário: ", expect.objectContaining({ message: 'Erro ao verificar e-mail', details: '', hint: '', code: 'PGRST118' }));
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro interno no servidor.",
            error: false,
            technicalError: false,
        });
    });

    it('Deve retornar status 500 caso a verificação de registro pendente falhe', async () => {
        mockRequest.body = {
            full_name: 'Test_User',
            gender: 'other',
            date_birth: '05/11/2001',
            email: 'teste@gmail.com',
            password: '12345678',
        };
        
        mockRequest.ip = '127.0.0.1';

        vi.mocked(pwnedPassword).mockResolvedValue(0);

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
        };

        const mockPendingQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'Erro ao verificar registro pendente', details: '', hint: '', code: 'PGRST118' }})
        };

        mockRequest.server.supabase.from.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockPendingQuery);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await registerController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Erro ao checar unverified_profiles:", expect.objectContaining({ message: 'Erro ao verificar registro pendente', details: '', hint: '', code: 'PGRST118' }));
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro interno ao verificar registro pendente.",
            error: true,
            technicalError: false,
        });
    });

    it('Deve retornar status 400 se já existir um registro pendente para o e-mail', async () => {
        mockRequest.body = {
            full_name: 'Test_User',
            gender: 'other',
            date_birth: '05/11/2001',
            email: 'teste@gmail.com',
            password: '12345678',
        };
        
        mockRequest.ip = '127.0.0.1';

        vi.mocked(pwnedPassword).mockResolvedValue(0);

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
        };

        const mockPendingQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'pendent-register' }, error: null})
        };

        mockRequest.server.supabase.from.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockPendingQuery);

        await registerController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.status).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Já existe um registro pendente para esse e-mail. Verifique seu e-mail.",
            error: true,
            technicalError: false,
        });
    });

    it('Deve retornar status 500 caso o registro do usuário na supabase falhe', async () => {
        mockRequest.body = {
            full_name: 'Test_User',
            gender: 'other',
            date_birth: '05/11/2001',
            email: 'teste@gmail.com',
            password: '12345678',
        };
        
        mockRequest.ip = '127.0.0.1';

        vi.mocked(pwnedPassword).mockResolvedValue(0);

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
        };

        const mockPendingQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null})
        };

        const mockInsertQuery = {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Erro ao inserir usuário', details: '', hint: '', code: 'PGRST118' }})
        };

        mockRequest.server.supabase.from.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockPendingQuery).mockReturnValueOnce(mockInsertQuery);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await registerController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Erro ao registrar usuário: ", expect.objectContaining({ message: 'Erro ao inserir usuário', details: '', hint: '', code: 'PGRST118' }));
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro interno no servidor.",
            error: false,
            technicalError: false,
        });
    });

    it('Deve retornar erro 500 caso o envio do e-mail de verificação falhe', async () => {
        mockRequest.body = {
            full_name: 'Test_User',
            gender: 'other',
            date_birth: '05/11/2001',
            email: 'teste@gmail.com',
            password: '12345678',
        };
        
        mockRequest.ip = '127.0.0.1';

        vi.mocked(pwnedPassword).mockResolvedValue(0);

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
        };

        const mockPendingQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null})
        };

        const mockInsertQuery = {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: {id: 'user-id'}, error: null })
        };

        mockRequest.server.supabase.from.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockPendingQuery).mockReturnValueOnce(mockInsertQuery);

        vi.mocked(sendEmailToUser).mockRejectedValue(new Error('Erro ao enviar e-mail'));

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await registerController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(consoleSpy).toHaveBeenCalledWith("Erro ao registrar usuário: ", expect.objectContaining(Error('Erro ao enviar e-mail')));
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Erro interno no servidor.",
            error: false,
            technicalError: false,
        });
    });

    it('Deve registrar o usuário e enviar o e-mail de verificação com sucesso', async () => {
        mockRequest.body = {
            full_name: 'Test_User',
            gender: 'other',
            date_birth: '05/11/2001',
            email: 'teste@gmail.com',
            password: '12345678',
        };
        
        mockRequest.ip = '127.0.0.1';

        vi.mocked(pwnedPassword).mockResolvedValue(0);

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
        };

        const mockPendingQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null})
        };

        const mockInsertQuery = {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: {id: '123'}, error: null })
        };

        mockRequest.server.supabase.from.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockPendingQuery).mockReturnValueOnce(mockInsertQuery);

        vi.mocked(sendEmailToUser).mockReturnThis();

        await registerController(mockRequest, mockReply, mockRequest.server.supabase);

        expect(mockReply.setCookie).toHaveBeenCalledWith('user_id', '123', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 45 * 60,
        });
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: "Aguarde..., Você receberá um e-mail com o código de confirmação",
            error: false,
            technicalError: false,
        })
    });
});