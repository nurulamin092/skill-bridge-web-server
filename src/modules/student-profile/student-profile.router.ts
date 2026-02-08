import { Router } from "express";
import { studentProfileController } from "./student-profile.controller";
import auth from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.use(auth(Role.STUDENT));

router.get("/profile", studentProfileController.getStudentProfile);
router.put("/profile", studentProfileController.updateStudentProfile);
router.get("/dashboard", studentProfileController.getStudentDashboard);

export const studentProfileRouter = router;
