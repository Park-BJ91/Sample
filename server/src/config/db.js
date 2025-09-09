import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();    // .env 파일의 환경변수를 process.env에 넣어줌


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

export default sequelize;

// const pool = createPool({
//     host: 'localhost:192.168.0.66',      // DB 호스트
//     user: 'root',  // DB 사용자명
//     password: '1111', // DB 비밀번호
//     database: 'erp', // DB 이름
//     connectionLimit: 2      // 커넥션 풀 제한
// });

// export default {
//     getConnection: () => pool.getConnection(),
//     pool
// };