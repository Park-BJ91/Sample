import express from 'express';
import ProductRoutes from './src/routes/productRoutes.js';
import UserRoutes from './src/routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use(ProductRoutes);
app.use(UserRoutes);

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {}; // 개발 환경에서만 에러 노출
    res.status(err.status || 500);
    res.render('error');
});

export default app;