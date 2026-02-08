import { Router } from "express";

import auth, { UserRole } from "../../middleware/auth.middleware";
import { tutorProfileController } from "./tutor-profile.controller";

const router = Router();

router.use(auth(UserRole.TUTOR));

router.post("/", tutorProfileController.createTutorProfile);
router.get("/me", tutorProfileController.getMyTutorProfile);
router.put("/", tutorProfileController.updateTutorProfile);

export const tutorProfileRouter = router;
