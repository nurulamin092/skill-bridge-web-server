import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", bookingController.createBooking);
router.get("/me", bookingController.getMyBooking);
router.patch("/:id/cancel", bookingController.cancelBooking);

export const bookingRouter = router;
