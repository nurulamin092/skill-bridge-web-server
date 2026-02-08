import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { authController } from "./auth.controller";

const router = Router();

router.get("/me", auth(), authController.getCurrentUser);

export const authRouter = router;
