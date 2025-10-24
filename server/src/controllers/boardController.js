import BoardService from "../services/boardService.js";
import fs from 'fs/promises'; // 프로미스 기반 파일 시스템 모듈
import path from 'path';
import { boardImageDeleteDB } from "../models/Board.js";

import { verifyCookieToken } from '../middlewares/authMiddleware.js';


/* 게시물 목록 조회 */
export const getBoardPosts = async (req, res) => {
    const { page, limit } = req.query;

    const pageNum = parseInt(page, 10); // 십진수로 변환
    const limitNum = parseInt(limit, 10); // 십진수로 변환
    const offset = (pageNum - 1) * limitNum; // 페이지 번호에 따른 오프셋 계산
    console.log("pageNum:", pageNum, "limitNum:", limitNum, "offset:", offset);

    try {
        const posts = await BoardService.getBoardPostsService(limitNum, offset);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* 게시물 상세 조회 */
export const getBoardPostById = async (req, res) => {
    const { bno } = req.params;
    const userId = req.user ? req.user.id : null; // 인증된 사용자의 ID 또는 null
    try {
        const post = await BoardService.getBoardPostByIdService(bno, userId);
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* 게시물 상세 이미지 조회 */
export const getBoardPostByIdImages = async (req, res) => {
    const { bno } = req.params;
    const userId = req.user ? req.user.id : null;
    try {
        const images = await BoardService.getBoardPostByIdImagesService(bno, userId);
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* 게시물 생성 */
export const createBoardPost = async (req, res) => {
    const userId = req.user.id;
    const { title, content, images } = req.body;

    try {
        const newPost = await BoardService.createBoardPostService(userId, { title, content, images });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/* 임시 이미지 업로드 */
export const boardTempImageUpload = async (req, res) => {
    const userId = req.user.id;
    const file = req.file;  // multer가 업로드한 파일을 req.file에 저장

    try {
        const result = await BoardService.boardTempImageUploadService(userId, file);
        console.log("임시 이미지 업로드 결과:", result);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/* 게시물 수정 */
export const updateBoardPost = async (req, res) => {
    const userId = req.user.id;
    const { bno } = req.params;
    const { title, content, images } = req.body;
    try {
        const updatedPost = await BoardService.updateBoardPostService(userId, bno, { title, content, images });
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/* 게시물 삭제 */
export const deleteBoardPost = async (req, res) => {
    const userId = req.user.id;
    const { bno } = req.params;
    try {
        await BoardService.deleteBoardPostService(userId, bno);
        res.status(200).json({ message: "게시물 삭제 성공" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


/* 사용자 작성 게시물 목록 조회 */
export const getUserBoardPosts = async (req, res) => {
    const userId = req.user.id;
    try {
        const posts = await BoardService.getUserBoardPostsService(userId);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/* 임시 이미지 삭제 */
export const boardTempImageDelete = async (req, res) => {
    const userId = req.user.id;
    const { info } = req.body;

    const relativePath = info.url;
    if (!relativePath || !relativePath.includes("/uploads/temp")) {
        res.status(400).json({ error: "유효하지 않은 이미지 경로" });
        return;
    } else {
        console.log("삭제할 이미지 경로:", relativePath);
        // '/uploads/temp/...'에서 'uploads/temp/...'로 변환 (슬래시 제거)
        console.log("relativePath:", relativePath);
        const normalizedPath = relativePath.replace(/^\/+/, ''); // \
        console.log("normalizedPath:", normalizedPath);
        // 서버의 실제 파일 경로로 변환
        const filePath = path.join(process.cwd(), normalizedPath);

        boardImageDeleteDB(userId, info);

        fs.unlink(filePath)
            .then(() => {
                console.log("이미지 삭제 성공:", info);
                res.status(200).json({ message: "이미지 삭제 성공" });
            })
            .catch((error) => {
                console.error("이미지 삭제 실패:", error);
                res.status(500).json({ error: "이미지 삭제 실패" });
            });
    }
};

/* 영구 이미지 삭제 */
export const boardPermanentImageDelete = async (req, res) => {
    const userId = req.user.id;
    const { info } = req.body;
    const relativePath = info.url;
    if (!relativePath || !relativePath.includes("/uploads/permanent")) {
        res.status(400).json({ error: "유효하지 않은 이미지 경로" });
        return;
    } else {
        console.log("삭제할 영구 이미지 경로:", relativePath);
        // '/uploads/permanent/...'에서 'uploads/permanent/...'로 변환 (슬래시 제거)
        console.log("relativePath:", relativePath);
        const normalizedPath = relativePath.replace(/^\/+/, ''); // \
        console.log("normalizedPath:", normalizedPath);
        // 서버의 실제 파일 경로로 변환
        const filePath = path.join(process.cwd(), normalizedPath);
        boardImageDeleteDB(userId, info);

        fs.unlink(filePath)
            .then(() => {
                console.log("영구 이미지 삭제 성공:", info);
                res.status(200).json({ message: "영구 이미지 삭제 성공" });
            })
            .catch((error) => {
                console.error("영구 이미지 삭제 실패:", error);
                res.status(500).json({ error: "영구 이미지 삭제 실패" });
            });
    }
};



export default {
    getBoardPosts,
    getBoardPostById,
    createBoardPost,
    boardTempImageUpload,
    boardTempImageDelete,
    getBoardPostByIdImages,
    boardPermanentImageDelete,
    deleteBoardPost,
    updateBoardPost,
    getUserBoardPosts,
}; 