import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", adminController.getAllUsers);
router.get("/bookings", adminController.getAllBookings);
router.get("/categories", adminController.getAllCategories);
router.get("/stats", adminController.getDashboardStats);

router.patch("/users/:id/status", adminController.updateUserStatus);
router.patch("/tutor/:id/approved", adminController.approvedTutor);
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

export const adminRouter = router;
