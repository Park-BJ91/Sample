import BoardService from "../services/boardService.js";
import fs from 'fs/promises'; // 프로미스 기반 파일 시스템 모듈
import path from 'path';
import { boardTempImageDeleteDB } from "../models/Board.js";


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

/* 임시 이미지 삭제 */
export const boardTempImageDelete = async (req, res) => {
    const userId = req.user.id;
    const { info } = req.body;

    // info가 객체라면 .url, 문자열이면 그대로 사용
    const relativePath = typeof info === 'object' && info.url ? info.url : info;
    // '/uploads/temp/...'에서 'uploads/temp/...'로 변환 (슬래시 제거)
    console.log("relativePath:", relativePath);
    const normalizedPath = relativePath.replace(/^\/+/, ''); // \
    console.log("normalizedPath:", normalizedPath);
    // 서버의 실제 파일 경로로 변환
    const filePath = path.join(process.cwd(), normalizedPath);

    boardTempImageDeleteDB(userId, info);

    fs.unlink(filePath)
        .then(() => {
            console.log("이미지 삭제 성공:", info);
            res.status(200).json({ message: "이미지 삭제 성공" });
        })
        .catch((error) => {
            console.error("이미지 삭제 실패:", error);
            res.status(500).json({ error: "이미지 삭제 실패" });
        });

};


export default {
    getBoardPosts,
    createBoardPost,
    boardTempImageUpload,
    boardTempImageDelete,
}; 