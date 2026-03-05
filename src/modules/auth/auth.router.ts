import { Router } from "express";

import { authController } from "./auth.controller";

const router = Router();

router.get("/me", authController.getCurrentUser);
// router.get("/session", authController.getSession);

export const authRouter: Router = router;
