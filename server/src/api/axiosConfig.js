import createAPI from "./createAxios.js";
import { TOUR_REQUIRED_FIELDS, WEATHER_FIELDS } from "../constants/publicApiConstants.js";



/**
 *  API Interceptors
 *  */

/* Tour */
createAPI.tourApi.interceptors.request.use(config => {
    config.params = {
        ...TOUR_REQUIRED_FIELDS, // 필수 파라미터
        ...config.params // 추가 파라미터
    };
    return config;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});

/* Tour */
createAPI.tourApi.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});

/* Weather Short */
createAPI.weatherShortApi.interceptors.request.use(config => {
    config.params = {
        ...WEATHER_FIELDS, // 필수 파라미터
        ...config.params // 추가 파라미터
    };
    return config;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});


/* Weather Mid */
createAPI.weatherMidApi.interceptors.request.use(config => {
    config.params = {
        ...WEATHER_FIELDS, // 필수 파라미터
        ...config.params // 추가 파라미터
    };
    return config;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});


/* Weather Mid */
createAPI.weatherMidApi.interceptors.request.use(config => {
    config.params = {
        ...WEATHER_FIELDS, // 필수 파라미터
        ...config.params // 추가 파라미터
    };
    return config;
}, error => {
    return Promise.resolve({ success: false, message: error.message }); // 일관된 에러 응답 반환
});
