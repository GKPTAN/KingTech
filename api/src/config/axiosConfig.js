import axios from "axios";

const axiosConfig = axios.create({
    baseURL: "https://ipinfo.io",
    headers: {
        "Content-Type": "application/json",
    }
});

export default axiosConfig;