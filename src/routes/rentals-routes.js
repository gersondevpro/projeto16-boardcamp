import { Router } from "express";
import { create, render, exclude } from "../controllers/rentals-controllers.js";

const router = Router();

router.post('/rentals', create);
router.get('/rentals', render);
router.get('/rentals/:id', exclude);

export default router;