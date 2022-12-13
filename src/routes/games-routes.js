import { Router } from "express";
import { create, render } from "../controllers/games-conttrollers.js"

const router = Router();

router.post('/games', create);
router.get('/games', render);

export default router;