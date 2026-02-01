import { gt, gte } from "better-auth/*";
import { prisma } from "../../lib/prisma";

const getAllTutor = async (query: any) => {
  const { category, minPrice, maxPrice, rating } = query;

  const priceFilter: any = {};

  if (minPrice) {
    priceFilter.gte = Number(minPrice);
  }

  if (maxPrice) {
    priceFilter.lte = Number(maxPrice);
  }

  return prisma.tutorProfile.findMany({
    where: {
      isApproved: true,

      ...(Object.keys(priceFilter).length && {
        hourlyRate: priceFilter,
      }),
      ...(rating && {
        avgRating: { gte: Number(rating) },
      }),
      ...(category && {
        tutorCategories: {
          some: {
            category: { slug: category },
          },
        },
      }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      tutorCategories: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const tutorService = {
  getAllTutor,
};
