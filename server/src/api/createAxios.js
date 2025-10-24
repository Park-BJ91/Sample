import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// URL 인코딩된 서비스 키
const serviceKey = encodeURIComponent(process.env.SERVICE_KEY || 'default_key');

/* 투어 관련 환경 */
const TourMobileOS = process.env.TOUR_MOBILE_OS || 'ETC';
const TourMobileApp = process.env.TOUR_MOBILE_APP || 'AppTest';
const TourlangDivCd = process.env.TOUR_LANGUAGE || 'KOR';


/** 
 * 네이버 환경 
*/
/* 클라이언트 */
const CLIENT_ID = process.env.NAVER_CLOUD_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLOUD_CLIENT_SECRET;

/* 지도 */
const STATIC_BASE_API_URL = process.env.NAVER_CLOUD_CLIENT_MAP_STATIC_URL; // 네이버 검색 API 기본 URL
const DYNAMIC_BASE_API_URL = process.env.NAVER_CLOUD_CLIENT_MAP_DYNAMIC_URL; // 네이버 검색 API 기본 URL


/* 공공 API URL */
export const TOUR_BASE_URL = process.env.TOUR_BASE_URL;
export const WEATHER_SHORT_BASE_URL = process.env.WEATHER_SHORT_BASE_URL;
export const WEATHER_MID_BASE_URL = process.env.WEATHER_MID_BASE_URL;



// 공공 API Object.freeze → 수정 불가, 읽기 전용
export const TOUR_REQUIRED_FIELDS = Object.freeze({
    serviceKey: serviceKey, // 서비스 키
    MobileOS: TourMobileOS, // OS 구분 (IOS, AND, WIN,ETC)
    MobileApp: TourMobileApp, // 모바일 앱 (서버명)
    langDivCd: TourlangDivCd, // 언어 구분 코드 (KOR: 한국어, ENG: 영어, JPN: 일어, CHS: 중국어(간체), CHT: 중국어(번체), GER: 독일어, FRE: 프랑스어, SPN: 스페인어, RUS: 러시아어)
    _type: 'json', // 응답 타입 (json, xml)
});


export const WEATHER_FIELDS = Object.freeze({
    serviceKey: serviceKey, // 서비스 키
    pageNo: 1, // 페이지 번호
    numOfRows: 1000, // 한 페이지 결과 수
    dataType: 'JSON', // 응답 데이터 타입 (XML, JSON)
});

/** Tour */
export const tourApi = axios.create({
    baseURL: TOUR_BASE_URL,
    timeout: 5000, // 5초 타임아웃 설정
});

/** Weather Short */
export const weatherShortApi = axios.create({
    baseURL: WEATHER_SHORT_BASE_URL,
    timeout: 5000, // 5초 타임아웃 설정
});

/** Weather Mid */
export const weatherMidApi = axios.create({
    baseURL: WEATHER_MID_BASE_URL,
    timeout: 5000 // 5초 타임아웃 설정
});


/* 네이버 정적 지도 API */
export const naverMapStaticApi = axios.create({
    baseURL: STATIC_BASE_API_URL,
    timeout: 5000, // 5초 타임아웃 설정
    headers: {
        "x-ncp-apigw-api-key-id": CLIENT_ID,
        "x-ncp-apigw-api-key": CLIENT_SECRET
    }
});

/* 네이버 동적 지도 API */
export const naverMapDynamicApi = axios.create({
    baseURL: DYNAMIC_BASE_API_URL,
    timeout: 5000, // 5초 타임아웃 설정
});


tourApi.interceptors.request.use(config => {
    // 모든 요청에 공통 파라미터 추가
    config.params = {
        ...config.params,
        ...TOUR_REQUIRED_FIELDS
    };
    return config;
});

weatherShortApi.interceptors.request.use(config => {
    // 모든 요청에 공통 파라미터 추가
    config.params = {
        ...config.params,
        ...WEATHER_FIELDS
    };
    return config;
});

weatherMidApi.interceptors.request.use(config => {
    // 모든 요청에 공통 파라미터 추가
    config.params = {
        ...config.params,
        ...WEATHER_FIELDS
    };
    return config;
});

export default {
    tourApi,
    weatherShortApi,
    weatherMidApi,
    naverMapStaticApi,
    naverMapDynamicApi,
};
