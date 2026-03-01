import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    data: result,
  });
});

const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await categoryService.getCategoryBySlug(slug as string);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const categoryController = {
  getAllCategories,
  getCategoryBySlug,
};
