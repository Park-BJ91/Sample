import { Router } from "express";
import { getAllProducts, searchProducts } from "../controllers/productController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import dotenv from 'dotenv';



dotenv.config();

const PATH = process.env.SERVER_DEF_PATH + process.env.PRODUCT_PATH;
const router = Router();

router.get(`${PATH}`, verifyToken, getAllProducts);
router.get(`${PATH}/search`, verifyToken, searchProducts);

export default router;

