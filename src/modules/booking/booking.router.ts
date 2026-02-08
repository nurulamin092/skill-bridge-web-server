import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();

router.use(auth());

router.post("/", bookingController.createBooking);
router.get("/me", bookingController.getMyBooking);
router.patch("/:id/cancel", bookingController.cancelBooking);

export const bookingRouter = router;
