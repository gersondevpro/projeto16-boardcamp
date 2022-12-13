import { Router } from "express";
import { create, render, renderOne, update } from "../controllers/customers-controllers.js";

const router = Router();

router.post('/customers', create);
router.get('/customers', render);
router.get('/customers/:id', renderOne);
router.put('/customers/:id', update);

export default router;