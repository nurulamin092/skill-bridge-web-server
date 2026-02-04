import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/globalErrorHandler";
import cors from "cors";
import { tutorRouter } from "./modules/tutor/tutor.router";
import { bookingRouter } from "./modules/booking/booking.router";
import { availabilityRouter } from "./modules/availability/availability.router";
import { reviewRouter } from "./modules/review/review.router";
import { adminRouter } from "./modules/admin/admin.router";
import { categoriesRouter } from "./modules/category/category.router";
const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/*", toNodeHandler(auth));

app.use("/api/v1/categories", categoriesRouter);

app.use("/api/v1/tutors", tutorRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/tutor/availability", availabilityRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "skill bridge app is running!..",
  });
});

app.use(errorHandler);
export default app;
