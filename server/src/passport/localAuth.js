import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserByUsername, validatePassword } from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



passport.use(new LocalStrategy(
    { // 옵션
        usernameField: 'reqId',
        passwordField: 'pwd'
    },
    async (username, password, done) => { // 검증 콜백
        try {
            const data = await findUserByUsername(username);
            console.log("" + JSON.stringify(data));
            if (!data) {
                return done(null, false, { message: '존재하지 않는 사용자입니다.' });
            }

            const isValid = await validatePassword(password, data.password);
            console.log("isValid:" + isValid);
            if (!isValid) {
                return done(null, false, { message: '비밀번호가 올바르지 않습니다.' });
            }

            const token = jwt.sign(
                { id: data.id, role: data.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );


            const parseData = data.toJSON ? data.toJSON() : data;
            const { password: pwd, ...userWithoutPassword } = parseData; // 비밀번호 제외

            return done(null, { ...userWithoutPassword }, { token });
        } catch (error) {
            return done(error);
        }
    }
));

// passport.use(new LocalStrategy(
//     {
//         usernameField: 'reqId', // 클라이언트에서 보내는 아이디 필드명
//         passwordField: 'pwd'  // 클라이언트에서 보내는 비밀번호 필드명
//     },
//     async (username, password, done) => {
//         try {
//             const user = await findUserByUsername(username);
//             if (!user) {
//                 return done(null, false, { message: 'Incorrect username.' });
//             }
//             const isValid = await validatePassword(password, user.password);
//             if (!isValid) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }
//             const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//             return done(null, { user, token });
//         } catch (error) {
//             return done(error, false, { message: 'Internal server error.' });
//         }
//     }
// ));