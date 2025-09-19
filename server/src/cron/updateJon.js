import cron from 'node-cron';
import { updateRegions } from '../services/tourService.js';


export function startUpdateRegionsCron() {
    // 매일 자정(00:00)에 실행되는 크론잡 설정
    try {
        // schedule(크론표현식, 실행할 함수)
        // 크론표현식 () 초 분 시 일 월 요일
        cron.schedule('0 10 10 * * *', async () => {
            console.log("스케줄러 업데이트 실행");
            // await connectMariaDB() ; // DB 연결 확인
            await updateRegions();
        });
    } catch (error) {
        console.error("스케줄러 업데이트 실패:", error);
    }
}




