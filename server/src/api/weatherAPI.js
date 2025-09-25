import { weatherShortApi, weatherMidApi } from "./pubAPIInterceptors.js";


export const getUltraShortTermWeather = async (weatherParams) => {
    try {
        const { data } = await weatherShortApi.get("/getUltraSrtNcst", {
            params: {
                ...weatherParams
                // base_date: new Date().toISOString().slice(0, 10).replace(/-/g, ''), // YYYYMMDD
                // base_time: '1330', // 고정값 예시, 실제로는 현재 시간 기준으로 설정 필요
                // nx: pnx,
                // ny: pny,
            }
        });

        return data.response.body.items.item;
    } catch (error) {
        console.error("getShortWeather 에러:", error);
        return { success: false, message: error.message };
    }
}

const SHORT_TERM_FORECAST_CACHE = new Map();


export const getShortTermForecastWeather = async (weatherParams) => {
    const cacheKey = 'temporaryKey'; // 필요시 더 정교한 키 생성
    const cached = SHORT_TERM_FORECAST_CACHE.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
        console.log("캐시된 단기예보 데이터 사용");
        return cached.data;
    }

    try {
        const { data } = await weatherShortApi.get("/getVilageFcst", {
            params: {
                ...weatherParams
            }
        });

        console.log("🚀 ~ API getShortTermForecastWeather ~ NO CACHE :");

        SHORT_TERM_FORECAST_CACHE.set(cacheKey, {
            data: data.response.body.items.item,
            expires: Date.now() + 60 * 24 * 60 * 1000 // 24시간 캐시
        });

        return data.response.body.items.item;
    } catch (error) {
        console.error("getMidWeather 에러:", error);
        return { success: false, message: error.message };
    }
}


export default {
    getUltraShortTermWeather,
    getShortTermForecastWeather
};