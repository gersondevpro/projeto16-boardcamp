import { Router } from "express";
import { newRental, readRentals, endLocation, deleteRental } from "../controllers/rentals-controllers.js";

const router = Router();

router.post('/rentals', newRental);
router.get('/rentals', readRentals);
router.post('/rentals/:id/return', endLocation);
router.delete('/rentals/:id', deleteRental)

export default router;