import { Router } from "express";
import { availabilityController } from "./availability.controller";
import auth from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.use(auth(Role.TUTOR));

router.post("/", availabilityController.createAvailability);
router.get("/me", availabilityController.getMyAvailability);
router.get("/booked", availabilityController.getBookedSessions);
router.put("/:id", availabilityController.updateAvailability);
router.delete("/:id", availabilityController.deleteAvailability);

export const availabilityRouter = router;
