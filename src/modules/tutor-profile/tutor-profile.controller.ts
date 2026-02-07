import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tutorProfileService } from "./tutor-profile.service";

const createTutorProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await tutorProfileService.createTutorProfile(req.query);
  res.status(200).json({
    success: true,
    message: "Tutor profile create successfully",
    data: result,
  });
});
const getMyTutorProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await tutorProfileService.getMyTutorProfile(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});
const updateTutorProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await tutorProfileService.updateTutorProfile(req);
  res.status(200).json({
    success: true,
    message: "Tutor profile update successfully",
    data: result,
  });
});

export const tutorProfileController = {
  createTutorProfile,
  getMyTutorProfile,
  updateTutorProfile,
};
