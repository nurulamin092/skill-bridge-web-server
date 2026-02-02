import { Router } from "express";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", reviewController.createBooking);

export const reviewRouter = router;
