import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import { adminLogin } from '../controllers/loginController';

export const router = Router();


export default router