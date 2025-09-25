import { generateToken } from '../utils/jwt.js';
import { setCookie, clearCookie } from '../utils/cookie.js';
import { AUTH_LOGIN_RESULT, AUTH_TOKEN_RESULT } from '../constants/authResult.js'; // 토큰 결과 상수
import { naverDeleteService } from '../services/authDeleteService.js';
import dotenv from 'dotenv';
dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';


export const localLogin = (req, res) => {
    // JWT 생성은 미들웨어에서 처리 했음
    setCookie(res, req.authInfo.token); // 쿠키 설정
    res.json({ result: AUTH_LOGIN_RESULT.SUCCESS, message: '로그인 성공' });
};

export const naverLoginCallback = (req, res) => {
    const naverToken = req.user.token;
    console.log("########## Naver Login Callback :: ", naverToken);
    res.redirect(`${CLIENT_URL}/login/success?result=success`);
};

export const naverDelete = (req, res) => {
    const naverToken = req.cookies.token;
    console.log("Naver Delete Token :: ", naverToken);
    naverDeleteService(naverToken, res);
};

export default {
    localLogin,
    naverLoginCallback,
    naverDelete
};