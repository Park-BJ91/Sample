import express from 'express';
import ProductRoutes from './src/routes/productRoutes.js';
import UserRoutes from './src/routes/userRoutes.js';
import AuthRoutes from './src/routes/authRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

// PRODUCT_PATH = process.env.PRODUCT_PATH || '/api/product';
// USER_PATH = process.env.USER_PATH || '/api/user';
// AUTH_PATH = process.env.AUTH_PATH || '/api/auth';


// const app = express();
// app.use(express.json());
// app.use(PRODUCT_PATH, ProductRoutes);
// app.use(USER_PATH, UserRoutes);
// app.use(AUTH_PATH, AuthRoutes);

// app.use((err, req, res, next) => {
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {}; // 개발 환경에서만 에러 노출
//     res.status(err.status || 500);
//     res.render('error');
// });

export default app;