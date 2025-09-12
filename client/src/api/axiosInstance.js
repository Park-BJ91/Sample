import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_AUTH_API,
    // withCredentials: true // 쿠키 포함 요청
});

export default axiosInstance;