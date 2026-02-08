import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();
router.use(auth());
router.post("/", reviewController.createReview);

export const reviewRouter = router;
