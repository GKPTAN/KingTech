import axios, {type AxiosInstance} from "axios";

const axiosConfig: AxiosInstance = axios.create({
    baseURL: "http://ip-api.com",
    headers: {
        "Content-Type": "application/json",
    }
});

export default axiosConfig;