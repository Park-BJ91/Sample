import oracledb from 'oracledb';


export async function connectOracleDB() {
    try {
        const conn = oracledb.createPool({
            user: process.env.ORACLEDB_USER,
            password: process.env.ORACLEDB_PASSWORD,
            connectString: process.env.ORACLEDB_CONNECT_STRING, // 예: 'localhost/XE'
            poolMin: 0,
            poolMax: 10,
            poolIncrement: 0,
            acquireTimeout: process.env.ORACLEDB_ACQUIRE_TIMEOUT ? parseInt(process.env.ORACLEDB_ACQUIRE_TIMEOUT) : 30,
            idleTimeout: process.env.ORACLEDB_IDLE_TIMEOUT ? parseInt(process.env.ORACLEDB_IDLE_TIMEOUT) : 10
        });
        console.log('연결 성공: OracleDB');
        return conn;
    } catch (error) {
        console.error('데이터베이스에 연결할 수 없습니다 OracleDB: ', error);
    }
}