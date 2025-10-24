import { BoardImage, Board } from '../models/Board.js';
// import mariadbSequelize from '../config/mariadb.js';
import db from '../config/index.js';
import fs from 'fs';
import path from 'path';
import { raw } from 'express';


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



        const postsAllCount = await db.query(
            `SELECT COUNT(*) AS totalCount FROM board;`,
            { type: db.Sequelize.QueryTypes.SELECT }
        );


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

/** 게시판 포스트 상세 조회 서비스 */
export const getBoardPostByIdService = async (postId, userId) => {
    const t = await db.transaction();
    try {
        const [post] = await db.query(
            `SELECT
                b.bno,
                b.title,
                b.content,
                b.createdAt,
                u.nickName,
                CASE WHEN b.userId = ${userId}
                    THEN 'Y'
                    ELSE 'N'
                END AS isAuthor
             FROM board b
             LEFT JOIN tour_users u ON b.userId = u.id
             WHERE b.bno = ${postId};`,
            {
                type: db.Sequelize.QueryTypes.SELECT,
                transaction: t,
                raw: true
            }
        );

        await t.commit();
        return post;
    } catch (error) {
        await t.rollback();
        console.error('게시판 포스트 상세 조회 에러:', error);
        throw error;
    }
};

/** 게시물 상세 이미지 조회 서비스 */
export const getBoardPostByIdImagesService = async (postId, userId) => {
    const t = await db.transaction();
    try {
        const images = await BoardImage.findAll({
            attributes: ['id', 'url'],
            where: {
                boardId: postId,
                userId: userId,
                status: 'confirmed'
            },
            transaction: t,
            raw: true
        });
        await t.commit();
        return images;
    } catch (error) {
        await t.rollback();
        console.error('게시물 상세 이미지 조회 에러:', error);
        throw error;
    }
};


/** 게시판 포스트 생성 서비스 */
export const createBoardPostService = async (userId, postData) => {
    const t = await db.transaction();
    const movedFiles = []; // ✅ 이동된 파일들을 추적하기 위한 배열

    const imageUrlChange = postData.content.replaceAll('/temp/', '/permanent/');
    console.log("변경된 이미지 URL들:", imageUrlChange);


    try {
        const newPost = await Board.create({
            userId: userId,
            title: postData.title || 'Untitled',
            content: imageUrlChange
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

/** 게시판 포스트 수정 서비스 */
export const updateBoardPostService = async (userId, postId, postData) => {
    const t = await db.transaction();

    const movedFiles = []; // ✅ 이동된 파일들을 추적하기 위한 배열

    console.log("############ 서비스 레이어 postId:", postId);

    const imageUrlChange = postData.content.replaceAll('/temp/', '/permanent/');
    console.log("변경된 이미지 URL들:", imageUrlChange);

    console.log("############ 서비스 레이어 postData:", postData);

    try {
        // 게시물 업데이트
        // const [updateCount, updatedPosts] = await Board.update(
        const updatedPosts = await Board.update(
            {
                title: postData.title,
                content: imageUrlChange,
                updatedAt: db.Sequelize.literal('CURRENT_TIMESTAMP')
            },
            {
                where: { bno: postId, userId: userId },
                transaction: t,
                silent: true, // updatedAt 수동 업데이트 허용
            }
        );



        for (const img of postData.images) {
            console.log("이미지 정보:", img);
            // 이미지가 임시 상태라면 게시물에 연결
            if (img && img.id) {
                const boardImage = await BoardImage.findOne({ where: { id: img.id, userId: userId, status: 'temp' }, transaction: t });
                console.log("찾은 BoardImage:", boardImage);
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
                        boardId: postId,
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


        await t.commit();
        return updatedPosts[0]; // 업데이트된 게시물 반환
    } catch (error) {
        await t.rollback();
        console.error('게시판 포스트 수정 에러:', error);
        throw error;
    }
};

/** 게시판 포스트 삭제 서비스 */
export const deleteBoardPostService = async (userId, bno) => {
    const t = await db.transaction();
    try {
        // 게시물 삭제
        const deleteCount = await Board.destroy({
            where: { bno: bno, userId: userId },
            transaction: t
        });

        const imageCount = await BoardImage.count({
            where: { boardId: bno, userId: userId },
            transaction: t
        });

        if (imageCount > 0) {
            console.log(`게시물 ${bno}에 연결된 이미지 ${imageCount}개 삭제 중...`);
            const deletedImages = await BoardImage.destroy({
                where: { boardId: bno, userId: userId },
                transaction: t
            });
        }


        await t.commit();
        return deleteCount; // 삭제된 행의 수 반환
    } catch (error) {
        await t.rollback();
        console.error('게시판 포스트 삭제 에러:', error);
        throw error;
    }
};

/** 사용자 작성 게시물 목록 조회 서비스 */
export const getUserBoardPostsService = async (userId) => {

    console.log("############## 서비스 레이어 userId:", userId);

    const t = await db.transaction();
    try {
        const posts = await db.query(
            `SELECT
                b.bno,
                b.title,
                b.createdAt
            FROM
                Board b
            WHERE
                b.userId = ${userId}
            ORDER BY
                b.createdAt DESC
        `, {
            replacements: [userId], // SQL 인젝션 방지를 위한 치환 값
            type: db.Sequelize.QueryTypes.SELECT,
            transaction: t
        });

        await t.commit();
        return posts;
    } catch (error) {
        await t.rollback();
        console.error('사용자 작성 게시물 목록 조회 에러:', error);
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
    getBoardPostByIdService,
    createBoardPostService,
    getBoardPostsService,
    updateBoardPostService,
    deleteBoardPostService,
    getBoardPostByIdImagesService,
    getUserBoardPostsService,
};

