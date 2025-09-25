import axios from "axios";

const AUTH_PATH = import.meta.env.VITE_SERVER_AUTH_API;

export const authAxios = axios.create({
    baseURL: AUTH_PATH,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // 쿠키를 자동으로 포함
});