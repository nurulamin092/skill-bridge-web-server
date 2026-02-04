import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

const getCategoryBySlug = async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      tutors: {
        include: {
          tutor: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
};

export const categoryService = {
  getAllCategories,
  getCategoryBySlug,
};
