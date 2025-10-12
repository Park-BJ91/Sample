import axios from "axios";

const AUTH_PATH = import.meta.env.VITE_SERVER_AUTH_API;
const FAVORITE_PATH = import.meta.env.VITE_SERVER_FAVORITE_API;

/** 인증 API 인스턴스 */
export const authAxios = axios.create({
    baseURL: AUTH_PATH,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // 쿠키를 자동으로 포함
});

/** 즐겨찾기 API 인스턴스 */
export const favoriteAxios = axios.create({
    baseURL: FAVORITE_PATH,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // 쿠키를 자동으로 포함
});

/** 관광 API 인스턴스 */
export const tourAxios = axios.create({
    baseURL: import.meta.env.VITE_SERVER_TOUR_API,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000, // 5초 타임아웃 설정
    paramsSerializer: { // 쿼리 파라미터 직렬화 설정
        serialize: params => {
            return new URLSearchParams(params).toString();
        }
    }
});

/** 사용자 API 인스턴스 */
export const userAaxios = axios.create({
    baseURL: import.meta.env.VITE_SERVER_USER_API,
    headers: {
        "Content-Type": "application/json",
    },
});

/** 게시판 API 인스턴스 */
export const boardAxios = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BOARD_API,
    headers: {
        "Content-Type": "application/json",
    },
});

