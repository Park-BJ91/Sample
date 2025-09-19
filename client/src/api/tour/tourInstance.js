import axios from "axios";


const API_BASE_URL = "http://localhost:4000/api/tour"; // Replace with your backend URL

export const tourApi = axios.create({
    baseURL: API_BASE_URL,
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

tourApi.interceptors.request.use(config => {
    // 요청이 시작되기 전에 수행할 작업
    // console.log('Starting Request', config);
    return config;
}, error => {
    // 요청 오류가 있는 경우 수행할 작업
    return Promise.reject(error);
});

tourApi.interceptors.response.use(response => {
    // 응답 데이터를 가공하는 작업
    // console.log('Response:', response);
    return response;
}, error => {
    // 응답 오류가 있는 경우 수행할 작업
    return Promise.reject(error);
});


