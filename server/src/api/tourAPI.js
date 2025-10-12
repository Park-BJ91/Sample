import createAxios from "./createAxios.js";

/** 지역 코드 전체 */
export async function citiesAll() {
    const { data } = await createAxios.tourApi.get(`/ldongCode?numOfRows=230&lDongListYn=Y`);
    console.log(data);
    return data.response.body.items.item;
};

/** 지역 관광 */
export async function regionTour(query) {
    const { data } = await createAxios.tourApi.get(`/areaBasedList?numOfRows=100&arrange=D&${new URLSearchParams(query).toString()}`);
    return data.response.body.items.item;
};

export async function tourDetailCommon(id) {
    const { data } = await createAxios.tourApi.get(`/detailCommon?contentId=${id}`);
    return data.response.body.items.item;
};

export async function tourDetailIntro(id, contentTypeId) {
    const { data } = await createAxios.tourApi.get(`/detailIntro?contentId=${id}&contentTypeId=${contentTypeId}`);
    return data.response.body.items.item;
}

export async function tourDetailInfo(id, contentTypeId) {
    const { data } = await createAxios.tourApi.get(`/detailInfo?contentId=${id}&contentTypeId=${contentTypeId}`);
    return data.response.body.items.item;
};

export default {
    citiesAll,
    regionTour,
    tourDetailCommon,
    tourDetailIntro,
    tourDetailInfo,
};