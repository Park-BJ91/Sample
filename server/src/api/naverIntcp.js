import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const CLIENT_ID = process.env.NAVER_CLOUD_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLOUD_CLIENT_SECRET;
const STATIC_BASE_API_URL = process.env.NAVER_CLOUD_CLIENT_MAP_STATIC_URL; // 네이버 검색 API 기본 URL
const DYNAMIC_BASE_API_URL = process.env.NAVER_CLOUD_CLIENT_MAP_DYNAMIC_URL; // 네이버 검색 API 기본 URL

export const naverMapStaticApi = axios.create({
    baseURL: STATIC_BASE_API_URL,
    timeout: 5000, // 5초 타임아웃 설정
    headers: {
        "x-ncp-apigw-api-key-id": CLIENT_ID,
        "x-ncp-apigw-api-key": CLIENT_SECRET
    }
});

export const naverMapDynamicApi = axios.create({
    baseURL: DYNAMIC_BASE_API_URL,
    timeout: 5000, // 5초 타임아웃 설정
});

export default {
    naverMapStaticApi,
    naverMapDynamicApi
};