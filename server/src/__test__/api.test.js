import request from 'supertest';
import app from '../../testApp.js';
import sequelize, { connectMariaDB } from '../config/mariadb.js';
import '../passport/localStrategy.js';

/* describe('API 테스트', () => {
    const testUser = { reqId: 'testuser', email: 'testuser@example.com', pwd: '1234' };
    beforeAll(async () => { // 테스트 사용자 생성
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({ force: true }); // DB 초기화
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        await request(app)
            .post('/api/auth/join')
            .send(testUser);
        // const res = await request(app)
        //     .post('/login')
        //     .send(testUser);
        // token = res.body.token; // 로그인 후 토큰 저장
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('회원가입', async () => {
        const res = await request(app)
            .post('/api/auth/join')
            .send({ reqId: 'xxxx', email: 'xxxx@example.com', pwd: '1111' })
        expect(res.statusCode).toEqual(201); // toEqual는 객체 비교
        expect(res.body.message).toBe('User registered'); // toBe는 원시값 비교
    });
}); */

describe('사용자 로그인 쿠기 테스트', () => {
    const testUser = { reqId: 'testuser', pwd: '1234' };

    it('로그인 쿠키 설정', async () => { // it은 test의 별칭
        const res = await request(app)
            .post('/api/auth/local/login')
            .send(testUser);
        expect(res.statusCode).toEqual(200);
        expect(res.headers['set-cookie']).toBeDefined(); // toBeDefined: 값이 정의되어 있는지 확인
    });


});