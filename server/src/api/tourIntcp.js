import axios from "axios";
import { BASE_API_URL, TOUR_REQUIRED_FIELDS } from "../constants/tourConstants.js";

export const tourApi = axios.create({
    baseURL: BASE_API_URL,
    timeout: 5000, // 5초 타임아웃 설정
});

tourApi.interceptors.request.use(config => {
    // 요청이 시작되기 전에 수행할 작업
    // console.log('Starting Request PRAMEA', config.params);
    // console.log('Starting Request URL', config.url);
    config.params = {
        ...TOUR_REQUIRED_FIELDS, // 필수 파라미터
        ...config.params // 추가 파라미터
    };
    return config;
}, error => {
    // 요청 오류가 있는 경우 수행할 작업
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});

tourApi.interceptors.response.use(response => {
    // 응답 데이터를 가공하는 작업
    // console.log('Response:', response);
    return response;
}, error => {
    // 응답 오류가 있는 경우 수행할 작업
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});

export default tourApi;



