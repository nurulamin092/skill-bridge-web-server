import { Router } from "express";
import { tutorController } from "./tutor.controller";

const router = Router();

router.get("/", tutorController.getAllTutor);
router.get("/me/booking", tutorController.getMySession);
router.get("/:id", tutorController.getSingleTuTor);

export const tutorRouter: Router = router;
