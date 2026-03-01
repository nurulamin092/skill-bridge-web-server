import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { availabilityService } from "./availability.service";

const createAvailability = catchAsync(async (req: Request, res: Response) => {
  const result = await availabilityService.createAvailability(req);
  res.status(201).json({
    success: true,
    data: result,
  });
});

const getMyAvailability = catchAsync(async (req: Request, res: Response) => {
  const result = await availabilityService.getMyAvailability(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});
const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await availabilityService.updateAvailability(
    req,
    id as string,
  );
  res.status(200).json({
    success: true,
    message: "Availability update successfully",
    data: result,
  });
});
const deleteAvailability = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await availabilityService.deleteAvailability(
    req,
    id as string,
  );
  res.status(200).json({
    success: true,
    message: result.message,
  });
});
const getBookedSessions = catchAsync(async (req: Request, res: Response) => {
  const result = await availabilityService.getTutorBookedSessions(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const availabilityController = {
  createAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability,
  getBookedSessions,
};
