import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { auth as betterAuth } from "../../lib/auth";
import { ApiError } from "../../utils/apiError";
import { prisma } from "../../lib/prisma";

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const session = await betterAuth.api.getSession({
    headers: req.headers as any,
  });

  if (!session || !session.user) {
    throw new ApiError(401, "You are not authorize, please login.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      emailVerified: true,
      isBanned: true,
      createdAt: true,
      tutorProfile: {
        select: {
          id: true,
          bio: true,
          hourlyRate: true,
          experience: true,
          avgRating: true,
          isApproved: true,
        },
      },
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.isBanned) {
    throw new ApiError(
      403,
      "Your account has been banned. Please Contact Support!",
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const authController = {
  getCurrentUser,
};
