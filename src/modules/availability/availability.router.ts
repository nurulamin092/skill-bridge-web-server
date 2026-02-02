import { Router } from "express";
import { availabilityController } from "./availability.controller";

const router = Router();

router.post("/", availabilityController.createAvailability);
router.get("/me", availabilityController.getMyAvailability);

export const availabilityRouter = router;
