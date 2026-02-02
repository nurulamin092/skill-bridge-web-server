import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { availabilityService } from "./availability.service";

const createAvailability = catchAsync(async (req: Request, res: Response) => {
  const result = await availabilityService.createAvailability(req);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const availabilityController = {
  createAvailability,
};
