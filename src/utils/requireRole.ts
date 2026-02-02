import { Request } from "express";
import { Role } from "../../generated/prisma/enums";
import { ApiError } from "./apiError";

export const requireRole = (req: Request, role: Role) => {
  const user = (req as any).user;

  if (!user || user.role !== role) {
    throw new ApiError(403, "Forbidden");
  }
  return user;
};
