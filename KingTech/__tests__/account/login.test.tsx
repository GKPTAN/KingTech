/* eslint-disable no-undef */
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { validateDataLogin } from "@/utils/validateData";

import { useAuth } from "@/context/useAuth";

import Login from "@/pages/account/Login";

vi.mock('@/context/useAuth', () => ({
    useAuth: vi.fn()
}));

vi.mock('@/utils/validateData', () => ({
    validateDataLogin: vi.fn()
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const original: any = await importOriginal();
    return {
        ...original,
        useNavigate: () => mockNavigate
    }
});

describe('Componente de login', () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useAuth).mockReturnValue({
            login: mockLogin,
            loading: false,
            user: null,
        } as any);
    });

    it("Deve exibir erro de validação local se o zod rejeitar os dados", async () => {
        vi.mocked(validateDataLogin).mockResolvedValue({
            error: true,
            field: 'email',
            issue: 'invalid_string',
            message: "Formato de email inválido!"
        } as any);

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("E-mail"), { target: {value: "errado@invalido"}});
        fireEvent.change(screen.getByPlaceholderText("Senha"), { target: {value: "1235463634"}});

        fireEvent.click(screen.getByRole("button", {name: /entrar/i}));

        await waitFor(() => {
            const errorMessage = screen.getByText("Formato de email inválido!");
            expect(errorMessage).not.toBeNull();
        });
    });

    it("Deve exibir erro do servidor caso a api de login falhe", async () => {
        vi.mocked(validateDataLogin).mockResolvedValue(true);

        mockLogin.mockResolvedValue({
            error: true,
            message: "Erro ao conectar com o servidor, tente novamente mais tarde",
            technicalError: false,
            log: false
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("E-mail"), { target: {value: "teste@gmail.com"}});
        fireEvent.change(screen.getByPlaceholderText("Senha"), { target: {value: "senha123"}});

        fireEvent.click(screen.getByRole("button", {name: /entrar/i}));

        await waitFor(() => {
            const errorMessage = screen.getByText("Erro ao conectar com o servidor, tente novamente mais tarde");
            expect(errorMessage).not.toBeNull();
        });
    });

    it("Deve desabilitar o botão e redirecionar para a localização correta após login bem-sucedido", async () => {
        vi.mocked(validateDataLogin).mockResolvedValue(true);

        mockLogin.mockResolvedValue({
            message: "Login realizado com sucesso.",
            error: false,
            technicalError: false,
            user: {
                id: "123",
                name: "teste",
                email: "teste@gmail.com",
                role: "user",
                raw: {}
            },
            expiresIn: 3600,
            location: "/account/dashboard",
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("E-mail"), { target: {value: "teste@gmail.com"}});
        fireEvent.change(screen.getByPlaceholderText("Senha"), { target: {value: "senha123"}});

        fireEvent.click(screen.getByRole("button", {name: /entrar/i}));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/account/dashboard');
        });
    })
});