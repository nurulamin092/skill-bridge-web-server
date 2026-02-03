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

const getSingleTutor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tutorService.getSingleTutor(id as string);
  res.status(200).json({
    success: true,
    data: result,
  });
});

const getMySession = catchAsync(async (req: Request, res: Response) => {
  const result = await tutorService.getMySessions(req);
  res.status(200).json({
    success: true,
    data: result,
  });
});

const updateSessionStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tutorService.updateSessionStatus(req, id as string);
  res.status(200).json({
    success: true,
    data: result,
  });
});
export const tutorController = {
  getAllTutor,
  getSingleTutor,
  getMySession,
  updateSessionStatus,
};
