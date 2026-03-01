import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { ApiError } from "../utils/apiError";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
        emailVerified: boolean;
        isBanned: boolean;
      };
    }
  }
}

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session || !session.user) {
        throw new ApiError(401, "You are not authorized, please login.");
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          isBanned: true,
        },
      });

      if (!user) {
        throw new ApiError(404, "User not found in database");
      }

      if (user.isBanned) {
        throw new ApiError(
          403,
          "Your account has been banned. Contact support.",
        );
      }

      const isTutorProfileCreation =
        req.method === "POST" &&
        (req.originalUrl === "/api/v1/tutor/profile" ||
          (req.originalUrl.includes("/api/v1/tutor/profile") &&
            req.path === "") ||
          (req.path === "/" && req.baseUrl === "/api/v1/tutor/profile"));

      if (user.role === Role.TUTOR && !isTutorProfileCreation) {
        const tutor = await prisma.tutorProfile.findUnique({
          where: { userId: user.id },
        });

        if (!tutor) {
          if (roles.includes(Role.ADMIN)) {
            console.log("Admin accessing - skipping tutor profile check");
          } else {
            throw new ApiError(403, "Please complete your tutor profile first");
          }
        }

        if (tutor && !tutor.isApproved) {
          if (roles.includes(Role.ADMIN)) {
            console.log("Admin accessing - skipping tutor approval check");
          } else {
            const allowedRoutes = ["/availability", "/profile"];
            const isAllowedRoute = allowedRoutes.some((route) =>
              req.originalUrl.includes(route),
            );

            if (!isAllowedRoute) {
              throw new ApiError(
                403,
                "Your tutor profile is pending admin approval",
              );
            }
          }
        }
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        emailVerified: session.user.emailVerified,
        isBanned: user.isBanned,
      };

      if (roles.length > 0) {
        if (!roles.includes(req.user.role)) {
          throw new ApiError(
            403,
            `Access denied. Required role: ${roles.join(", ")}. Your role: ${req.user.role}`,
          );
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
