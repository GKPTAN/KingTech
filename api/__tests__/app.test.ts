import type { FastifyError } from 'fastify';

vi.mock('fs', () => ({
    default: {
        readFileSync: vi.fn().mockImplementation((path: string) => {
            // Se o arquivo sendo lido contiver 'key', injeta um bloco de chave privada válido
            if (path.includes('key')) {
                return [
                    '-----BEGIN PRIVATE KEY-----',
                    'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3tVj8XzI4V2N9',
                    '-----END PRIVATE KEY-----'
                ].join('\n');
            }
            // Para o certificado (cert), injeta um bloco de certificado público válido
            return [
                '-----BEGIN CERTIFICATE-----',
                'MIIDXTCCAkWgAwIBAgIULm8XzI4V2N9Tk1vM0FpZXIwDQYJKoZIhvcNAQELBQAw',
                '-----END CERTIFICATE-----'
            ].join('\n');
        })
    }
}));

vi.mock('dotenv', () => ({
    default: {
        config: vi.fn()
    }
}));

process.env.SECRET_COOKIE = 'segredo-padrao-testes';

vi.mock('fastify', async (importOriginal) => {
    const original: any = await importOriginal();
    return {
        default: (options: any) => {
            const { https, ...optionsWithoutHttps } = options;
            return original.default(optionsWithoutHttps); // Retorna a instância limpa, sem chamar listen()
        }
    };
});

vi.mock('@/plugins/supabaseClient', () => ({default: {}}));
vi.mock('@/routes/authRoutes', () => ({
    default: vi.fn((f, opts, done) => done?.())
}));

describe('Inicialização da api', () => {

    beforeEach(() => {
        vi.resetModules();
    })

    it('Deve carregar todas as configurações e inicializar sem estourar erros', async () => {
        process.env.SECRET_COOKIE = 'segredo';
        const module = await import('@/app');

        expect(process.env.SECRET_COOKIE).toBeDefined();
        expect(module.app).toBeDefined();
    });

    it('Deve lançar um erro crítico se a variável SECRET_COOKIE não estiver definida', async () => {
        delete process.env.SECRET_COOKIE;

        await expect(import('@/app')).rejects.toThrow("Erro crítico: a variável de ambiente SECRET_COOKIE não está definida!");

        process.env.SECRET_COOKIE = 'segredo';
    });
});

describe('Global error handler', () => {
    let testApp: any;

    beforeEach(async () => {
        vi.resetModules();
        process.env.SECRET_COOKIE = 'segredo';
        
        // 1. Importamos o módulo da API
        const module = await import('@/app');
        testApp = module.app;

        // 2. REGISTRAMOS AS ROTAS DE TESTE AQUI (Antes do .ready())
        // Como o app ainda não está totalmente "startado", o Fastify permite!
        
        // Rota para testar o erro 400
        testApp.get('/test-validation-error', async () => {
            const validationError = new Error('Campo obrigatório inválido') as FastifyError;
            validationError.validation = [];
            throw validationError;
        });

        // Rota para testar o erro 500
        testApp.get('/test-internal-error', async () => {
            throw new Error('Banco de dados explodiu');
        });

        // 3. Só agora avisamos ao Fastify que ele pode compilar os schemas e hooks
        await testApp.ready();
    });

    it('Deve interceptar erros de validação e retornar status 400 com a estrutura correta', async () => {
        // A rota já foi registrada no beforeEach com segurança!
        const response = await testApp.inject({
            method: 'GET',
            url: '/test-validation-error'
        });

        expect(response.statusCode).toBe(400);

        const body = response.json();
        expect(body).toEqual({
            message: 'Campo obrigatório inválido', 
            error: true,
            technicalError: false
        });
    });

    it('Deve capturar erros inesperados, registrar no log e retornar status 500', async () => {
        const logSpy = vi.spyOn(testApp.log, 'error').mockImplementation(() => {});

        // A rota já foi registrada no beforeEach com segurança!
        const response = await testApp.inject({
            method: 'GET',
            url: '/test-internal-error'
        });

        expect(response.statusCode).toBe(500);

        const body = response.json();
        expect(body).toEqual({
            message: "Erro interno no servidor", 
            error: true, 
            technicalError: false
        });

        expect(logSpy).toHaveBeenCalledWith(expect.any(Error));
    });
});