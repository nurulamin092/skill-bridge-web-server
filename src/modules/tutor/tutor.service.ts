import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { requireRole } from "../../utils/requireRole";

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

const getSingleTuTor = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      tutorCategories: {
        include: { category: true },
      },
      availabilities: {
        where: { isBooked: false },
        orderBy: { startTime: "asc" },
      },
      reviews: {
        include: {
          student: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
  if (!tutor || !tutor.isApproved) {
    throw new ApiError(404, "Tutor not found");
  }
  return tutor;
};

const getMySession = async (req: any) => {
  const user = requireRole(req, Role.TUTOR);

  return prisma.booking.findMany({
    where: {
      tutor: {
        userId: user.id,
      },
    },
    include: {
      student: true,
      availability: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateSessionStatus = async (req: any, bookingId: string) => {
  const user = requireRole(req, Role.TUTOR);
  const { status } = req.body;

  if (![BookingStatus.COMPLETED, BookingStatus.NO_SHOW].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: true,
    },
  });
  if (!booking || booking.tutor.userId !== user.id) {
    throw new ApiError(401, "Unauthorize");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
};
export const tutorService = {
  getAllTutor,
  getSingleTuTor,
  getMySession,
  updateSessionStatus,
};
