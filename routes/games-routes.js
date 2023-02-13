import { Router } from "express";
import { create, read } from "../controllers/games-controllers.js";

const router = Router();

router.post('/games', create);
router.get('/games', read);

export default router;