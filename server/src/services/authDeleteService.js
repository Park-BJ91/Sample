import axios from "axios";
import dotenv from 'dotenv';
import { mariadbSequelize } from '../config/mariadb.js'
import { AUTH_RESULT } from '../constants/authResult.js';
import { clearCookie } from "../utils/cookie.js";

dotenv.config();


export const localDeleteService = async (userId) => {
    try {
        // 여기에 로컬 사용자 삭제 로직을 구현
        console.log(`로컬 사용자 ${userId} 삭제 처리`);
        return { success: true, message: `로컬 사용자 ${userId}가 삭제되었습니다.` };
    } catch (error) {
        console.error('로컬 사용자 삭제 에러:', error);
        throw error;
    }
};

export async function naverDeleteService(naverToken, res) {
    try {
        console.log("네이버 삭제 서비스로직");

        const response = await axios.get(`https://nid.naver.com/oauth2.0/token`, {
            params: {
                grant_type: "delete",
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                access_token: naverToken,
                service_provider: "NAVER",
            }
        });
        console.log("#####Naver Delete Response :: ", response.data);

        if (response.data.result !== 'success') {
            console.log('네이버 삭제 실패:', response.data);
            return res.json({ result: AUTH_RESULT.FAILURE, message: '네이버 삭제 실패' });
        }
        clearCookie(res);
        console.log('네이버 삭제 성공:', response.data);
        return res.json({ result: AUTH_RESULT.SUCCESS, message: '네이버 삭제 성공' });

    } catch (error) {
        console.error('네이버 삭제 서비스 에러:', error);
        return res.json({ result: AUTH_RESULT.ERROR, message: '네이버 삭제 중 오류 발생' });
    }
};