// import express, { json } from "express";
import express, { json } from "express";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import './passport/naverStrategy.js'; // 네이버 인증 전략을 불러옴
import './passport/localStrategy.js'; // 로컬 인증 전략을 불러옴
import passport from "passport";
import cors from "cors";
import ProductRoutes from "./routes/productRoutes.js";
import UserRoutes from "./routes/userRoutes.js";
import AuthRoutes from "./routes/authRoutes.js";
import TourRoutes from "./routes/tourRoutes.js";

import { startUpdateRegionsCron } from './cron/updateJon.js';


dotenv.config();
const app = express()
const PORT = process.env.PORT || 8080;
const USER_PATH = process.env.USER_PATH || '/api/user';
const AUTH_PATH = process.env.AUTH_PATH || '/api/auth';
const PRODUCT_PATH = process.env.PRODUCT_PATH || '/api/product';
const TOUR_PATH = process.env.TOUR_PATH || '/api/tour';

// 지역 정보 업데이트 스케줄러
startUpdateRegionsCron();

app.use(cookieParser());
app.use(json());
app.use(cors());
app.use(passport.initialize()); // passport 초기화 미들웨어

// app.use('/uploads', express.static('uploads')); // uploads 폴더를 정적 파일로 제공
app.use(AUTH_PATH, AuthRoutes);
app.use(PRODUCT_PATH, ProductRoutes);
app.use(USER_PATH, UserRoutes);
app.use(TOUR_PATH, TourRoutes);



// TEST SERVER 
/*
 testApp.listen(testApp.get('port'), () => {
    console.log(`Server Running on http://localhost:${testApp.get('port')}`);
});
 */

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});


