import { Router } from "express";
import { tutorProfileController } from "./tutor-profile.controller";

const router = Router();

router.post("/", tutorProfileController.createTutorProfile);
