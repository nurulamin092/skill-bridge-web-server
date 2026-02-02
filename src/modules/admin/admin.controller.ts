import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUser(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const adminController = {
  getAllUsers,
};
