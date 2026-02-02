import { Router } from "express";
import { tutorController } from "./tutor.controller";

const router = Router();

router.get("/", tutorController.getAllTutor);
router.get("/me/bookings", tutorController.getMySession);
router.get("/:id", tutorController.getSingleTuTor);
router.patch("/bookings/:id/status", tutorController.updateSessionStatus);

export const tutorRouter: Router = router;
