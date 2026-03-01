import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.createBooking(req);
  res.status(201).json({
    success: true,
    data: result,
  });
});

const getMyBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.getMyBooking(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bookingService.cancelBooking(req, id as string);
  res.status(200).json({
    success: true,
    data: result,
  });
});
export const bookingController = {
  createBooking,
  getMyBooking,
  cancelBooking,
};
