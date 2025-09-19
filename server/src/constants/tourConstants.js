import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.TOUR_BASE_URL || 'https://example.com/api';
const serviceKey = encodeURIComponent(process.env.TOUR_SERVICE_KEY || 'default_key'); // URL 인코딩된 서비스 키
const MobileOS = process.env.TOUR_MOBILE_OS || 'ETC';
const MobileApp = process.env.TOUR_MOBILE_APP || 'AppTest';
const langDivCd = process.env.TOUR_LANGUAGE || 'KOR';

export const BASE_API_URL = BASE_URL;

export const TOUR_REQUIRED_FIELDS = Object.freeze({
    serviceKey: serviceKey, // 서비스 키
    MobileOS: MobileOS, // OS 구분 (IOS, AND, WIN,ETC)
    MobileApp: MobileApp, // 모바일 앱 (서버명)
    langDivCd: langDivCd, // 언어 구분 코드 (KOR: 한국어, ENG: 영어, JPN: 일어, CHS: 중국어(간체), CHT: 중국어(번체), GER: 독일어, FRE: 프랑스어, SPN: 스페인어, RUS: 러시아어)
    _type: 'json', // 응답 타입 (json, xml)
});