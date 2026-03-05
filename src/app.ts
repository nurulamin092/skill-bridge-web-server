import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/globalErrorHandler";
import cors from "cors";
import verifyEmailRoute from "./modules/auth/verify-email.route";

// Routes
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
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

app.all("/api/auth/*", (req, res) => {
  console.log("🎯 Auth route handler:", req.method, req.path);
  try {
    return toNodeHandler(auth)(req, res);
  } catch (error) {
    console.error("❌ Auth handler error:", error);
    res.status(500).json({ error: "Auth handler error" });
  }
});

app.use("/api/v1/tutors", tutorRouter);
app.use("/api/v1/student", studentProfileRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/tutor/availability", availabilityRouter);
app.use("/api/v1/tutor/profile", tutorProfileRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Skill Bridge API is running!" });
});

app.get("/api/auth/debug", (req, res) => {
  res.json({
    message: "Debug endpoint working",
    path: req.path,
    method: req.method,
    headers: req.headers,
    time: new Date().toISOString(),
  });
});

app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

app.use(verifyEmailRoute);
app.use(errorHandler);

export default app;
