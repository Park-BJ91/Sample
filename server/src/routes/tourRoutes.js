import { Router } from "express";
import tourController from "../controllers/tourController.js";

const router = Router();

router.get('/regions', tourController.regionsCodeAll);
router.get('/tour_', tourController.regionTour);
router.get('/detail/:id', tourController.tourDetail);


export default router;

