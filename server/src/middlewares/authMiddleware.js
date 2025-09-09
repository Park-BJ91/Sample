import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    console.log("#### authMiddleware - verifyToken");

    console.log("headers:", req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    console.log("token:" + token);

    if (!token) {
        return res.status(401).json({ message: '토큰 없음' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // 토큰 검증
            if (err) res.status(403).json({ message: '토큰 유효하지 않음' });
            console.log("user from token:", user);
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};