import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/:slug", categoryController.getCategoryBySlug);

export const categoriesRouter = router;
