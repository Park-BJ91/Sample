import dotenv from 'dotenv';
dotenv.config();

const serviceKey = encodeURIComponent(process.env.SERVICE_KEY || 'default_key'); // URL 인코딩된 서비스 키

const TourMobileOS = process.env.TOUR_MOBILE_OS || 'ETC';
const TourMobileApp = process.env.TOUR_MOBILE_APP || 'AppTest';
const TourlangDivCd = process.env.TOUR_LANGUAGE || 'KOR';

export const TOUR_BASE_URL = process.env.TOUR_BASE_URL || 'https://example.com/api';
export const WEATHER_SHORT_BASE_URL = process.env.WEATHER_SHORT_BASE_URL;
export const WEATHER_MID_BASE_URL = process.env.WEATHER_MID_BASE_URL;

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


export default {
    TOUR_BASE_URL,
    TOUR_REQUIRED_FIELDS,
    WEATHER_SHORT_BASE_URL,
    WEATHER_MID_BASE_URL,
    WEATHER_FIELDS
};


