import type { locationUser } from "@/types/auth/location.js";
import axiosConfig from "../config/axiosConfig.js";

const getLocationUser = async (ip: string): Promise<locationUser> => {
    try {
        const response = await axiosConfig.get(`/json/${ip}`);
        const data = await response.data;
        
        return {
            city: data.city || "localização indisponível",
            region: data.regionName || "localização indisponível",
            country: data.country || "localização indisponível",
            loc: String(data.lat + " " + data.lon) || "localização indisponível",
        };
    } catch (error) {
        console.error("Erro ao obter a localização do usuário: ", error);
        return {
            city: "localização indisponível",
            region: "localização indisponível",
            country: "localização indisponível",
            loc: "localização indisponível",
        };
    };
};

export default getLocationUser