import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// DB, (SNS OR Local)제공 등에서 사용자 정보를 받아 JWT 생성 변경
export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role }, //payload 
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // 기본값 1시간 (테스트 3분)
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};
