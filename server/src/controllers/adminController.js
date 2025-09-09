import jwt from 'jsonwebtoken';
import { findUserByUsername, userFindAll, createUser } from '../models/User.js';
import bcrypt from 'bcrypt';




export async function join(req, res) {
    const { reqId, pwd } = req.body;

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(pwd, 10);

    try {
        const existingUser = await findUserByUsername({ where: { username: reqId } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        await createUser(reqId, hashedPassword);

        return res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error("회원가입 오류: ", error);
        return res.status(500).json({ message: 'Error registering user' });
    }
}



// export async function login(req, res) {
//     const { reqId, pwd } = req.body;
//     // 실제로는 DB에서 사용자 확인

//     const user = (await findUserByUsername({ where: { username: reqId } })).dataValues;

//     if (user && await bcrypt.compare(pwd, user.password)) {
//         // 토큰 생성
//         const userPayload = { id: user.id, role: user.role };
//         const token = jwt.sign(
//             userPayload, // 토큰에 담을 정보
//             process.env.JWT_SECRET, // .env 파일에 비밀 키 저장
//             { expiresIn: '1M' } // 토큰 시간
//         );
//         return res.json({ token });
//     }

//     return res.status(401).json({ message: 'Invalid credentials' });
// };


// export const naverCallback = (req, res) => {
//     // Successful authentication, redirect home.
//     res.redirect(`http://localhost:3000?token=${req.user.token}`);
// };



export const findAll = async (req, res) => {
    try {
        const users = await userFindAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

export const logout = (req, res) => {
    // 클라이언트에서 토큰 삭제
    res.json({ message: 'Logged out' });
}

export const getProfile = (req, res) => {
    res.json({ user: req.user });
};

