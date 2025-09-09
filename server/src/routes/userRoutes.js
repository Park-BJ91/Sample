import { Router } from 'express';
import { findAll, join } from '../controllers/adminController.js';
import { checkRole } from '../middlewares/roleMiddleware.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import passport from 'passport';
import dotenv from 'dotenv';


dotenv.config();

const PATH = process.env.SERVER_DEF_PATH;
const router = Router();

router.post(`${PATH}/local/login`, passport.authenticate(
    'local', // strategy name
    { // options
        session: false,
        // failureRedirect: '/pass' // 로그인 실패 시 리디렉션할 URL API 응답을 원하면 이 부분 제거
        // successRedirect: '/pass' // 로그인 성공 시 리디렉션할 URL API 응답을 원하면 이 부분 제거
        failureMessage: true,
    }),
    (req, res) => { // 콜백 컨트롤러
        // console.log('로컬 로그인 성공', req.user);
        const user = req.user;
        const token = req.authInfo.token;
        res.json({ user, token });
    },
    (error, req, res, next) => { // 에러 핸들러
        res.status(401).json({ message: error.response?.data?.message || '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
);

// router.post("/login", login);


router.post(`${PATH}/join`, join);

// SNS
router.get(`${PATH}/users`, verifyToken, checkRole('admin'), findAll);
router.get(`${PATH}/auth/naver`, passport.authenticate('naver')); // 네이버 인증 요청
router.get(`${PATH}/auth/naver/callback`,
    passport.authenticate('naver', { failureRedirect: '/login' }),
    (req, res) => { // 콜백 컨트롤러
        // Successful authentication, redirect home.
        console.log('네이버 로그인 성공', req.user);
        res.json({ message: 'Naver login successful', user: req.user });
    }
);

export default router;