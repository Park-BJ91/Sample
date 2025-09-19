import { tourApi } from "@api/tour/tourInstance";


export const regionsList = async () => {
    return await tourApi.get(`/regions`); // 지역 코드 전체
};

export const toursList = async (query) => { // 축제 X 관광지
    return await tourApi.get(`/tour_`, { params: query });
};

export const tourDetail = async (id, contentTypeId) => {
    return await tourApi.get(`/detail/${id}?contentTypeId=${contentTypeId}`);
};