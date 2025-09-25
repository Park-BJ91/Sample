import { Router } from 'express';
import userController from '../controllers/userController.js';
import { checkRole } from '../middlewares/roleMiddleware.js';
import { signup } from '../controllers/userController.js';
import { uploadProfile } from '../middlewares/multerMiddleware.js';


const router = Router();

router.post('/signup', uploadProfile.single('profileImage'), signup);

router.get('/users', checkRole('admin'), userController.userFindAll);
router.get('/verifyId', userController.verifyId);



export default router;