import { Router } from "express";
import { tutorProfileController } from "./tutor-profile.controller";

const router = Router();

router.post("/", tutorProfileController.createTutorProfile);
router.get("/me", tutorProfileController.getMyTutorProfile);
router.put("/", tutorProfileController.updateTutorProfile);

export const tutorProfileRouter = router;
