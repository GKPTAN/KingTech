import axios, {type AxiosInstance} from "axios";

const axiosConfig: AxiosInstance = axios.create({
    baseURL: "https://ipinfo.io",
    headers: {
        "Content-Type": "application/json",
    }
});

export default axiosConfig;