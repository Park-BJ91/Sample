import { authAxios } from "@api/auth/authInstance";

const AUTH_PATH = import.meta.env.VITE_SERVER_AUTH_API;


// 로그인
export const userLoginAPI = async (credentials) => {
    const response = await authAxios.post('/local/login', credentials);
    return response;
};

// 로그아웃
export const userLogoutAPI = async () => {
    const response = await authAxios.get("/logout");
    return response;
};

/** 토큰 검증 API */
export const verifyToken = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await authAxios.get(
            `/verifyToken`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        // return response.data;
        return response
    } catch (error) {
        console.error("Failed to verify token:", error.response);
        return error.response;
    }
};


/** 쿠키 검증 API */
export const verifyCookie = async () => {
    try {
        const response = await authAxios.get(
            `/verifyCookie`,
            { withCredentials: true } // 쿠키 포함
        );
        return response;
    } catch (error) {
        console.error("Failed to verify cookie:", error.response);
        return error.response;
    }
};

