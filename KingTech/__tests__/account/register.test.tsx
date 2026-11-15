/* eslint-disable no-undef */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { validateDataRegister } from "@/utils/validateData";

import { useAuth } from "@/context/useAuth";

import Registro from "@/pages/account/Registro";

vi.mock('@/context/useAuth', () => ({
    useAuth: vi.fn()
}));

vi.mock('@/utils/validateData', () => ({
    validateDataRegister: vi.fn()
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const original: any = await importOriginal();
    return {
        ...original,
        useNavigate: () => mockNavigate
    }
});

describe("Componente de registro (Cadastro)", () => {
    const mockRegister = vi.fn();
    const mockVerify = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useAuth).mockReturnValue({
            register: mockRegister,
            verify: mockVerify,
            loading: false,
            user: null,
        } as any);
    });

    it("Deve formatar a data automaticamente adicionando as barras", async () => {
        render(
            <MemoryRouter>
                <Registro />
            </MemoryRouter>
        );

        const dateInput = screen.getByPlaceholderText("Data de nascimento") as HTMLInputElement;

        fireEvent.change(dateInput, {target: {value: "0"}});
        fireEvent.change(dateInput, {target: {value: "05"}});
        fireEvent.change(dateInput, {target: {value: "050"}});
        fireEvent.change(dateInput, {target: {value: "0503"}});
        fireEvent.change(dateInput, {target: {value: "05032"}});
        fireEvent.change(dateInput, {target: {value: "050320"}});
        fireEvent.change(dateInput, {target: {value: "0503200"}});
        fireEvent.change(dateInput, {target: {value: "05032003"}});
        fireEvent.change(dateInput, {target: {value: "05032003"}});

        const valorFinal = dateInput.value;

        expect(valorFinal).toBe("05/03/2003");
    });

    it("Deve exibir erro se a validação do Zod/senhas falhar", async () => {
        vi.mocked(validateDataRegister).mockResolvedValue({
            error: true,
            field: 'confirm_password',
            issue: 'password_mismatch',
            message: "As senhas não coincidem!"
        } as any);

        render(
            <MemoryRouter>
                <Registro />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Nome Completo"), {target: {value: "José Santos"}});
        const dateInput = screen.getByPlaceholderText("Data de nascimento") as HTMLInputElement;

        fireEvent.change(dateInput, {target: {value: "0"}});
        fireEvent.change(dateInput, {target: {value: "05"}});
        fireEvent.change(dateInput, {target: {value: "050"}});
        fireEvent.change(dateInput, {target: {value: "0503"}});
        fireEvent.change(dateInput, {target: {value: "05032"}});
        fireEvent.change(dateInput, {target: {value: "050320"}});
        fireEvent.change(dateInput, {target: {value: "0503200"}});
        fireEvent.change(dateInput, {target: {value: "05032003"}});
        fireEvent.change(dateInput, {target: {value: "05032003"}});

        fireEvent.change(screen.getByPlaceholderText("E-mail"), {target: {value: "teste@gmail.com"}});
        fireEvent.change(screen.getByPlaceholderText("Senha"), {target: {value: "senha123"}});
        fireEvent.change(screen.getByPlaceholderText("Confirmar senha"), {target: {value: "diferente"}});

        fireEvent.click(screen.getByText("Continuar"), {name: /Continuar/i});

        await waitFor(() => {
            const errorMessage = screen.getByText("As senhas não coincidem!");
            expect(errorMessage).not.toBeNull();
        });
    });

    it("Deve ativar a segunda etapa (form de confirmação) quando o registro no servidor for bem-sucedido", async () => {
        vi.mocked(validateDataRegister).mockResolvedValue(true);

        mockRegister.mockResolvedValue({
            message: "Aguarde..., Você receberá um e-mail com o código de confirmação",
            error: false,
            technicalError: false,
        });

        render(
            <MemoryRouter>
                <Registro />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Nome Completo"), {target: {value: "José Santos"}});
        const dateInput = screen.getByPlaceholderText("Data de nascimento") as HTMLInputElement;

        fireEvent.change(dateInput, {target: {value: "0"}});
        fireEvent.change(dateInput, {target: {value: "05"}});
        fireEvent.change(dateInput, {target: {value: "050"}});
        fireEvent.change(dateInput, {target: {value: "0503"}});
        fireEvent.change(dateInput, {target: {value: "05032"}});
        fireEvent.change(dateInput, {target: {value: "050320"}});
        fireEvent.change(dateInput, {target: {value: "0503200"}});
        fireEvent.change(dateInput, {target: {value: "05032003"}});
        fireEvent.change(dateInput, {target: {value: "05032003"}});

        fireEvent.change(screen.getByPlaceholderText("E-mail"), {target: {value: "teste@gmail.com"}});
        fireEvent.change(screen.getByPlaceholderText("Senha"), {target: {value: "senha123"}});
        fireEvent.change(screen.getByPlaceholderText("Confirmar senha"), {target: {value: "diferente"}});

        fireEvent.click(screen.getByText("Continuar"), {name: /Continuar/i});

        await waitFor(() => {
            const codeFormTitle = screen.getByText("código de confirmação");
            expect(codeFormTitle).not.toBeNull();
        });
    });

    it("Deve chamar a função verify quando o código de confirmação for enviado", async () => {
        vi.mocked(validateDataRegister).mockResolvedValue(true);

        mockRegister.mockResolvedValue({
            message: "Aguarde..., Você receberá um e-mail com o código de confirmação",
            error: false,
            technicalError: false,
        });

        mockVerify.mockResolvedValue({
            message: "E-mail confirmado com sucesso",
            error: false,
            technicalError: false,
            location: "/account/login",
        });

        render(
            <MemoryRouter>
                <Registro />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Nome Completo"), {target: {value: "José Santos"}});
        const dateInput = screen.getByPlaceholderText("Data de nascimento") as HTMLInputElement;

        fireEvent.change(dateInput, {target: {value: "0"}});
        fireEvent.change(dateInput, {target: {value: "05"}});
        fireEvent.change(dateInput, {target: {value: "050"}});
        fireEvent.change(dateInput, {target: {value: "0503"}});
        fireEvent.change(dateInput, {target: {value: "05032"}});
        fireEvent.change(dateInput, {target: {value: "050320"}});
        fireEvent.change(dateInput, {target: {value: "0503200"}});
        fireEvent.change(dateInput, {target: {value: "05032003"}});
        fireEvent.change(dateInput, {target: {value: "05032003"}});

        fireEvent.change(screen.getByPlaceholderText("E-mail"), {target: {value: "teste@gmail.com"}});
        fireEvent.change(screen.getByPlaceholderText("Senha"), {target: {value: "senha123"}});
        fireEvent.change(screen.getByPlaceholderText("Confirmar senha"), {target: {value: "diferente"}});

        fireEvent.click(screen.getByText("Continuar"), {name: /Continuar/i});

        await waitFor(() => {
            expect(screen.getByPlaceholderText("Código de confirmação")).not.toBeNull();
        });

        fireEvent.change(screen.getByPlaceholderText("Código de confirmação"), {target: {value: "123456"}});
        fireEvent.click(screen.getByText("Confirmar"), {name: /Confirmar/i});

        await waitFor(() => {
            expect(mockVerify).toHaveBeenCalledWith("123456");
        });
    });
});