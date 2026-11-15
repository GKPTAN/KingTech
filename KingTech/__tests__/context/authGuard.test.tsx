/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes} from "react-router-dom";

import AuthGuard from "@/context/AuthGuard";
import { useAuth } from "@/context/useAuth";

vi.mock('@/context/useAuth', () => ({
    useAuth: vi.fn()
}));

vi.mock('@/components/layout/loading/LoadingPage', () => ({
    default: () => <div data-testid="loading-page">Carregando...</div>
}));

describe("Auth Guard Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve renderizar a página de loading quando o estado for de carregamento", async () => {
        vi.mocked(useAuth).mockReturnValue({user: null, loading: true} as any);

        render(
            <MemoryRouter>
                <AuthGuard><div>Conteúdo Protegido</div></AuthGuard>
            </MemoryRouter>
        );

        const elementLoading = screen.getByTestId("loading-page");

        expect(elementLoading).not.toBeNull();
    });

    it("Deve redirecionar para o login se o usuário não estiver autenticado", async () => {
        vi.mocked(useAuth).mockReturnValue({user: null, loading: false} as any);

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={
                        <AuthGuard><div>Conteúdo Protegido</div></AuthGuard>
                    }/>
                    <Route path="account/login" element={<div>Página de Login</div>}/>
                </Routes>
            </MemoryRouter>
        );

        const elementText = screen.getByText("Página de Login");
        expect(elementText).not.toBeNull();
    });

    it("Deve redirecionar para 403 se o usuário não tiver a role necessária", async () => {
        vi.mocked(useAuth).mockReturnValue({
            user: {id: '1', role: 'user'}, 
            loading: false
        } as any);

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/admin" element={
                        <AuthGuard roles={['admin']}><div>Painel Admin</div></AuthGuard>
                    }/>
                    <Route path="*" element={<div>Página não encontrada (404)</div>}/>
                </Routes>
            </MemoryRouter>
        );

        const errorPage = screen.getByText("Página não encontrada (404)");
        expect(errorPage).not.toBeNull();
    });

    it("Deve renderizar o conteúdo se o usuário estiver logado e com a role correta", async () => {
        vi.mocked(useAuth).mockReturnValue({
            user: {id: '1', role: 'admin'}, 
            loading: false
        } as any);

        render(
            <MemoryRouter>
                <AuthGuard roles={['admin']}>
                    <div data-testid="protected">Painel Admin Secreto</div>
                </AuthGuard>
            </MemoryRouter>
        );

        const elementProtected = screen.getByTestId("protected");
        const textPage = screen.getByText("Painel Admin Secreto");

        expect(elementProtected).not.toBeNull();
        expect(textPage).not.toBeNull();
    });
});