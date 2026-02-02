import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", bookingController.createBooking);
router.post("/me", bookingController.getMyBooking);

export const bookingRouter = router;
