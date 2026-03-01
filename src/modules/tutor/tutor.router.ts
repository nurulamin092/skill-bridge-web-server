import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", tutorController.getAllTutor);
router.get("/me/bookings", auth(Role.TUTOR), tutorController.getMySession);
router.get("/dashboard", auth(Role.TUTOR), tutorController.getTutorDashboard);
router.get("/me/reviews", auth(Role.TUTOR), tutorController.getTutorReviews);

router.patch(
  "/bookings/:id/status",
  auth(Role.TUTOR),
  tutorController.updateSessionStatus,
);
router.get("/:id", tutorController.getSingleTutor);

export const tutorRouter: Router = router;
