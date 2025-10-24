import { Router } from 'express';
import dotenv from 'dotenv';

import boardController from '../controllers/boardController.js';

import { verifyCookieToken, verifyCookieNullAndProceed } from '../middlewares/authMiddleware.js';
import { uploadBoardFiles } from '../middlewares/multerMiddleware.js';

dotenv.config();

const router = Router();


// 게시판 메인 페이지 라우트
router.get('/main', boardController.getBoardPosts);
// 게시물 상세 조회 라우트
router.get('/posts/:bno', verifyCookieNullAndProceed, boardController.getBoardPostById);
// 게시물 상세 조회 - 이미지
router.get('/posts/:bno/images', verifyCookieNullAndProceed, boardController.getBoardPostByIdImages);
// 게시물 생성 라우트
router.post('/posts', verifyCookieToken, boardController.createBoardPost);

// 게시물 수정 라우트
router.put('/posts/:bno', verifyCookieToken, boardController.updateBoardPost);
// 게시물 삭제 라우트
router.delete('/posts/:bno', verifyCookieToken, boardController.deleteBoardPost);

// 사용자 작성 게시물 목록 조회 라우트
router.get('/posts/user/list', verifyCookieToken, boardController.getUserBoardPosts);



// 임시 이미지 업로드 및 삭제 라우트
router.post(
    '/temp-image',
    verifyCookieToken,
    uploadBoardFiles.single('image'),
    boardController.boardTempImageUpload
);
router.delete(
    '/temp-image',
    verifyCookieToken,
    boardController.boardTempImageDelete
);
router.delete(
    '/permanent-image',
    verifyCookieToken,
    boardController.boardPermanentImageDelete
);




export default router;