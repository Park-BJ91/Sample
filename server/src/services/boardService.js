import { BoardImage, Board } from '../models/Board.js';
// import mariadbSequelize from '../config/mariadb.js';
import db from '../config/index.js';
import fs from 'fs';
import path from 'path';


/** 게시판 목록 페이징 만큼 */
export const getBoardPostsService = async (limit, offset) => {
    const t = await db.transaction();
    try {

        // 게시물과 작성자 정보, 이미지를 함께 조회
        const posts = await db.query(
            `SELECT
                b.bno,
                b.title,
                u.nickName,
                b.createdAt,
                CASE WHEN b.updatedAt IS NULL
                    THEN 'Y'
                    ELSE 'N'
                END                 AS         state,
                (SELECT bi.url
                 FROM board_images bi
                 WHERE bi.boardId = b.bno AND bi.status = 'confirmed' LIMIT 1) AS thumbnailUrl
             FROM board b
             LEFT JOIN tour_users u ON b.userId = u.id
             ORDER BY b.bno DESC
             LIMIT ${limit} OFFSET ${offset};`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );

        console.log("게시판 목록 조회 결과:", posts);


        const postsAllCount = await db.query(
            `SELECT COUNT(*) AS totalCount FROM board;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );

        console.log("게시판 전체 게시물 수:", postsAllCount[0].totalCount);

        await t.commit();

        return {
            posts: posts,
            totalCount: postsAllCount[0].totalCount
        };


    } catch (error) {
        await t.rollback();
        console.error('게시판 목록 조회 에러:', error);
        throw error;
    }
};


/** 게시판 포스트 생성 서비스 */
export const createBoardPostService = async (userId, postData) => {
    const t = await db.transaction();
    const movedFiles = []; // ✅ 이동된 파일들을 추적하기 위한 배열


    try {
        const newPost = await Board.create({
            userId: userId,
            title: postData.title || 'Untitled',
            content: postData.content
        }, { transaction: t });

        for (const img of postData.images) {
            console.log("이미지 정보:", img);
            // 이미지가 임시 상태라면 게시물에 연결
            if (img && img.id) {
                const boardImage = await BoardImage.findOne({ where: { id: img.id, userId: userId, status: 'temp' }, transaction: t });
                if (boardImage) {

                    // 파일 시스템에서 임시 폴더에서 영구 폴더로 이동
                    const tempPath = boardImage.storedPath; // 예: uploads/temp/파일이름
                    const fileName = path.basename(tempPath);
                    const permanentDir = path.dirname(tempPath).replace('\\temp', '\\permanent');
                    const permanentPath = path.join(permanentDir, fileName);

                    // 디렉토리 생성
                    if (!fs.existsSync(permanentDir)) {
                        console.log("영구 디렉토리 생성:", permanentDir);
                        fs.mkdirSync(permanentDir, { recursive: true });
                    }
                    // 파일 이동
                    fs.renameSync(tempPath, permanentPath);
                    console.log(`파일 이동: ${tempPath} -> ${permanentPath}`);

                    movedFiles.push(permanentPath); // 이동된 파일 경로 저장

                    // BoardImage 업데이트
                    await boardImage.update({
                        boardId: newPost.bno,
                        storedPath: permanentPath,
                        url: boardImage.url.replace('/temp/', '/permanent/'),
                        status: 'confirmed'
                    }, { transaction: t });
                    console.log("BoardImage 업데이트 완료:", boardImage.id);
                } else {
                    console.log("임시 이미지 디비에서 못 찾음:", img.id);
                }

            } else {
                console.log("유효하지 않은 이미지 정보:", img);
            }
        }

        console.log("게시물 생성 및 이미지 연결 완료:", newPost.bno);

        await t.commit();
        return newPost;
    } catch (error) {
        console.error('게시판 포스트 생성 에러:', error);
        await t.rollback();

        for (const filePath of movedFiles) {
            try {
                fs.unlinkSync(filePath); // 이동된 파일 삭제
            } catch (err) {
                console.error('파일 삭제 실패:', filePath, err);
            }
        }
        throw error;
    }
};

/** 게시판 임시 이미지 업로드 서비스 */
export const boardTempImageUploadService = async (userId, file) => {
    if (!file) {
        throw new Error('No file uploaded');
    }

    // const t = await mariadbSequelize.transaction();
    const t = await db.transaction();

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
    boardTempImageUploadService,
    createBoardPostService,
    getBoardPostsService,
};

