import { naverMapDynamicApi, naverMapStaticApi } from './naverIntcp.js';


export const getDynamicMap = async (pointer) => {
    const coords = [pointer.mapX, pointer.mapY].join(',');
    const { data } = await naverMapDynamicApi.get(`/maps.js`, {
        params: {
            center: coords,
            level: 10,
            key: process.env.NAVER_CLOUD_CLIENT_ID
        }
    });
    return data;
};


export const getStaticMap = async (pointer) => {
    const coords = [pointer.mapX, pointer.mapY].join(',');
    const { data } = await naverMapStaticApi.get(`/raster`, {
        params: {
            level: 12, // 1~20 (낮을수록 확대)
            lang: 'ko',
            w: 400,
            h: 400,
            center: coords, // 경도,위도
            maptype: 'basic', // basic, satellite, satellite_base, terrain 
            format: 'jpg', // png, png8, jpg
            scale: 2, // 1: 표준  2: 고해상도
            markers: `type:d|size:mid|pos:${coords}|label:1|color:green|viewSizeRatio:0.5`, // 마커 설정
        }
    });
    return data;
};

export default {
    getStaticMap,
    getDynamicMap,
};
