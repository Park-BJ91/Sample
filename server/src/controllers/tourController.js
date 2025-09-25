// import { regionsSearchAllService, regionFestivalService } from '../services/tourService.js';
import TourService from '../services/tourService.js';

const regionCodeCache = new Map(); // 지역 데이터 캐시
const tourCache = new Map(); // 관광 데이터 캐시
const tourDetailCache = new Map(); // 관광 상세 데이터 캐시
const CACHE_TTL = 60 * 60 * 1000;


export const regionsCodeAll = async (req, res) => {
    const CACHE_KEY = 'regions_code_all';

    // 캐시 구조: { data, expires }
    const cached = regionCodeCache.get(CACHE_KEY);
    if (cached && cached.expires > Date.now()) {
        console.log("캐시된 지역 데이터 사용");
        return res.json(cached.data);
    }

    const result = await TourService.regionsSearchAllService();
    regionCodeCache.set(CACHE_KEY, {
        data: result,
        expires: Date.now() + CACHE_TTL,
    });
    res.json(result);
};

export const regionTour = async (req, res) => {
    const CACHE_KEY = `tour_${JSON.stringify(req.query)}`;

    const cached = tourCache.get(CACHE_KEY);
    if (cached && cached.expires > Date.now()) {
        console.log("캐시된 관광 데이터 사용");
        return res.json(cached.data);
    }
    const query = req.query;
    const result = await TourService.regionTourService(query);
    tourCache.set(CACHE_KEY, {
        data: result,
        expires: Date.now() + CACHE_TTL,
    });
    res.json(result);
};

export const tourDetail = async (req, res) => {

    const { id } = req.params;
    const { contentTypeId } = req.query;

    const CACHE_KEY = `tour_detail_${id}_${contentTypeId}`;

    const cached = tourDetailCache.get(CACHE_KEY);
    if (cached && cached.expires > Date.now()) {
        console.log("캐시된 관광 상세 데이터 사용");
        return res.json(cached.data);
    }



    try {
        const result = await TourService.tourDetailService(id, contentTypeId);
        tourDetailCache.set(CACHE_KEY, {
            data: result,
            expires: Date.now() + CACHE_TTL,
        });
        return res.json(result);
    } catch (error) {
        console.error("Error fetching tour detail:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default {
    regionsCodeAll,
    regionTour,
    tourDetail,
};