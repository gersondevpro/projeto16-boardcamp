import { Router } from "express";
import { create, render } from "../controllers/categories-controllers.js"

const router = Router();

router.post('/categories', create);
router.get('/categories', render);

export default router;