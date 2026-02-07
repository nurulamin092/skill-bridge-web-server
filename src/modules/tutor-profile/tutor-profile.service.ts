import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { requireRole } from "../../utils/requireRole";

const createTutorProfile = async (req: any) => {
  const user = requireRole(req, Role.TUTOR);
  const { bio, hourlyRate, experience, categoryIds } = req.body;

  if (!hourlyRate || hourlyRate <= 0) {
    throw new ApiError(400, "Valid hourly rate is required");
  }

  if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    throw new ApiError(400, "Al least one category is required");
  }

  const existingProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) {
    throw new ApiError(400, "Tutor profile already exist");
  }

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });

  if (categories.length !== categoryIds.length) {
    throw new ApiError(400, "One or more categories not found");
  }

  return prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.create({
      data: {
        userId: user.id,
        bio,
        hourlyRate: parseFloat(hourlyRate),
        experience: parseInt(experience) || 0,
      },
    });
    await tx.tutorCategory.createMany({
      data: categoryIds.map((categoryId: string) => ({
        tutorId: tutorProfile.id,
        categoryId,
      })),
    });
    return tutorProfile;
  });
};

const getMyTutorProfile = async (req: any) => {
  const user = await requireRole(req, Role.TUTOR);

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
    include: {
      tutorCategories: {
        include: {
          category: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });
  if (!tutorProfile) {
    throw new ApiError(400, "Tutor profile not found");
  }
  return tutorProfile;
};
export const tutorProfileService = {
  createTutorProfile,
  getMyTutorProfile,
};
