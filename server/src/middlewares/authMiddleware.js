import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_RESULT } from '../constants/authResult.js';
import { setCookie } from '../utils/cookie.js';
import passport from 'passport';


export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ result: AUTH_TOKEN_RESULT.TOKEN_NOT_FOUND, message: '토큰 없음' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // 토큰 검증
            if (err) res.status(403).json({ result: AUTH_TOKEN_RESULT.TOKEN_INVALID, message: '토큰 유효하지 않음' });
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(401).json({ result: AUTH_TOKEN_RESULT.TOKEN_INVALID, message: 'Invalid token' });
    }
};

// 토큰 검증 미들웨어 (토큰만 검증, 이후 로직 없음)
export const verifyTokenOnly = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token || token == 'null') {
        return res.status(401).json({ result: AUTH_TOKEN_RESULT.TOKEN_NOT_FOUND, message: '토큰 없음' });
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => { // 토큰 검증
            if (err) return res.status(403).json({ result: AUTH_TOKEN_RESULT.TOKEN_INVALID, message: '토큰 유효하지 않음' });
            next();
        });
    }
}

// 쿠키 검사
export const verifyCookieToken = (req, res, next) => {
    const token = req.cookies.token; // 쿠키에서 토큰 추출

    console.log("########## verifyCookieToken :: ", token);

    if (!token) {
        return res.status(401).json({ result: AUTH_TOKEN_RESULT.TOKEN_NOT_FOUND, message: '토큰 없음' });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // 토큰 검증
            if (err) return res.status(403).json({ result: AUTH_TOKEN_RESULT.TOKEN_INVALID, message: '토큰 유효하지 않음' });
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(401).json({ result: AUTH_TOKEN_RESULT.TOKEN_INVALID, message: 'Invalid token' });
    }
};

// 로컬 로그인
export const localAuth = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => { // 콜백 함수
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ result: AUTH_TOKEN_RESULT.TOKEN_INVALID, message: info.message });
        }
        req.user = user;
        next();
    })(req, res, next);
};

// 네이버 로그인
export const naverAuthCallback = (req, res, next) => {
    passport.authenticate('naver', { session: false, failureRedirect: '/fail/login' }, (err, user, info) => {
        if (err || !user) {
            return next(err);
        }
        req.user = user;
        setCookie(res, user.token); // 쿠키 설정
        next();
    })(req, res, next);
};  