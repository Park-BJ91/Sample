import { BoardImage } from '../models/Board.js';
import mariadbSequelize from '../config/mariadb.js';
import fs from 'fs';

/** 게시판 임시 이미지 업로드 서비스 */
export const boardTempImageUploadService = async (userId, file) => {
    if (!file) {
        throw new Error('No file uploaded');
    }

    const t = await mariadbSequelize.transaction();

    try {
        // 파일 URL 생성 (예: /uploads/temp/파일이름)
        const fileUrl = `/uploads/temp/${file.filename}`;
        const storedPath = file.path; // 실제 저장된 파일 경로


        // BoardImage 테이블에 임시 이미지로 저장
        const image = await BoardImage.create({
            boardId: null, // 임시 이미지이므로 boardId는 null
            userId: userId,
            originalName: file.originalname,
            storedPath: storedPath,
            url: fileUrl,
            status: 'temp' // 임시 이미지 상태
        });

        console.log('임시 이미지 디비 저장 완료 BoardImage:', image.id);

        await t.commit();
        return { id: image.id, url: fileUrl };

    } catch (error) {
        console.error('게시판 이미지 임시 저장 에러:', error);
        fs.unlinkSync(file.path); // 파일 삭제
        t.rollback();
        throw error;
    }

}

export default {
    boardTempImageUploadService
};

