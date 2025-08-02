import axiosConfig from "../config/axiosConfig.js";

const getLocationUser = async (ip) => {
    try {
        const response = await axiosConfig.get(`/lite/${ip}/json?token=${process.env.IP_TOKEN}`);
        const data = await response.data;
        
        return {
            city: data.city || "localização indisponível",
            region: data.region || "localização indisponível",
            country: data.country || "localização indisponível",
            loc: data.loc || "localização indisponível",
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