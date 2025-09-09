import request from 'supertest';
import app from '../../testApp.js';
import jwt from 'jsonwebtoken';
import sequelize from './../config/db.js';

describe('API 테스트', () => {
    let token;
    const testUser = { reqId: 'testuser', pwd: 'testpassword' };

    beforeAll(async () => { // 테스트 사용자 생성
        await sequelize.sync({ force: true }); // DB 초기화

        await request(app)
            .post('/register')
            .send(testUser);
        const res = await request(app)
            .post('/login')
            .send(testUser);
        token = res.body.token; // 로그인 후 토큰 저장
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('회원가입', async () => {
        const res = await request(app)
            .post('/register')
            .send({ reqId: 'xxxx', pwd: 'newpassword' })
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('User registered');
    });
    test('로그인', async () => {
        const res = await request(app)
            .post('/login')
            .send(testUser);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    test('모든 사용자 조회', async () => {
        // const dummyPayLoad = { 2: 13, role: 'admin' }; // 관리자 토큰 생성
        // token = jwt.sign(dummyPayLoad, process.env.JWT_SECRET, { expiresIn: '1h' });
        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    }, 2000);

});