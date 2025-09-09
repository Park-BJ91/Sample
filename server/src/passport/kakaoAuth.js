import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { userFindOrCreate } from '../models/User.js';

passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: process.env.KAKAO_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Find or create user in your database
            const user = await userFindOrCreate(profile.id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));