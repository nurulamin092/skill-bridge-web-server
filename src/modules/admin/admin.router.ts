import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", adminController.getAllUsers);
router.get("/users/:id/status", adminController.updateUserStatus);

export const adminRouter = router;
