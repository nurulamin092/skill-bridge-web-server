import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReview(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const reviewController = { createBooking };
