import axios, {type AxiosInstance} from "axios";

const AxiosConfig: AxiosInstance = axios.create({
    baseURL: `https://localhost:3000`,
    headers: {
        "Content-Type": "application/json" 
    },
    withCredentials: true,
})

export default AxiosConfig;