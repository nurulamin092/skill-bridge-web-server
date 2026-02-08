import { Router } from "express";

import auth from "../../middleware/auth.middleware";
import { tutorProfileController } from "./tutor-profile.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.use(auth(Role.TUTOR));

router.post("/", tutorProfileController.createTutorProfile);
router.get("/me", tutorProfileController.getMyTutorProfile);
router.put("/", tutorProfileController.updateTutorProfile);

export const tutorProfileRouter = router;
