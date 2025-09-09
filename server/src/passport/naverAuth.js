import passport from 'passport';
import { Strategy as NaverStrategy } from 'passport-naver-v2';
import dotenv from 'dotenv';


dotenv.config();
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_CALLBACK_URL = process.env.NAVER_CALLBACK_URL;

passport.use(new NaverStrategy({
    clientID: NAVER_CLIENT_ID,
    clientSecret: NAVER_CLIENT_SECRET,
    callbackURL: NAVER_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        // 여기서 사용자 정보를 데이터베이스에 저장하거나 필요한 처리를 수행
        // 예: User.findOrCreate({ naverId: profile.id }, (err, user) => done(err, user));
        const user = { id: profile.id, displayName: profile.name, token: accessToken };
        console.log("Naver Profile :: ", profile);
        console.log("Naver AccessToken :: ", accessToken);
        console.log("Naver RefreshToken :: ", refreshToken);
        console.log("Naver User :: ", user);

        return done(null, user);
    }));



// export const naverAuth = passport.authenticate('naver');
// export const naverAuthCallback = passport.authenticate('naver', {
//     failureRedirect: '/login'
// });