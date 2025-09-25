import { Router } from "express";
import { getAllProducts, searchProducts } from "../controllers/productController.js";
import dotenv from 'dotenv';

dotenv.config();
const PATH = process.env.SERVER_DEF_PATH + process.env.PRODUCT_PATH;
const router = Router();

router.get(`${PATH}`, getAllProducts);
router.get(`${PATH}/search`, searchProducts);

export default router;

