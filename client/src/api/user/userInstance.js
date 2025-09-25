import axios from "axios";

const userApi = axios.create({
    baseURL: import.meta.env.VITE_SERVER_USER_API,
    headers: {
        "Content-Type": "application/json",
    },
});

export default userApi;
