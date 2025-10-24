import { Router } from 'express';

import { verifyCookieToken } from '../middlewares/authMiddleware.js';
import { addFavorite, getFavoritesByUserId, deleteFavorite, isFavoriteExists, getFavoriteId } from '../models/Favorite.js';

const router = Router();

// 즐겨찾기 추가
router.post('/add', verifyCookieToken, async (req, res) => {
    const userId = req.user.id; // 미들웨어에서 설정한 사용자 ID
    const { contentId, contentTypeId, title, addr, image } = req.body;
    console.log("즐겨찾기 추가 요청 데이터:", req.body);

    if (!contentId || !contentTypeId || !title) {
        return res.status(400).json({ state: 400, message: '필수 항목이 누락되었습니다.' });
    }

    try {
        // 즐겨찾기 중복 확인
        const existingFavorites = await isFavoriteExists(userId, contentId, contentTypeId);

        if (existingFavorites) {
            const favId = await getFavoriteId(userId, contentId);
            console.log("이미 즐겨찾기에 존재하는 항목입니다. 즐겨찾기 ID :: ", favId);
            const result = await deleteFavorite(userId, favId);
            return res.status(200).json(result);
        }

        // 즐겨찾기 추가 DB 저장
        const result = await addFavorite({ userId, contentId, contentTypeId, title, addr, imgUrl: image });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error adding favorite:", error);
        return res.status(500).json({ state: 500, message: '서버 오류로 인해 즐겨찾기 추가에 실패했습니다.' });
    }
});

/* 즐겨찾기 중복 여부 확인 */
router.get('/check', verifyCookieToken, async (req, res) => {
    const userId = req.user.id; // 미들웨어에서 설정한 사용자 ID
    const { contentId, contentTypeId } = req.query;
    console.log("즐겨찾기 중복 확인 요청 데이터:", req.query);

    if (!contentId || !contentTypeId) {
        return res.status(400).json({ state: 400, message: '필수 항목이 누락되었습니다.' });
    }
    try {
        const exists = await isFavoriteExists(userId, contentId, contentTypeId);
        return res.status(200).json({ exists });
    } catch (error) {
        console.error("Error checking favorite existence:", error);
        return res.status(500).json({ state: 500, message: '서버 오류로 인해 즐겨찾기 중복 확인에 실패했습니다.' });
    }
});

/* 즐겨찾기 목록 조회 */
router.get('/favorites', verifyCookieToken, async (req, res) => {
    const userId = req.user.id; // 미들웨어에서 설정한 사용자 ID
    try {
        const favorites = await getFavoritesByUserId(userId);
        return res.status(200).json(favorites);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return res.status(500).json({ state: 500, message: '서버 오류로 인해 즐겨찾기 조회에 실패했습니다.' });
    }
});


/* 즐겨찾기 삭제 */
router.delete('/favorites/:favId', verifyCookieToken, async (req, res) => {
    const userId = req.user.id;
    const favId = req.params.favId;

    console.log("즐겨찾기 삭제 요청 ID :: ", favId);
    console.log("즐겨찾기 삭제 요청 사용자 ID :: ", userId);

    try {
        const result = await deleteFavorite(userId, favId);
        if (result.isFavorite === null) {
            return res.status(404).json({ state: 404, message: '즐겨찾기를 찾을 수 없습니다.' });
        }
        // return res.status(200).json({ state: 200, message: '즐겨찾기가 삭제되었습니다.' });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting favorite:", error);
        return res.status(500).json({ state: 500, message: '서버 오류로 인해 즐겨찾기 삭제에 실패했습니다.' });
    }
});

export default router;