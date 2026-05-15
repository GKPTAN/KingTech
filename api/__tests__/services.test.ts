import sendEmailToUser from "@/services/emailService";
import transporter from "@/config/emailConfig";
import getLocationUser from "@/services/locationService";
import axiosConfig from "@/config/axiosConfig";

vi.mock('../src/config/emailConfig', () => ({
    default: {
        sendMail: vi.fn(),
    }
}));

describe('Email service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve enviar um e-mail com sucesso', async () => {
        const mockInfo = {messageId: '12345'};

        vi.mocked(transporter.sendMail).mockResolvedValue(mockInfo);

        const emailOptions = {
            from: 'test@kingtech.com',
            to: "user@teste.com",
            subject: "Teste",
            text: "Olá mundo",
            html: "<p>Olá Mundo</p>"
        };

        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        await sendEmailToUser(emailOptions);

        expect(transporter.sendMail).toHaveBeenCalledWith(emailOptions);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Email enviado com sucesso, id: "), mockInfo.messageId);
    });

    it('deve lançar um erro e fazer log no console se o envio falhar', async () => {
        const mockError = new Error("Falha no SMTP");

        vi.mocked(transporter.sendMail).mockRejectedValue(mockError);

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(sendEmailToUser({to: "err@error.com"} as any)).rejects.toThrow('Falha no SMTP');
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Erro ao enviar o e-mail: '), mockError);
    });
});

vi.mock('../src/config/axiosConfig', () => ({
    default: {get: vi.fn()},
}));

describe('Location service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve retornar um objeto com dados válidos em caso de sucesso', async () => {
        vi.mocked(axiosConfig.get).mockResolvedValue({
            data: {
                city: "Regensburg",
                regionName: "Bavaria",
                country: "Germany",
                lat: 49.0144,
                lon: 12.0966
            }
        })

        const result = await getLocationUser('132.199.219.198');

        expect(result).toEqual({
            city: "Regensburg",
            region: "Bavaria",
            country: "Germany",
            loc: "49.0144 12.0966"
        });
    });

    it('Deve retornar erro ao tentar pegar a localização do usuário', async () => {
        vi.mocked(axiosConfig.get).mockRejectedValue(new Error("Network Error"));

        const result = await getLocationUser("1.1.1.1");

        expect(result).toEqual({
            city: "localização indisponível",
            region: "localização indisponível",
            country: "localização indisponível",
            loc: "localização indisponível"
        });
    });
});