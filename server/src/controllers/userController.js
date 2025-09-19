import bcrypt from 'bcrypt';
import { findUserByUsername, createUser, findUserAll } from '../models/User.js';

export async function join(req, res) {
    const { reqId, email, pwd } = req.body;
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(pwd, 10);

    try {
        const existingUser = await findUserByUsername(reqId);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        await createUser(reqId, email, hashedPassword);

        return res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error("회원가입 오류: ", error);
        return res.status(500).json({ message: 'Error registering user' });
    }
}
export const logout = (req, res) => {
    // 클라이언트에서 토큰 삭제
    res.json({ message: 'Logged out' });
}


export async function userFindAll(req, res) {
    console.log("findAll...");
    const users = await findUserAll();
    res.json(users);
}