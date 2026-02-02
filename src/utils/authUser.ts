import { Request } from "express";
import { ApiError } from "./apiError";

export const getAuthUser = (req: Request) => {
  const user = (req as any).user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  return user;
};
