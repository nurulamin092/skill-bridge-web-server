import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { studentProfileService } from "./student-profile.service";

const getStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await studentProfileService.getStudentProfile(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});
const updateStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await studentProfileService.updateStudentProfile(req);
  res.status(200).json({
    success: true,
    message: "Profile update successfully",
    data: result,
  });
});
const getStudentDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await studentProfileService.getStudentDashboard(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const studentProfileController = {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
};
