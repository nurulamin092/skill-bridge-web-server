import { Router } from "express";
import { tutorController } from "./tutor.controller";

const router = Router();

router.get("/", tutorController.getAllTutor);

export const tutorRouter: Router = router;
