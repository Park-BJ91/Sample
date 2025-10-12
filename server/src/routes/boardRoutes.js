import { Router } from 'express';
import dotenv from 'dotenv';

import boardController from '../controllers/boardController.js';

import { verifyCookieToken } from '../middlewares/authMiddleware.js';
import { uploadBoardFiles } from '../middlewares/multerMiddleware.js';

dotenv.config();

const router = Router();
const BOARD_TEMP_IMAGE_PATH = process.env.BOARD_TEMP_IMAGE_PATH || '/path/to/temp/images';

router.post(
    '/temp-image',
    verifyCookieToken,
    uploadBoardFiles.single('image'),
    boardController.boardTempImageUpload
);




export default router;