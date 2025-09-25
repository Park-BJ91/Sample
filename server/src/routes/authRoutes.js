import { Router } from 'express';
import { localAuth, naverAuthCallback, verifyCookieToken } from '../middlewares/authMiddleware.js'; // 토큰 검증 미들웨어
import { AUTH_TOKEN_RESULT } from '../constants/authResult.js'; // 토큰 결과 상수
import { setCookie, clearCookie } from '../utils/cookie.js';
import { naverDeleteService } from '../services/authDeleteService.js';
import AuthController from '../controllers/authController.js';
import passport from 'passport';


import dotenv from 'dotenv';
dotenv.config();
const CLIENT_PATH = process.env.CLIENT_URL || 'http://localhost:3000';

const router = Router();

// 명칭 변경해야함 
router.get('/verifyCookie', verifyCookieToken, (req, res) => {
    res.json({ result: AUTH_TOKEN_RESULT.TOKEN_SUCCESS, message: '토큰인증 성공' });
});


// Local 로그인 라우트
router.post('/local/login', localAuth, AuthController.localLogin);
router.get('/fail/login', (req, res) => {
    console.log('로그인 실패 ################################');
    res.redirect(`${CLIENT_PATH}/login/fail?error=fail`);
});

router.get('/logout', (req, res) => {
    clearCookie(res);
    console.log("####################  Logout Clear Cookie....!!!! ");
    res.json({ result: 'SUCCESS', message: '로그아웃 성공' });
});


// SNS 로그인 라우트

// 네이버 로그인
router.get('/naver', passport.authenticate('naver', { session: false }));
// router.get('/naver/callback', naverAuthCallback, AuthController.naverLoginCallback);


router.get('/naver/callback', (req, res) => {
    passport.authenticate('naver', { session: false, failureRedirect: '/fail/login' }, (err, user, info) => {
        if (err || !user) {
            return next(err);
        }
        req.user = user;
        setCookie(res, user.token); // 쿠키 설정
        res.redirect(`${CLIENT_PATH}/login/success?result=success`);
    })(req, res);
});


// 로그아웃
router.get('/logout', (req, res, next) => {
    passport.authenticate('naver', { session: false },
        (err, user, info) => {
            clearCookie(res);
            console.log("####################  Logout Clear Cookie....!!!! ");
            res.redirect(`${CLIENT_PATH}/login`);
        })
        (req, res, next);
});

// 네이버 탈퇴
router.get('/naver/delete', AuthController.naverDelete);

/* 
router.get('/naver/delete', (req, res) => {
    const naverToken = req.cookies.token;
    console.log("Naver Delete Token :: ", naverToken);

    naverDeleteService(naverToken, res)
    // .then(data => {
    //     clearCookie(res);
    //     console.log("#################### 네이버 체이닝  Delete Clear Cookie....!!!! ");
    //     res.json({ message: '네이버 체이닝 account deletion successful', data: data });
    // })
    // .catch(error => {
    //     console.error('네이버 체이닝 Error during Naver account deletion:', error);
    //     res.status(500).json({ message: '네이버 체이닝 account deletion failed', error: error.message });
    // });

});
 */

export default router;
