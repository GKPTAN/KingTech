import fastify, {type FastifyError} from "fastify";
import fastifyCookie from "@fastify/cookie";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ROLES } from "@/utils/roles";
import AuthRoutes from "@/routes/authRoutes";

vi.mock('../src/plugins/supabaseClient.ts', () => ({
    default: {}
}));

vi.mock("@/types/auth/authClientVerify", () => ({
    EnvSupabase: {
        SUPABASE_URL: 'http://localhost:54321',
        SUPABASE_KEY: 'fake-key'
    }
}));

vi.mock('../src/controllers/auth/register.ts', () => ({
    default: vi.fn((req, reply) => reply.status(200).send({
        message: "Aguarde..., Você receberá um e-mail com o código de confirmação",
        error: false,
        technicalError: false,
    }))
}));

vi.mock('../src/controllers/auth/login.ts', () => ({
    default: vi.fn((req, reply) => reply.status(200).send({
        message: "Login realizado com sucesso.",
            error: false,
            technicalError: false,
            user: {
                id: "156jsh-f",
                name: "Guilherme",
                email: "teste@gmail.com",
                role: ROLES.ADMIN,
                raw: {
                    full_name: 'Guilherme Santos',
                    username: 'Guilherme',
                    gender: "masculino",
                    city: 'Caxias',
                    region: 'Maranhão',
                    country: 'Brazil',
                }
            },
            expiresIn: 20000,
            location: "/account/dashboard",
    }))
}))

vi.mock('../src/controllers/auth/verify.ts', () => ({
    default: vi.fn((req, reply) => reply.status(200).send({
        message: "E-mail confirmado com sucesso",
        error: false,
        technicalError: false,
        location: "/account/login",
    }))
}));

vi.mock('../src/controllers/auth/AuthClient.ts', () => ({
    default: {
        verifyAndCreateUser: vi.fn(),
    }
}));

describe('Auth Routes', () => {
    let app: any;
    const refreshSessionMock = vi.fn();
    const getUserMock = vi.fn();
    const singleMock = vi.fn();

    const supabaseMock = {
        auth: {
            refreshSession: refreshSessionMock,
            getUser: getUserMock,
        },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: singleMock,
    }

    beforeEach(async () => {
        app = fastify();

        app.register(fastifyCookie, {
            secret: "meu-segredo-de-teste"
        });

        app.setValidatorCompiler(validatorCompiler);
        app.setSerializerCompiler(serializerCompiler);

        app.decorate('supabase', supabaseMock);

        app.setErrorHandler((error: FastifyError, request:any, reply:any) => {

            const cleanMessage = error.message.replace(/^body\/[a-zA-Z0-9_]+\s/, "");
        
            if (error.validation) {
                return reply.status(400).send({
                    message: cleanMessage,
                    error: true,
                    technicalError: false
                })
            };
        
            app.log.error(error);
            return reply.status(500).send({ message: "Erro interno no servidor", error: true, technicalError: false});
        });

        await app.register(AuthRoutes, {prefix: '/auth'});
        await app.ready();
    });

    it('Deve retornar 400 se o payload de registro for inválido', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {email: 'invalido'}
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.payload);
        expect(body.error).toBe(true);
    });

    it('Deve aceitar registros com dados válidos', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {
                full_name: 'Guilherme Silva',
                gender: 'masculino',
                date_birth: '05/06/2003',
                email: 'teste@gmail.com',
                password: 'password123'
            }
        });

        expect(response.statusCode).toBe(200);
    });

    it('Deve retornar 400 se o payload de verify for inválido', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/verify',
            payload: {code: "153"}
        });

        const body = response.json();

        expect(response.statusCode).toBe(400);
        expect(body.message).toBe("O código deve ter exatamente 6 digitos");
    });

    it('Deve aceitar o código de confirmação válido', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/verify',
            payload: {code: "123456"}
        });

        expect(response.statusCode).toBe(200);
    });

    it('Deve retornar 400 se o payload do login for inválido', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'teste@teste.com',
                password: '1234'
            }
        });

        const body = response.json();
        expect(response.statusCode).toBe(400);
        expect(body.message).toBe("Sua senha precisa ter no mínimo 6 caracteres!");
    });

    it('Deve aceitar o login com dados válidos', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'teste@teste.com',
                password: '1234567897'
            }
        });

        expect(response.statusCode).toBe(200);
    });

    it('Deve retornar 401 caso não haja um refresh token válido', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/refresh',
            cookies: {},
        });

        expect(response.statusCode).toBe(401);
    });

    it('Deve aceitar o refreshToken e retornar 200', async () => {
        refreshSessionMock.mockResolvedValue({
            data: { 
                session: { access_token: 'abc', refresh_token: 'def', expires_in: 3600 },
                user: { id: '123', email: 'test@test.com', user_metadata: { role: 'admin' } }
            },
            error: null
        });

        const response = await app.inject({
            method: 'POST',
            url: '/auth/refresh',
            cookies: {
                refresh_token: 'token-que-existe'
            }
        });

        expect(response.statusCode).toBe(200);
    });

    it('Deve retornar 200 e os dados do usuário ao acessar o endpoint de refresh com um token válido', async () => {
        const mockUser = {
            id: '123',
            email: 'teste@gmail.com',
            user_metadata: { role: ROLES.ADMIN }
        }

        supabaseMock.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
        supabaseMock.single.mockResolvedValue({ 
            data: {
                full_name: 'Guilherme Santos',
                username: 'Guilherme',
            },
            error: null
        });

        const response = await app.inject({
            method: 'GET',
            url: '/auth/me',
            cookies: {
                token: 'token-valido-falso'
            }
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body.user.email).toBe('teste@gmail.com');
        expect(body.user.name).toBe('Guilherme');
    });

    it('Deve retornar 401 se o token for inválido ou expirado', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/auth/me',
            cookies: {}
        });

        expect(response.statusCode).toBe(401);
        const body = response.json();
        expect(body.message).toBe("token não fornecido");
    });
});