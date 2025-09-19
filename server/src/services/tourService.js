import { Op, QueryTypes } from 'sequelize';
import { Signgu, Sido } from '../models/Regions.js';
import TourApi from '../api/tourAPI.js';
import NaverMapApi from '../api/naverAPI.js';
import { mapTourParams, TOUR_REGION_CODE_MAP, TOUR_REGION_DB_TO_CLIENT_MAP } from '../mappers/tour/tourMapper.js';
import mariadbSequelize from '../config/mariadb.js';


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

    console.log("🚀 ~ tourDetailService ~ id, contentTypeId:", id, contentTypeId);
    // id와 contentTypeId를 사용하여 API에서 상세 정보 가져오기
    const detailCommon = await TourApi.tourDetailCommon(id);
    console.log("🚀 ~ tourDetailService ~ detailCommon:", detailCommon)

    const { mapX, mapY, ...rest } = detailCommon[0];
    const mapCoords = mapY && mapX ? [mapY, mapX].join(',') : null;

    const detailInfo = await TourApi.tourDetailInfo(id, contentTypeId);


    return { success: true, detailCommon: rest, detailInfo, coordinate: mapCoords };
};

export default {
    regionsSearchAllService,
    regionTourService,
    updateRegions,
    tourDetailService
};



