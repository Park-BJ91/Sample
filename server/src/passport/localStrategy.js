import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserByUsername, validatePassword } from "../models/User.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



passport.use(new LocalStrategy(
    { // 옵션
        usernameField: 'reqId',
        passwordField: 'pwd',
    },
    async (username, password, done) => { // 검증 콜백
        try {
            const data = await findUserByUsername(username);
            if (!data) {
                return done(null, false, { message: '존재하지 않는 사용자입니다.' });
            }

            const isValid = await validatePassword(password, data.password);
            console.log("isValid:" + isValid);
            if (!isValid) {
                return done(null, false, { message: '비밀번호가 올바르지 않습니다.' });
            }
            console.log("!!!!!!!!! LocalStrategy Passport Success:");
            const token = jwt.sign( // JWT 생성
                { id: data.id, role: data.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );


            const parseData = data.toJSON ? data.toJSON() : data;   // 데이터가 Sequelize 객체인 경우 JSON으로 변환
            const { password: pwd, ...userWithoutPassword } = parseData; // 비밀번호 제외

            return done(null, { ...userWithoutPassword }, { token });  // 인자값 1: error, 2: user, 3: info 
        } catch (error) {
            console.log("LocalStrategy Error:" + error);
            return done(error);
        }
    }
));