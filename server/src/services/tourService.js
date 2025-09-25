import { Op, QueryTypes } from 'sequelize';
import { Signgu, Sido } from '../models/Regions.js';
import TourApi from '../api/tourAPI.js';
import weatherAPI from '../api/weatherAPI.js';
import { mapTourParams, TOUR_REGION_CODE_MAP } from '../mappers/tour/tourMapper.js';
import mariadbSequelize from '../config/mariadb.js';

import dfsXyConv from '../utils/dfs_xy_conv.js';
import baseDateTime from '../utils/baseDateTime.js';




export const regionsSearchAllService = async () => {
    console.log("서버 지역 전체 검색");

    const results = await mariadbSequelize.query(
        `SELECT s.sido_code, s.sido_name,
              JSON_ARRAYAGG(JSON_OBJECT('signguCode', g.signgu_code, 'signguName', g.signgu_name)) AS signguList
       FROM tour_sido s
       LEFT JOIN tour_signgu g ON g.sido_id = s.sido_id
       GROUP BY s.sido_id, s.sido_code, s.sido_name;`,
        {
            type: QueryTypes.SELECT, // ✅ meta 삭제 문제 방지
            raw: true                // ✅ plain object로 반환
        }
    );

    // 클라이언트가 원하는 형식으로 키 변환
    const formatted = results.map(sido => ({
        sidoCode: sido.sido_code,
        sidoName: sido.sido_name,
        signguList: sido.signguList
    }));

    return { success: true, list: formatted };
}

/** 검색 조건 내 관광 정보 */
export const regionTourService = async (query) => {
    const mappedParams = await mapTourParams(query, TOUR_REGION_CODE_MAP);
    const tourRes = await TourApi.regionTour(mappedParams);

    return { success: true, list: tourRes };
}


/** DB에 시도, 구군 정보 업데이트 */
export const updateRegions = async () => {
    const resRaw = await TourApi.citiesAll(); // 지역 정보 코드 요청

    const grouped = {};
    resRaw.forEach(item => {
        const { lDongRegnCd, lDongRegnNm, lDongSignguCd, lDongSignguNm } = item;
        if (!grouped[lDongRegnCd]) {
            grouped[lDongRegnCd] = {
                sidoCode: lDongRegnCd,
                sidoName: lDongRegnNm,
                signguList: []
            };
        }
        grouped[lDongRegnCd].signguList.push({
            signguCode: lDongSignguCd,
            signguName: lDongSignguNm
        });
    });

    console.log("Grouped Regions:", grouped); // grouped 객체 출력 { }

    await mariadbSequelize.transaction(async (t) => {
        // Sido Bulk Insert or Update
        const sidoRows = Object.values(grouped).map(sido => ({
            sido_code: sido.sidoCode,
            sido_name: sido.sidoName
        }));

        // bulkCreate + updateOnDuplicate → 없으면 INSERT, 있으면 UPDATE
        const sidoRecords = await Sido.bulkCreate(sidoRows, // bulkCreate(데이터 배열, 옵션)   
            {
                updateOnDuplicate: ["sido_name"], // 시도명이 바뀌면 업데이트
                transaction: t // 트랜잭션 객체 전달
            });

        // PK 값(sido_id) 확보 → Signgu FK에 사용
        const sidoMap = {};
        for (const sido of await Sido.findAll({ where: { sido_code: { [Op.in]: Object.keys(grouped) } }, transaction: t })) {
            sidoMap[sido.sido_code] = sido.sido_id;
        }

        // 4️⃣ Signgu Bulk Insert or Update
        const signguRows = [];
        for (const sidoCode in grouped) {
            const sido_id = sidoMap[sidoCode]; // PK 값 매핑 (Sido 테이블 sido_id)
            if (!sido_id) throw new Error(`sido_id not found for sido_code ${sidoCode}`);

            for (const signgu of grouped[sidoCode].signguList) {
                signguRows.push({
                    sido_id,
                    signgu_code: signgu.signguCode,
                    signgu_name: signgu.signguName
                });
            }
        }

        await Signgu.bulkCreate(signguRows, {
            updateOnDuplicate: ["signgu_name", "sido_id"], // 구군명이나 시도ID가 바뀌면 업데이트
            transaction: t
        });


    });

    /*     try {
            for (const sidoCode in grouped) { // in grouped => in {11:..., 26:...}
                console.log("sido_code:", sidoCode);
    
                const { sidoName, signguList } = grouped[sidoCode];
                const [sido, created] = await Sido.findOrCreate({ // Sido 테이블에 시도 추가 (없으면 생성, 있으면 조회)
                    where: { sido_code: sidoCode },
                    defaults: { sido_name: sidoName }
                });
    
                console.log(`Sido findOrCreate: ${sido.sido_code}, created: ${created}`); // created: true(생성), false(조회)
    
                if (!created) {
                    // 이미 존재하는 경우 이름 업데이트
                    await sido.update({ sido_name: sidoName }); // sido.save: 변경사항 저장 sido.update(): 기존 레코드 업데이트
                    console.log(`Sido updated: ${sido.sido_code}`);
                }
    
                console.log(" Sido upserted:", sido);
    
                if (!sido.sido_id) {
                    throw new Error(`@@@@@@@@@@@  시도 코드 아이디 not found for code: ${sidoCode}`);
                }
    
                for (const signgu of signguList) {
                    // Signgu 테이블에 구군 추가
                    const [signguRecord, created] = await Signgu.upsert({
                        sido_id: sido.sido_id,
                        signgu_code: signgu.signguCode,
                        signgu_name: signgu.signguName,
                    });
                    console.log(`Signgu upserted: ${signguRecord.signgu_code}, created: ${created}`); // created: true(생성), false(업데이트
                }
            }
            console.log("Regions 테이블 업데이트 완료");
        } catch (error) {
            console.error("Regions 테이블 업데이트 실패:", error);
        } */
}


export const tourDetailService = async (id, contentTypeId) => {

    // id와 contentTypeId를 사용하여 API에서 상세 정보 가져오기
    const detailCommon = await TourApi.tourDetailCommon(id);

    const { mapX, mapY, ...rest } = detailCommon[0];
    const mapCoords = mapY && mapX ? [mapY, mapX].join(',') : null; // naver map용 "위도,경도" 문자열

    // 위경도 → 기상청 격자 좌표 변환
    const { nx, ny } = await dfsXyConv("toXY", mapY, mapX); // v1: 위도, v2: 경도
    const { baseDate, baseTime } = await baseDateTime(1);

    /* weatherShortRest 사용자 로그인 즐겨찾기 등 상세 페이지에 사용으로 변경 예정 */
    /*     const weatherShortRest = {
            result: true,
            temp: null,
            humidity: null,
            precipitationType: null,
            windSpeed: null,
            rain1h: null,
        };
    
        const weatherParams = {
            base_date: baseDate, // '20231005', // baseDate, // '20231005', // YYYYMMDD
            base_time: baseTime, // '1400', // baseTime, // '1400', // HHMM
            nx, // 60, // 격자 X 좌표
            ny  // 127 // 격자 Y 좌표
        };
    
        const shortWeather = await weatherAPI.getUltraShortTermWeather(weatherParams);
        const shortWeatherResult = shortWeather ? shortWeather : { result: false };
    
        if (shortWeather) {
            shortWeatherResult.map(item => {
                if (item.category === "T1H") {
                    weatherShortRest.temp = (item.obsrValue + "°C").trim(); // 현재 기온
                } else if (item.category === "REH") {
                    weatherShortRest.humidity = (item.obsrValue + "%").trim(); // 습도
                } else if (item.category === "PTY") { // 강수 형태
                    weatherShortRest.precipitationType = item.obsrValue; // 0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기, 5: 빗방울, 6: 빗방울/눈날림, 7: 눈날림
                } else if (item.category === "WSD") {
                    weatherShortRest.windSpeed = (item.obsrValue + "m/s").trim(); // 풍속
                } else if (item.category === "RN1") {
                    weatherShortRest.rain1h = (item.obsrValue + "mm").trim(); // 1시간 강수량
                }
                return item;
            });
        } */

    // console.log("🚀 ~ tourDetailService ~ weatherRest:", weatherShortRest)

    // weatherShortRest END


    // weatherMidRest 중기예보는 상세페이지에서 사용 안함 (필요시 구현)
    const weatherRest = {
        result: false
    };

    const weatherParams = {
        base_date: baseDate, // '20231005', // baseDate, // '20231005', // YYYYMMDD
        base_time: baseTime, // '1400', // baseTime, // '1400', // HHMM
        nx, // 60, // 격자 X 좌표
        ny  // 127 // 격자 Y 좌표
    };

    let shortTermWeather = null;

    // 단기예보
    try {
        // shortTermWeather = await weatherAPI.getShortTermForecastWeather(weatherParams);
    } catch (error) {
        console.error("단기예보 조회 실패:", error);
    }

    const detailIntro = await TourApi.tourDetailIntro(id, contentTypeId);
    const detailResultIntro = detailIntro[0] ? detailIntro[0] : null;

    const detailInfo = await TourApi.tourDetailInfo(id, contentTypeId);
    const detailResultInfo = detailInfo ? detailInfo : null;


    // return { success: true, detailCommon: rest, detailInfo: detailResultInfo, coordinate: mapCoords, weather: weatherRest };
    return { success: true, detailCommon: rest, detailInfo: detailResultInfo, detailIntro: detailResultIntro, coordinate: mapCoords, weather: shortTermWeather };
};

export default {
    regionsSearchAllService,
    regionTourService,
    updateRegions,
    tourDetailService
};



