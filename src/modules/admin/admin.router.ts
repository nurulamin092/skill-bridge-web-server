import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", adminController.getAllUsers);
router.get("/bookings", adminController.getAllBookings);
router.patch("/users/:id/status", adminController.updateUserStatus);
router.patch("/tutor/:id/approved", adminController.approvedTutor);
router.post("/categories", adminController.createCategory);

export const adminRouter = router;
