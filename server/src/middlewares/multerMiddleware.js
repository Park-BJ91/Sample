import multer from 'multer';
import fs from 'fs'; // 파일 시스템 모듈

/* 프로필 이미지 업로드 설정 */
const profilesStorage = multer.diskStorage({
    destination: (req, file, cb) => { // 업로드 디렉토리 설정
        const uploadPath = 'uploads/profiles';
        // 업로드 디렉토리가 없으면 생성
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => { // 파일 이름 설정
        const uniqueSuffix = Date.now() + '-' + file.originalname; // 고유한 접미사 생성
        cb(null, uniqueSuffix); // 고유한 파일 이름 생성
    }
});

/* 게시판 파일 업로드 설정 */
const boardStorage = multer.diskStorage({
    destination: (req, file, cb) => { // 업로드 디렉토리 설정
        const boardId = req.body.boardId;
        const uploadPath = `uploads/boards_${boardId}`;
        // 업로드 디렉토리가 없으면 생성
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => { // 파일 이름 설정
        const uniqueSuffix = Date.now() + '-' + file.originalname; // 고유한 접미사 생성
        cb(null, uniqueSuffix); // 고유한 파일 이름 생성
    }
});

/** 프로필 이미지 업로드 미들웨어 */
export const uploadProfile = multer({ storage: profilesStorage });
/** 게시판 파일 업로드 미들웨어 */
export const uploadBoardFiles = multer({ storage: boardStorage });

