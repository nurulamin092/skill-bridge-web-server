import { Router } from "express";
import { tutorProfileController } from "./tutor-profile.controller";

const router = Router();

router.post("/", tutorProfileController.createTutorProfile);
router.get("/me", tutorProfileController.getMyTutorProfile);

export const tutorProfileRouter = router;
