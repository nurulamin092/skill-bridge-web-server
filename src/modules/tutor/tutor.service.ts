import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { requireRole } from "../../utils/requireRole";

const getAllTutor = async (query: any) => {
  const { category, minPrice, maxPrice, rating, featured } = query;

  const priceFilter: any = {};

  if (minPrice) {
    priceFilter.gte = Number(minPrice);
  }

  if (maxPrice) {
    priceFilter.lte = Number(maxPrice);
  }

  const options: any = {
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
  };
  if (featured) {
    options.orderBy = { avgRating: "desc" };
    options.take = 4;
  }
  return prisma.tutorProfile.findMany(options);
};

const getSingleTutor = async (id: string) => {
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
const geTutorReviews = async (req: any) => {
  const user = requireRole(req, Role.TUTOR);

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!tutorProfile) {
    throw new ApiError(404, "Tutor profile not found");
  }

  const review = await prisma.review.findMany({
    where: { tutorId: tutorProfile.id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const transformedReviews = review.map((review) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    student: {
      id: review.student.id,
      name: review.student.name,
      image: review.student.image,
    },
  }));
  return transformedReviews;
};
const getMySessions = async (req: any) => {
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

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutor: true,
      },
    });
    if (!booking || booking.tutor.userId !== user.id) {
      throw new ApiError(403, "Not allowed to update this booking");
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new ApiError(400, "Only confirmed bookings can be updated");
    }

    const updateBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    if (status === BookingStatus.NO_SHOW) {
      await tx.availability.update({
        where: { id: booking.availabilityId },
        data: {
          isBooked: false,
          bookingId: null,
        },
      });
    }

    return updateBooking;
  });
};

const getTutorDashboard = async (req: any) => {
  const user = requireRole(req, Role.TUTOR);
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!tutorProfile) {
    throw new ApiError(404, "Tutor profile not found");
  }

  const [totalSessions, upComingSessions, completedSessions, recentReviews] =
    await Promise.all([
      prisma.booking.count({
        where: { tutorProfileId: tutorProfile.id },
      }),
      prisma.booking.count({
        where: {
          tutorProfileId: tutorProfile.id,
          status: BookingStatus.CONFIRMED,
          availability: { startTime: { gt: new Date() } },
        },
      }),
      prisma.booking.count({
        where: {
          tutorProfileId: tutorProfile.id,
          status: BookingStatus.COMPLETED,
        },
      }),

      prisma.review.findMany({
        where: {
          tutorId: tutorProfile.id,
        },
        include: { student: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);
  return {
    stats: {
      totalSessions,
      upComingSessions,
      completedSessions,
      avgRating: tutorProfile.avgRating,
    },
    recentReviews,
  };
};

export const tutorService = {
  getAllTutor,
  getSingleTutor,
  getMySessions,
  updateSessionStatus,
  getTutorDashboard,
  geTutorReviews,
};
