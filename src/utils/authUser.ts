import { Request } from "express";
import { ApiError } from "./apiError";
import { auth as betterAuth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const getAuthUser = async (req: Request) => {
  const session = await betterAuth.api.getSession({
    headers: req.headers as any,
  });

  if (!session || !session.user) {
    throw new ApiError(401, "You are not authorize. please login");
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
      "Your account has been banned. Please Contact Support.",
    );
  }
  if (!user.emailVerified) {
    throw new ApiError(
      403,
      "Email verification required. Please verify your email",
    );
  }
  return user;
};
