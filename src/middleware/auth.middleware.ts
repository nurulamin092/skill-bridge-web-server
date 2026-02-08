import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { ApiError } from "../utils/apiError";
import { prisma } from "../lib/prisma";

export enum UserRole {
  STUDENT = "STUDENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        emailVerified: boolean;
        isBanned: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session || !session.user) {
        throw new ApiError(401, "You are not authorize,please login.");
      }

      if (!session.user.emailVerified) {
        throw new ApiError(
          403,
          "Email verification required. Please verify your email!",
        );
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
        throw new ApiError(404, "You are not found id database");
      }

      if (user.isBanned) {
        throw new ApiError(
          403,
          "Your account has been banned. Contact support.",
        );
      }
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        emailVerified: session.user.emailVerified,
        isBanned: user.isBanned,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        throw new ApiError(
          403,
          `Access denied. Required role : ${roles.join(", ")} s Your role : ${req.user.role}`,
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
