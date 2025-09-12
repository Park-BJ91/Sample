import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();    // .env 파일의 환경변수를 process.env에 넣어줌


export const mariadbSequelize = new Sequelize( // MariaDB 연결 설정
    process.env.MARIADB_DB_NAME,
    process.env.MARIADB_USER,
    process.env.MARIADB_PASSWORD,
    {
        host: process.env.MARIADB_HOST,
        dialect: process.env.MARIADB_DIALECT,
    }
);

export async function connectMariaDB() { // 서버 시작 시 DB 연결 확인용
    try {
        await mariadbSequelize.authenticate();
        console.log('연결 성공: MariaDB');
    } catch (error) {
        console.error('데이터베이스에 연결할 수 없습니다 MariaDB: ', error);
    }
}

export default mariadbSequelize;