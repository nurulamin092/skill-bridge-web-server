import { Router } from "express";
import { availabilityController } from "./availability.controller";

const router = Router();

router.post("/", availabilityController.createAvailability);
