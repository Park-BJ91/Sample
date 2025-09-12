// DB 통합 설정 파일

import dotenv from "dotenv";
import Sequelize from 'sequelize';
import oracledb from 'oracledb';

dotenv.config();

let db = null;

if (process.env.DB_TYPE === 'mariadb') {
    db = new Sequelize(
        process.env.MARIADB_DB_NAME,
        process.env.MARIADB_USER,
        process.env.MARIADB_PASSWORD,
        {
            host: process.env.MARIADB_HOST,
            dialect: process.env.MARIADB_DIALECT,
        });

    db.queryWrapper = (sql, options = {}) => { // raw 옵션을 기본값으로 true 설정
        return db.query(sql, options);
    }

    console.log('시큐얼라이즈 객체 생성: MariaDB');
} else if (process.env.DB_TYPE === 'oracledb') {
    db = {
        queryWrapper: (sql, params = []) => { // raw 옵션을 기본값으로 true 설정
            const conn = oracledb.getConnection({
                user: process.env.ORACLEDB_USER,
                password: process.env.ORACLEDB_PASSWORD,
                connectString: process.env.ORACLEDB_CONNECT_STRING, // 예: 'localhost/XE'
                poolMin: 0,
                poolMax: 10,
                poolIncrement: 0,
                acquireTimeout: process.env.ORACLEDB_ACQUIRE_TIMEOUT ? parseInt(process.env.ORACLEDB_ACQUIRE_TIMEOUT) : 30,
                idleTimeout: process.env.ORACLEDB_IDLE_TIMEOUT ? parseInt(process.env.ORACLEDB_IDLE_TIMEOUT) : 10
            });
            const result = conn.execute(sql, params);
            conn.close();
            return result.rows;
        }
    }
}

export default db;