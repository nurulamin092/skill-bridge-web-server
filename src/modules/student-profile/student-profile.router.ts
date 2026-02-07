import { Router } from "express";
import { studentProfileController } from "./student-profile.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router = Router();
router.use(auth(UserRole.STUDENT));

router.post("/profile", studentProfileController.getStudentProfile);
router.put("/profile", studentProfileController.updateStudentProfile);
router.put("/dashboard", studentProfileController.getStudentDashboard);

export const studentProfileRouter = router;
