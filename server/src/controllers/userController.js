import bcrypt from 'bcrypt';
import { findUserByUsername, createUser, findUserAll } from '../models/User.js';
import fs from 'fs/promises'; // 프로미스 기반 파일 시스템 모듈

/** 회원가입 */
export async function signup(req, res) {
    const { id, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱

        const existingUser = await findUserByUsername(id);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const { password: _, ...rest } = req.body; // 비밀번호 제외한 나머지 필드
        const { nickname, email, phone, address, addressDetail, zonecode } = rest;
        const profileImage = req.file ? req.file.path : null; // 업로드된 파일 경로

        const createdUser = {
            userId: id,
            email,
            password: hashedPassword,
            nickName: nickname,
            profileImage,
            phone,
            addr: address,
            addressDetail,
            zonecode
        }

        await createUser(createdUser);

        return res.status(201).json({ message: 'User registered' });
    } catch (error) {
        await fs.unlink(req.file?.path || ''); // 업로드된 파일 삭제
        console.log("#### 파일 삭제 성공 ");

        console.error("회원가입 오류: ", error);
        return res.status(500).json({ message: 'Error registering user' });
    }
}

/** 로그아웃 */
export const logout = (req, res) => {
    // 클라이언트에서 토큰 삭제
    res.json({ message: 'Logged out' });
}

/** 사용자 전체 조회 */
export async function userFindAll(req, res) {
    console.log("findAll...");
    const users = await findUserAll();
    res.json(users);
}

/** 사용자 ID 검증 */
export async function verifyId(req, res) {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ result: 400, message: '사용자 ID는 필수입니다.' });
        // 400: Bad Request (잘못된 요청)
    }
    const existingUser = await findUserByUsername(userId);
    if (existingUser) {
        return res.status(409).json({ result: 409, message: '사용자 ID가 이미 사용 중입니다.' });
        // 409: Conflict (중복)
    }
    return res.status(200).json({ result: 200, message: '사용자 ID를 사용할 수 있습니다.' });
}


export default {
    signup,
    logout,
    userFindAll,
    verifyId,
};