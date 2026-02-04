import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { requireRole } from "../../utils/requireRole";

const getAllUser = async (req: any) => {
  requireRole(req, Role.ADMIN);
  return await prisma.user.findMany();
};

const getAllBookings = async (req: any) => {
  requireRole(req, Role.ADMIN);
  return prisma.booking.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tutor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      availability: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserStatus = async (req: any, userId: string) => {
  requireRole(req, Role.ADMIN);
  const { isBanned } = req.body;
  return prisma.user.update({
    where: { id: userId },
    data: { isBanned },
  });
};

const approvedTutor = async (req: any, tutorId: string) => {
  requireRole(req, Role.ADMIN);

  return prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { isApproved: true },
  });
};

const createCategory = async (req: any) => {
  requireRole(req, Role.ADMIN);
  const { name, slug } = req.body;
  const exists = await prisma.category.findUnique({
    where: { slug },
  });

  if (exists) {
    throw new ApiError(400, "Category already exist");
  }
  return prisma.category.create({
    data: { name, slug },
  });
};
const getAllCategories = async (req: any) => {
  requireRole(req, Role.ADMIN);
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};
const updateCategory = async (req: any, categoryId: string) => {
  requireRole(req, Role.ADMIN);
  const { name, slug } = req.body;

  if (slug) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: categoryId },
      },
    });
    if (existing) {
      throw new ApiError(400, "Slug already exists");
    }
  }
  return await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      updatedAt: new Date(),
    },
  });
};

const deleteCategory = async (req: any, categoryId: string) => {
  requireRole(req, Role.ADMIN);
  const categoryIdUse = await prisma.tutorCategory.findFirst({
    where: { categoryId },
  });
  if (categoryIdUse) {
    throw new ApiError(400, "Can't delete category that assign to tutor");
  }
  await prisma.category.delete({
    where: { id: categoryId },
  });
  return { message: "Category delete successfully" };
};

export const adminService = {
  getAllUser,
  getAllBookings,
  updateUserStatus,
  approvedTutor,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
