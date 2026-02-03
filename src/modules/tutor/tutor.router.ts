import { Router } from "express";
import { tutorController } from "./tutor.controller";

const router = Router();

router.get("/", tutorController.getAllTutor);
router.get("/me/bookings", tutorController.getMySession);
router.patch("/bookings/:id/status", tutorController.updateSessionStatus);
router.get("/:id", tutorController.getSingleTutor);

export const tutorRouter: Router = router;
