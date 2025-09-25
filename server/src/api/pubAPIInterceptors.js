import axios from "axios";
import PubConstants, { TOUR_REQUIRED_FIELDS, WEATHER_FIELDS } from "../constants/publicApiConstants.js";


/** Tour */
export const tourApi = axios.create({
    baseURL: PubConstants.TOUR_BASE_URL,
    timeout: 5000, // 5초 타임아웃 설정
});

/** Weather Short */
export const weatherShortApi = axios.create({
    baseURL: PubConstants.WEATHER_SHORT_BASE_URL,
    timeout: 5000, // 5초 타임아웃 설정
});


/** Weather Mid */
export const weatherMidApi = axios.create({
    baseURL: PubConstants.WEATHER_MID_BASE_URL,
    timeout: 5000 // 5초 타임아웃 설정
});


tourApi.interceptors.request.use(config => {
    config.params = {
        ...TOUR_REQUIRED_FIELDS, // 필수 파라미터
        ...config.params // 추가 파라미터
    };
    return config;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});

tourApi.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});

weatherShortApi.interceptors.request.use(config => {
    config.params = {
        ...WEATHER_FIELDS, // 필수 파라미터
        ...config.params // 추가 파라미터
    };
    return config;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});

weatherShortApi.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});


weatherMidApi.interceptors.request.use(config => {
    config.params = {
        ...WEATHER_FIELDS, // 필수 파라미터
        ...config.params // 추가 파라미터
    };
    return config;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});

weatherMidApi.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});







export default {
    tourApi,
    weatherShortApi,
    weatherMidApi
};



