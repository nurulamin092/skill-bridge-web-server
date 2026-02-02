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

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.updateUserStatus(req, id as string);
  res.status(200).json({
    success: true,
    data: result,
  });
});

const approvedTutor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.approvedTutor(req, id as string);
  res.status(200).json({
    success: true,
    data: result,
  });
});
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.createCategory(req);
  res.status(201).json({
    success: true,
    data: result,
  });
});
export const adminController = {
  getAllUsers,
  updateUserStatus,
  approvedTutor,
  createCategory,
};
