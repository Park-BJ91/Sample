import { tourAxios } from "@config/apiInstance";


export const regionsList = async () => {
    return await tourAxios.get(`/regions`); // 지역 코드 전체
};

export const toursList = async (query) => { // 축제 X 관광지
    return await tourAxios.get(`/tour_`, { params: query });
};

export const tourDetail = async (id, contentTypeId) => {
    return await tourAxios.get(`/detail/${id}?contentTypeId=${contentTypeId}`);
};