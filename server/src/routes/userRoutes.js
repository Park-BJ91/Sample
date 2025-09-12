import { Router } from 'express';
import { userFindAll } from '../controllers/userController.js';
import { checkRole } from '../middlewares/roleMiddleware.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();


router.get('/users', verifyToken, checkRole('admin'), userFindAll);


export default router;