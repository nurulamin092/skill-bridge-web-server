import { Router } from "express";
import { studentProfileController } from "./student-profile.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router = Router();
router.use(auth(UserRole.STUDENT));

router.get("/profile", studentProfileController.getStudentProfile);
router.put("/profile", studentProfileController.updateStudentProfile);
router.get("/dashboard", studentProfileController.getStudentDashboard);

export const studentProfileRouter = router;
