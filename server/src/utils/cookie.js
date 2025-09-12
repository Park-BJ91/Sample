import dotenv from 'dotenv';
dotenv.config();

export const setCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true, // 클라이언트에서 자바스크립트로 접근 불가
        secure: false, // HTTPS에서만 전송
        sameSite: 'lax', // none: 크로스 사이트 쿠키 허용, lax: 일부 크로스 사이트 쿠키 허용, strict: 크로스 사이트 쿠키 차단
        maxAge: process.env.COOKIE_EXPIRES_IN || 180000 // 3분
    });
};

export const clearCookie = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
};