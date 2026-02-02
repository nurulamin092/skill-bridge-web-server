import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tutorService } from "./tutor.service";

const getAllTutor = catchAsync(async (req: Request, res: Response) => {
  const result = await tutorService.getAllTutor(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const tutorController = { getAllTutor };
