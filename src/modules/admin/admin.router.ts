import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", adminController.getAllUsers);
router.get("/users/:id/status", adminController.updateUserStatus);
router.get("/tutor/:id/approved", adminController.approvedTutor);
router.get("/categories", adminController.createCategory);

export const adminRouter = router;
