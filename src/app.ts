import express, { Application, Request, Response, NextFunction } from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/globalErrorHandler";

import verifyEmailRoute from "./modules/auth/verify-email.route";

import { tutorRouter } from "./modules/tutor/tutor.router";
import { bookingRouter } from "./modules/booking/booking.router";
import { availabilityRouter } from "./modules/availability/availability.router";
import { reviewRouter } from "./modules/review/review.router";
import { adminRouter } from "./modules/admin/admin.router";
import { categoriesRouter } from "./modules/category/category.router";
import { authRouter } from "./modules/auth/auth.router";
import { studentProfileRouter } from "./modules/student-profile/student-profile.router";
import { tutorProfileRouter } from "./modules/tutor-profile/tutor-profile.router";

const app: Application = express();

/*
|--------------------------------------------------------------------------
| CORS CONFIG
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:3000",
  "https://skill-bridge-web-client.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.options("*", cors());

/*
|--------------------------------------------------------------------------
| BODY PARSER
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| DEBUG LOGGER
|--------------------------------------------------------------------------
*/

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("================================");
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  console.log("🌍 Origin:", req.headers.origin || "No origin");
  console.log(
    "🍪 Cookie:",
    req.headers.cookie ? "✅ Present" : "❌ Not present",
  );
  console.log("================================");
  next();
});

/*
|--------------------------------------------------------------------------
| BETTER AUTH ROUTE
|--------------------------------------------------------------------------
*/

app.all("/api/auth/*", toNodeHandler(auth));

/*
|--------------------------------------------------------------------------
| DEBUG ROUTES
|--------------------------------------------------------------------------
*/

app.get("/test", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Test endpoint working",
    time: new Date().toISOString(),
  });
});

app.get("/api/auth/debug", (req: Request, res: Response) => {
  res.json({
    success: true,
    cookies: req.headers.cookie || "No cookies",
    origin: req.headers.origin,
    userAgent: req.headers["user-agent"],
  });
});

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/v1/tutors", tutorRouter);
app.use("/api/v1/student", studentProfileRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/tutor/availability", availabilityRouter);
app.use("/api/v1/tutor/profile", tutorProfileRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);

app.use(verifyEmailRoute);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Skill Bridge API is running!",
    environment: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;
