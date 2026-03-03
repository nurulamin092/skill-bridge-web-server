import { Router, Request, Response } from "express";
import { auth } from "../../lib/auth";

const router: Router = Router();

router.get("/verify-email", async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) return res.status(400).send("Token নেই");

  try {
    await (auth as any).emailVerification.verifyToken(token);
    res.redirect(
      "https://skill-bridge-web-client.vercel.app/login?verified=true",
    );
  } catch (err) {
    console.error("Email verification failed:", err);
    res.status(400).send("Invalid বা expired token");
  }
});

export default router;
