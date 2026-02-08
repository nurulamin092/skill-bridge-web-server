import { parse } from "node:querystring";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { requireRole } from "../../utils/requireRole";
import { overwrite } from "better-auth/*";

const getAllUser = async (req: any) => {
  requireRole(req, Role.ADMIN);
  return await prisma.user.findMany();
};
const getDashboardStats = async (req: any) => {
  requireRole(req, Role.ADMIN);

  const [
    totalUsers,
    totalTutors,
    totalStudents,
    approvedTutors,
    pendingTutors,
    totalBookings,
    todayBookings,
    confirmedBooking,
    completedBookings,
    cancelledBookings,
    totalRevenue,
    weeklyRevenue,
    recentUsers,
    recentBookings,
    categoryStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tutorProfile.count(),
    prisma.user.count({
      where: { role: Role.STUDENT },
    }),

    prisma.tutorProfile.count({ where: { isApproved: true } }),
    prisma.tutorProfile.count({ where: { isApproved: false } }),

    prisma.booking.count(),
    prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(new Date(new Date().setHours(0, 0, 0, 0))),
        },
      },
    }),

    prisma.booking.count({
      where: { status: "CONFIRMED" },
    }),
    prisma.booking.count({
      where: { status: "COMPLETED" },
    }),
    prisma.booking.count({
      where: { status: "CANCELLED" },
    }),

    prisma.booking.aggregate({
      where: { status: "COMPLETED" },
      _sum: { priceSnapshot: true },
    }),
    prisma.booking.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      _sum: { priceSnapshot: true },
    }),

    prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
    prisma.booking.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),

    prisma.category.findMany({
      include: {
        tutors: {
          select: {
            tutorId: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return {
    overview: {
      totalUsers,
      tutor: {
        total: totalTutors,
        approved: approvedTutors,
        pending: pendingTutors,
      },
      totalStudents,
      bookings: {
        total: totalBookings,
        today: todayBookings,
        byStatus: {
          confirmed: confirmedBooking,
          completed: completedBookings,
          cancel: cancelledBookings,
        },
      },
      revenue: {
        total: totalRevenue._sum.priceSnapshot || 0,
        weekly: weeklyRevenue._sum.priceSnapshot || 0,
      },
      pendingTutorApproved: pendingTutors,
    },
    recentActivity: {
      users: recentUsers,
      bookings: recentBookings,
    },
    categories: categoryStats.map((category: any) => ({
      id: category.id,
      name: category.name,
      tutorCount: category.tutors.length,
    })),
  };
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
  getDashboardStats,
  getAllBookings,
  updateUserStatus,
  approvedTutor,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
