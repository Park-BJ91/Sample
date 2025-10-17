import { Router } from 'express';
import dotenv from 'dotenv';

import boardController from '../controllers/boardController.js';

import { verifyCookieToken } from '../middlewares/authMiddleware.js';
import { uploadBoardFiles } from '../middlewares/multerMiddleware.js';

dotenv.config();

const router = Router();


// 게시판 메인 페이지 라우트
router.get('/main', boardController.getBoardPosts);

// 게시물 생성 라우트
router.post('/posts', verifyCookieToken, boardController.createBoardPost);


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




export default router;