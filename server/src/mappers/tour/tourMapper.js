
const TOUR_DEF_PARAME_MAP = {
    size: 'pageNo', // 페이지 번호 (기본값: 1)
    page: 'numOfRows', // 한 페이지 결과 수 (기본값: 10, 최대값: 100)
};

// 법정동 코드
export const TOUR_IDONG_CODE_MAP = {
    ...TOUR_DEF_PARAME_MAP,
    // 법정동 시도코드 2자리 (예: 11: 서울특별시, 26: 부산광역시, ...)
    sidoCode: 'lDongRegnCd', // 시도 코드
    sidoCodeYn: 'lDongListYn', // 법정동 목록조회 여부 (N: 코드조회 , Y: 전체목록조회)
};

// 지역 축제 코드
export const TOUR_REGION_CODE_MAP = {
    ...TOUR_DEF_PARAME_MAP,
    sidoCode: 'lDongRegnCd', // 시도 코드
    signguCode: 'lDongSignguCd', // 시군구 코드
};


// 지역기반 관광정보 
export const TOUR_SIGUNGU_CODE_MAP = {
    ...TOUR_DEF_PARAME_MAP,
    sidoCode: 'lDongRegnCd', // 시도 코드
    sigunguCode: 'lDongSignguCd', // 시군구 코드
    sort: 'arrange', // 정렬 구분 (A=제목순, C=수정일순, D=생성일순), 대표 이미지가 반드시 있는 정렬 (O=제목순, Q=수정일순, R=생성일순)
    contentType: 'contentTypeId', // 관광지 유형 ID (한국어 12: 다국어: 76)
    modifyDt: 'mdfcnDt',
    themaCd: 'wellnessThemaCd' // 웰니스 테마 코드 (EX050100: 온천 / 사우나 / 스파, EX050200: 찜질방, EX050300: 한방 체험, EX050400: 힐링 명상, EX050500: 뷰티 스파, EX050600: 기타 웰니스, EX050700: 자연 치유)
};

export const TOUR_REGION_DB_TO_CLIENT_MAP = {
    testCode: 'sidoCode'
}

/** 쿼리 키 맵핑 (mapping 키를 mapping value로 변경) */
export const mapTourParams = async (params, mapping) => {
    const mappedParams = {};
    for (const [key, value] of Object.entries(params)) {
        // key testCode -> value sidoCode
        // mapping { testCode: 'sidoCode' }
        const mappedKey = mapping[key] || key;
        // mapppedKey sidoCode -> value 
        mappedParams[mappedKey] = value; // { sidoCode: value }
    }
    return mappedParams;
}
/* export function mapTourParams(params, mapping) {
    const mappedParams = {};
    for (const [key, value] of Object.entries(params)) {
        // key testCode -> value sidoCode
        // mapping { testCode: 'sidoCode' }
        const mappedKey = mapping[key] || key;
        // mapppedKey sidoCode -> value 
        mappedParams[mappedKey] = value; // { sidoCode: value }
    }
    return mappedParams;
} */

/** 쿼리 맵핑 (Client Query -> DB Query 전황 맵핑) */
export default {
    TOUR_IDONG_CODE_MAP,
    TOUR_SIGUNGU_CODE_MAP,
    mapTourParams
};