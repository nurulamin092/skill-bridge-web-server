import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app: Application = express();

app.use(express.json());
app.all("/api/auth/*", (req, _res, next) => {
  console.log("Auth route hit:", req.path, req.method);
  next();
});

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "skill bridge app is running!..",
  });
});
export default app;
