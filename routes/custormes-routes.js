import { Router } from "express";
import { createClient, readClients, readOneClient, updateClient } from "../controllers/customers-controllers.js";

const router = Router();

router.post('/customers', createClient);
router.get('/customers', readClients);
router.get('/customers/:id', readOneClient);
router.put('/customers/:id', updateClient);

export default router;