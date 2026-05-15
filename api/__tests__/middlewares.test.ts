import { authHook } from "@/middlewares/authHook";
import { verifySupabaseToken, requireRole } from "@/middlewares/supabaseAuth";
import { ROLES } from "@/utils/roles";

describe("authHook", () => {
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    mockRequest = {
      cookies: {},
      headers: {},
      server: {
        supabase: {
          auth: {
            getUser: vi.fn(),
          },
        },
      },
      user: null,
    };

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  it("Deve retornar 401 se nenhum token for fornecido", async () => {
    await authHook(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "token não fornecido",
      }),
    );
  });

  it("Deve autenticar com sucesso e anexar o usuário ao request", async () => {
    const mockUser = {
      id: "123",
      email: "teste@teste.com",
      user_metadata: { role: ROLES.ADMIN },
    };

    mockRequest.cookies.token = "token-valido";
    mockRequest.server.supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    await authHook(mockRequest, mockReply);

    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user.role).toBe(ROLES.ADMIN);
    expect(mockReply.status).not.toHaveBeenCalled();
  });

  it("Deve retornar 401 se o token for inválido na supabase", async () => {
    mockRequest.cookies.token = "token-invalido";
    mockRequest.server.supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "invalid token" },
    });

    await authHook(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "sessão inválida ou expirada",
      }),
    );
  });
});

describe("Supabase Auth Middleware", () => {
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRequest = {
      cookies: {},
      headers: {},
      server: {
        supabase: {
          auth: {
            getUser: vi.fn(),
          },
          from: vi.fn(),
        },
      },
      user: null,
    };

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  describe("VerifySupabaseToken", () => {
    it("Deve retornar 500 se o cliente supabase não existir no servidor", async () => {
      delete mockRequest.server.supabase;

      await verifySupabaseToken(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(500);
    });

    it("Deve retornar 401 se nenhum token for fornecido", async () => {
      await verifySupabaseToken(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Token não fornecido",
        }),
      );
    });

    it('deve autenticar usando o token vindo do header authorization', async () => {
        mockRequest.headers.authorization = `Bearer token-do-header`;
        mockRequest.cookies = {};

        mockRequest.server.supabase.auth.getUser.mockResolvedValue({
            data: {user: {id: "123", email: "teste@teste.com", user_metadata: {}}},
            error: null,
        });

        const mockQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
                data: {role: ROLES.ADMIN}, error: null
            }),
        };

        mockRequest.server.supabase.from.mockReturnValue(mockQuery);

        await verifySupabaseToken(mockRequest, mockReply);

        expect(mockRequest.server.supabase.auth.getUser).toHaveBeenCalledWith('token-do-header');
        expect(mockRequest.user).toBeDefined();
        expect(mockReply.status).not.toHaveBeenCalled();
    })

    it("Deve anexar o usuário e o role correto ao request em caso de sucesso", async () => {
      mockRequest.cookies.token = "valid-token";

      mockRequest.server.supabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "123", email: "teste@teste.com", user_metadata: {} } },
        error: null,
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi
          .fn()
          .mockResolvedValue({ data: { role: ROLES.ADMIN }, error: null }),
      };

      mockRequest.server.supabase.from.mockReturnValue(mockQuery);

      await verifySupabaseToken(mockRequest, mockReply);

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user.role).toBe(ROLES.ADMIN);
      expect(mockReply.status).not.toHaveBeenCalled();
    });
  });

  describe("require role", () => {
    it("Deve retornar 401 se request.user não existir", async () => {
      const middleware = requireRole(ROLES.ADMIN);
      await middleware(mockRequest, mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(401);
    });

    it("deve retornar 403 se o role do usuário não for permitido", async () => {
      mockRequest.user = { role: "operator" };
      const middleware = requireRole(ROLES.ADMIN);
      await middleware(mockRequest, mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(403);
    });

    it("Deve permitir o acesso se o role estiver na lista", async () => {
      mockRequest.user = { role: ROLES.USER };
      const middleware = requireRole(ROLES.ADMIN, ROLES.USER);
      const result = await middleware(mockRequest, mockReply);

      expect(result).toBeUndefined();
      expect(mockReply.status).not.toHaveBeenCalled();
    });
  });
});
