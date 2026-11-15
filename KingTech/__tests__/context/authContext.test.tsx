/* eslint-disable vitest/prefer-called-with */
/* eslint-disable vitest/require-to-throw-message */
/* eslint-disable vitest/prefer-spy-on */
/* eslint-disable no-unused-vars */
/* eslint-disable vitest/prefer-to-be-falsy */
/* eslint-disable vitest/prefer-strict-equal */
/* eslint-disable no-undef */
import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import axios from "axios";

import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/useAuth";

vi.mock("axios", () => {
  const mockAxiosInstance = vi.fn().mockResolvedValue({ data: {} });
  const mockAxios: any = mockAxiosInstance;
  mockAxios.get = vi.fn();
  mockAxios.post = vi.fn();
  mockAxios.interceptors = {
    response: { use: vi.fn(), eject: vi.fn() },
  };
  mockAxios.defaults = { withCredentials: true };
  return {
    default: mockAxios,
  };
});

const { mockGetSession, mockSignOut } = vi.hoisted(() => {
  return {
    mockGetSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    mockSignOut: vi.fn().mockResolvedValue({ error: null })
  };
});

let triggerAuthStateChange: (event: string, session: any) => void;

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: () => ({
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: (callback: any) => {
          triggerAuthStateChange = callback;
          return {
            data: { subscription: { unsubscribe: vi.fn() } },
          };
        },
        signOut: mockSignOut,
      },
    }),
  };
});

describe("auth Provider Context", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fetch_user: deve retornar o usuário e atualizar o estado se resp.data.user existir", async () => {
    const mockUser = {
      id: "123",
      name: "Gabriel",
      email: "teste@gmail.com",
      role: "user",
    };

    vi.mocked(axios.get).mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(axios.get).toHaveBeenCalledWith("https://localhost:3000/auth/me");
  });

  it("fetch_user: deve retornar null se a api responder com sucesso mas sem a propriedade user", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: {} });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("fetch_user: deve retornar null silenciosamente se a api falhar com status 401 (não autenticado)", async () => {
    vi.mocked(axios.get).mockRejectedValue({
      response: { status: 401, data: { message: "Unauthorized" } },
    });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("fetch_user: deve printar o erro no console e retornar null se a api falhar com qualquer outro status", async () => {
    const apiError = {
      response: { status: 500, data: { message: "erro interno" } },
    };

    vi.mocked(axios.get).mockRejectedValue(apiError);
    vi.mocked(axios.post).mockRejectedValue({ response: { status: 500 } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      "Erro ao buscar usuário da API: ",
      apiError,
    );
  });

  it("refresh_session: deve atualizar o usuário, retornar true se a api trouxer response.data.user", async () => {
    const mockUser = {
      id: "123",
      name: "Gabriel",
      email: "teste@gmail.com",
      role: "user",
    };

    vi.mocked(axios.get)
      .mockRejectedValueOnce({ response: { status: 401 } })
      .mockResolvedValueOnce({ data: { user: mockUser } });
    vi.mocked(axios.post).mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(axios.post).toHaveBeenCalledWith(
      "https://localhost:3000/auth/refresh",
    );
  });

  it("refresh_session: deve retornar false se a api responder com sucesso mas sem a propriedade user", async () => {
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("refresh_session: deve disparar o console.error e retornar false se a requisição do axios falhar (catch)", async () => {
    const networkError = {
      response: { status: 500, data: { message: "Erro interno no refresh" } },
    };

    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockRejectedValue(networkError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      "Erro ao atualizar sessão: ",
      networkError,
    );
  });

  it("deve iniciar em estado de loading e depois carregar sem usuário (não autenticado)", async () => {
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockRejectedValue({ response: { status: 401 } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("deve recuperar o usuário da api caso ele já possua uma sessão ativa", async () => {
    const mockUser = {
      id: "123",
      name: "Gabriel",
      email: "teste@gmail.com",
      role: "user",
    };

    vi.mocked(axios.get).mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it("deve recuperar o usuário direto da Supabase se a API falhar mas o getSession tiver uma sessão ativa (if supaUser && mounted)", async () => {
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    const mockSupabase = {
      id: "supa-999",
      email: "teste@gmail.com",
      user_metadata: { username: "userDoSupabase", role: "user" },
    };

    mockGetSession.mockResolvedValueOnce({
      data: { session: { user: mockSupabase } },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual({
        id: "supa-999",
        name: "userDoSupabase",
        email: "teste@gmail.com",
        role: "user",
        raw: mockSupabase,
      });
    });

    expect(result.current.user).toEqual({
      id: "supa-999",
      name: "userDoSupabase",
      email: "teste@gmail.com",
      role: "user",
      raw: mockSupabase,
    });
  });

  it("deve cobrir o bloco catch do init se o getSession estourar um erro catastrófico", async () => {
    // 1. Silencia o console.error apenas para este teste para não poluir o terminal
    const spyConsole = vi.spyOn(console, "error").mockImplementation(() => {});

    // 2. Faz as APIs falharem com 401 para o fluxo ser obrigado a descer até o bloco do Supabase
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    // 3. SABOTAGEM: Força o getSession a disparar um THROW síncrono que quebrará o try do init()
    const erroCatastrofico = new Error("Erro de infraestrutura do banco");
    mockGetSession.mockImplementationOnce(() => {
      throw erroCatastrofico;
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 4. Aguarda o useEffect terminar de processar o ciclo
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 5. Valida se o estado foi resetado no catch conforme o seu código dita
    expect(result.current.user).toBeNull();

    // 6. Confirma se o console.error exato foi disparado com a mensagem e o erro anexado
    expect(spyConsole).toHaveBeenCalledWith(
      "Auth init error: ",
      erroCatastrofico,
    );

    spyConsole.mockRestore(); // Restaura o console original após o teste
  });

  it("deve realizar o login com sucesso e atualizar o estado do usuário", async () => {
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockRejectedValue({ response: { status: 401 } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const loggedUser = {
      id: "123",
      name: "Gabriel",
      email: "teste@gmail.com",
      role: "user",
    };

    vi.mocked(axios.post).mockResolvedValue({ data: { user: loggedUser } });

    await act(async () => {
      await result.current.login({
        email: "teste@gmail.com",
        password: "password123!",
      });
    });

    expect(result.current.user).toEqual(loggedUser);
  });

  it("deve limpar o estado do usuário ao efetuar logout", async () => {
    const mockUser = {
      id: "123",
      name: "Gabriel",
      email: "teste@teste.com",
      role: "user",
    };
    vi.mocked(axios.get).mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    vi.mocked(axios.post).mockResolvedValue({ data: { success: true } });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });
});

describe("testando evento onAuthStateChange da Supabase", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });
  });

  it("deve atualizar o usuário se o evento trouxer uma sessão com usuário ativo (if)", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBeNull();

    const mockSupaUser = {
      id: "supa-123",
      email: "teste@gmail.com",
      user_metadata: { username: "SupabaseUser", role: "admin" },
    };

    act(() => {
      triggerAuthStateChange("SIGNED_IN", { user: mockSupaUser });
    });

    expect(result.current.user).toEqual({
      id: "supa-123",
      name: "SupabaseUser",
      email: "teste@gmail.com",
      role: "admin",
      raw: mockSupaUser,
    });
  });

  it("deve definir o usuário como null se o evento vier sem sessão/usuário", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockSupaUser = {
      id: "supa-123",
      email: "teste@gmail.com",
      user_metadata: {},
    };

    act(() => {
      triggerAuthStateChange("SIGNED_IN", { user: mockSupaUser });
    });
    expect(result.current.user).not.toBeNull();

    act(() => {
      triggerAuthStateChange("SIGNED_OUT", null);
    });

    expect(result.current.user).toBeNull();
  });
});

describe("testando fila de requisições (processQueue e failedQueue)", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  let axiosInterceptorCallback: any;
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(axios.interceptors.response.use).mockImplementation(
      (sucessCb, errorCb) => {
        axiosInterceptorCallback = errorCb;
        return 1;
      },
    );
  });

  it("deve resolver as requisições da fila quando o refresh der sucesso (else)", async () => {
    renderHook(() => useAuth(), { wrapper });

    vi.mocked(axios.post).mockResolvedValue({ data: { user: { id: "1" } } });
    vi.mocked(axios).mockResolvedValue({ data: "sucesso_fila" });

    const errorReq1 = { response: { status: 401 }, config: { url: "/rota-a" } };
    const errorReq2 = { response: { status: 401 }, config: { url: "/rota-b" } };

    const promise1 = axiosInterceptorCallback(errorReq1);
    const promise2 = axiosInterceptorCallback(errorReq2);

    const respostas = await Promise.all([promise1, promise2]);

    expect(respostas[0].data).toBe("sucesso_fila");
    expect(respostas[1].data).toBe("sucesso_fila");
  });

  it("deve rejeitar as requisições da fila se o refresh quebrar ou falhar (if)", async () => {
    renderHook(() => useAuth(), { wrapper });

    const erroDoRefresh = new Error("Falha no refresh");
    vi.mocked(axios.post).mockRejectedValue(erroDoRefresh);
    vi.mocked(axios).mockRejectedValue(erroDoRefresh);

    const errorReq1 = { response: { status: 401 }, config: { url: "/rota-a" } };
    const errorReq2 = { response: { status: 401 }, config: { url: "/rota-b" } };
    const errorReq3 = { response: { status: 401 }, config: { url: "/rota-c" } };

    const promise1 = axiosInterceptorCallback(errorReq1);
    const promise2 = axiosInterceptorCallback(errorReq2);
    const promise3 = axiosInterceptorCallback(errorReq3);

    await expect(promise1).rejects.toThrow();
    await expect(promise2).rejects.toThrow();
    await expect(promise3).rejects.toThrow();
  });

  it("deve rejeitar o erro imediatamente se a requisição original não tiver config (if !originalRequest)", async () => {
    renderHook(() => useAuth(), { wrapper });

    await vi.waitFor(() => expect(axios.post).toHaveBeenCalled());

    vi.clearAllMocks();

    const erroSemConfig = { response: { status: 401 } } as any;
    const promise = axiosInterceptorCallback(erroSemConfig);

    await expect(promise).rejects.toEqual(erroSemConfig);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("deve deslogar o usuário e rejeitar se a rota que falhou foi o próprio /auth/refresh", async () => {
    renderHook(() => useAuth(), { wrapper });

    const errorRefresh = {
      response: { status: 401 },
      config: { url: "https://localhost:3000/auth/refresh" },
    } as any;

    const promise = axiosInterceptorCallback(errorRefresh);

    await expect(promise).rejects.toEqual(errorRefresh);
  });

  it("deve definir o usuário como null e rejeitar se o refreshSession retornar false (if !ok)", async () => {
    renderHook(() => useAuth(), { wrapper });

    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    const errorReq = {
      response: { status: 401 },
      config: { url: "/rota-protegida" },
    } as any;

    const promise = axiosInterceptorCallback(errorReq);

    await expect(promise).rejects.toEqual(errorReq);
  });

  it("deve cobrir o bloco catch do interceptor limpando o estado de refreshing e rejeitando o erro capturado", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    vi.mocked(axios.post).mockResolvedValue({ data: { user: { id: "1" } } });
    vi.mocked(axios).mockImplementation(() => {
      throw new Error("Quebra forçada do bloco try");
    });

    const errorReq = {
      response: { status: 401 },
      config: { url: "/rota-protegida" },
    } as any;

    const promise = axiosInterceptorCallback(errorReq);

    await expect(promise).rejects.toThrow();
    expect(result.current.user).toBeNull();
  });

  it("rejeitar diretamente o erro se o status for diferente de 401", async () => {
    renderHook(() => useAuth(), { wrapper });

    await vi.waitFor(() => expect(axios.post).toHaveBeenCalled());

    vi.clearAllMocks();

    const erroForbidden = {
      response: { status: 403 },
      config: { url: "/rota-qualquer" },
    } as any;

    const promise = axiosInterceptorCallback(erroForbidden);

    await expect(promise).rejects.toEqual(erroForbidden);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("deve apenas retornar a resposta se a requisição der certo", async () => {
    renderHook(() => useAuth(), { wrapper });

    let axiosSucessCallback: any;

    vi.mocked(axios.interceptors.response.use).mockImplementation(
      (sucessCb, _errorCb) => {
        axiosSucessCallback = sucessCb;
        return 1;
      },
    );

    renderHook(() => useAuth(), { wrapper });

    const mockResponse = { status: 200, data: "dados_da_loja" };

    const resultado = axiosSucessCallback(mockResponse);

    expect(resultado).toEqual(mockResponse);
  });
});

describe("testando bloco catch da função login", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    // Silencia o console.error para não poluir o terminal de testes
    vi.spyOn(console, "error").mockImplementation(() => {});
    // Evita chamadas de inicialização limpas para focar no clique de login
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });
  });

  it("caminho 1: deve ler os dados de erro estruturados quando o servidor responder com uma falha (ex: 400/401)", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 1. Simula uma resposta de erro estruturada do Fastify
    const mockApiError = {
      message: "E-mail ou senha incorretos",
      technicalError: true,
      error: "UNAUTHORIZED_CREDENTIALS",
    };

    vi.mocked(axios.post).mockRejectedValue({
      response: {
        data: mockApiError,
      },
    });

    // 2. Executa a função de login dentro do bloco act
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: "teste@gmail.com",
        password: "123",
      });
    });

    // 3. Valida se o retorno mapeou as propriedades do objeto apiError corretamente
    expect(loginResult).toEqual({
      error: true,
      message: "E-mail ou senha incorretos",
      technicalError: true,
      log: "UNAUTHORIZED_CREDENTIALS",
    });

    // Verifica se o console.error foi chamado com a mensagem esperada
    expect(console.error).toHaveBeenCalledWith(
      "Erro no login: ",
      expect.anything(),
    );
  });

  it("caminho 2: deve retornar a mensagem padrão se o servidor não responder (ex: erro de rede offline)", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 1. Simula um erro de rede puro (sem o objeto response)
    const mockNetworkError = new Error("Network Error");
    vi.mocked(axios.post).mockRejectedValue(mockNetworkError);

    // 2. Executa a função de login
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: "teste@gmail.com",
        password: "123",
      });
    });

    // 3. Valida se o fallback de string e o false do technicalError foram executados
    expect(loginResult).toEqual({
      error: true,
      message: "Erro ao conectar com o servidor, tente novamente mais tarde",
      technicalError: false,
      log: undefined, // como err.response.data não existe, fica undefined
    });
  });

  it("deve cobrir ambos os blocos catch do logout se a API e o Supabase falharem simultaneamente", async () => {
    // 1. Inicializa o contexto
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 2. Silencia e espiona o console.log (pois o seu catch usa console.log e não console.error)
    const spyConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

    // 3. Força a API de logout do Fastify a falhar com um erro estruturado
    const erroApiLogout = {
      response: { data: { message: "Sessão inválida no servidor" } },
    };
    vi.mocked(axios.post).mockRejectedValueOnce(erroApiLogout); // Use Once para falhar apenas na chamada do logout

    const erroSupabaseSignOut = new Error("Falha de rede com o Supabase Auth");
    mockSignOut.mockRejectedValueOnce(erroSupabaseSignOut);

    // 5. Executa a função de logout dentro do bloco act
    await act(async () => {
      await result.current.logout();
    });

    // 6. ASSERÇÕES DO PRIMEIRO CATCH (Fastify):
    // Verifica se capturou a mensagem vinda do err.response?.data.message
    expect(spyConsoleLog).toHaveBeenCalledWith(
      "erro em logout",
      "Sessão inválida no servidor",
    );

    // 7. ASSERÇÕES DO SEGUNDO CATCH (Supabase):
    // Verifica se capturou o erro da desautenticação
    expect(spyConsoleLog).toHaveBeenCalledWith(
      "Erro ao desautenticar na supabase",
      erroSupabaseSignOut,
    );

    // 8. Garante que o estado final limpou o usuário e o loading mesmo com os erros
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);

    spyConsoleLog.mockRestore(); // Restaura o comportamento padrão do console.log
  });
});

describe("register", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  // Objeto mock que atende perfeitamente aos requisitos do seu Zod Schema
  const validMockUserData = {
    full_name: "Gabriel Silva",
    gender: "masculino",
    date_birth: "20/05/2000", 
    email: "novo_usuario@gmail.com",
    password: "Password123!"
  } as const;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    // Evita chamadas de inicialização limpas para focar estritamente no clique de registro
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } });
    vi.mocked(axios.post).mockResolvedValue({ data: {} });
  });

  it("fluxo 1: deve registrar com sucesso e retornar os dados enviados pela API Fastify", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Simula a resposta de sucesso (HTTP 200) da sua API
    const mockApiResponse = {
      message: "Aguarde..., Você receberá um e-mail com o código de confirmação",
      error: false,
      technicalError: false
    };
    vi.mocked(axios.post).mockResolvedValue({ data: mockApiResponse });

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(validMockUserData);
    });

    // Verifica se a função executou a chamada na URL correta com o payload correto
    expect(axios.post).toHaveBeenCalledWith("https://localhost:3000/auth/register", validMockUserData);
    
    // Verifica se o retorno da função é exatamente o objeto enviado pelo servidor
    expect(registerResult).toEqual(mockApiResponse);
  });

  it("fluxo 2: deve capturar falhas controladas do servidor e mapear as propriedades do apiError do seu catch", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Simula uma resposta de erro estruturada do seu registerController (ex: e-mail duplicado)
    const mockApiError = {
      message: "E-mail já cadastrado!",
      technicalError: false,
      error: "EMAIL_ALREADY_EXISTS"
    };
    
    vi.mocked(axios.post).mockRejectedValue({
      response: {
        data: mockApiError
      }
    });

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(validMockUserData);
    });

    // Valida se as propriedades foram repassadas e convertidas de acordo com as regras do catch
    expect(registerResult).toEqual({
      error: true,
      message: "E-mail já cadastrado!",
      technicalError: false,
      log: "EMAIL_ALREADY_EXISTS" // mapeia o apiError.error para a chave log
    });

    // Garante que o console.error obrigatório do catch foi executado
    expect(console.error).toHaveBeenCalledWith("Erro no registro: ", expect.anything());
  });

  it("fluxo 3: deve acionar o fallback de mensagem genérica se o servidor não responder por queda de rede", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Simula um erro de rede puro (onde o objeto response vem indefinido ou indisponível)
    const mockNetworkError = new Error("Network Error");
    vi.mocked(axios.post).mockRejectedValue(mockNetworkError);

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(validMockUserData);
    });

    // Valida se as strings de fallback e o false padrão do technicalError foram disparados
    expect(registerResult).toEqual({
      error: true,
      message: "Erro ao conectar com o servidor, tente novamente mais tarde",
      technicalError: false,
      log: undefined
    });
  });
});