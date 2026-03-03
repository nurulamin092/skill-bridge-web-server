import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/globalErrorHandler";
import cors from "cors";
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

const allowedOrigins = [
  "http://localhost:3000",
  "https://skill-bridge-web-client.vercel.app",
];

// const corsOptions: cors.CorsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
//       return callback(null, true);
//     }

//     if (origin.endsWith(".vercel.app")) {
//       return callback(null, true);
//     }

//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));

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

app.all("/api/auth/*", toNodeHandler(auth));

app.use("/api/v1/tutors", tutorRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentProfileRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/tutor/availability", availabilityRouter);
app.use("/api/v1/tutor/profile", tutorProfileRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Skill Bridge API is running!",
  });
});

app.use(verifyEmailRoute);

app.get("/api/auth/debug", (req, res) => {
  res.json({
    message: "Auth endpoint is working",
    origin: req.headers.origin,
    headers: req.headers,
  });
});

app.use(errorHandler);

export default app;
