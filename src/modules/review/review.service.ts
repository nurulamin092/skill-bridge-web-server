import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { getAuthUser } from "../../utils/authUser";

const createReview = async (req: any) => {
  const user = getAuthUser(req);
  if (user.role !== Role.STUDENT) {
    throw new ApiError(403, "Only student can review");
  }

  const { bookingId, rating, comment } = req.body;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  if (
    !booking ||
    booking.status !== user.id ||
    booking.status !== BookingStatus.COMPLETED
  ) {
    throw new ApiError(400, "Invalid Booking");
  }

  const review = await prisma.review.create({
    data: {
      bookingId,
      rating,
      comment,
      tutorId: booking.tutorProfileId,
      studentId: user.id,
    },
  });

  const stats = await prisma.review.aggregate({
    where: { tutorId: booking.tutorProfileId },
    _avg: { rating: true },
  });

  await prisma.tutorProfile.update({
    where: { id: booking.tutorProfileId },
    data: {
      avgRating: stats._avg.rating || 0,
    },
  });
  return review;
};

export const reviewService = { createReview };
