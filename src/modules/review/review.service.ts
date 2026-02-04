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

  if (!bookingId || !rating) {
    throw new ApiError(400, "bookingId and rating is required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must between 1 and 5");
  }

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (
      !booking ||
      booking.studentId !== user.id ||
      booking.status !== BookingStatus.COMPLETED
    ) {
      throw new ApiError(400, "Invalid Booking");
    }
    const exists = await tx.review.findUnique({
      where: { bookingId },
    });

    if (exists) {
      throw new ApiError(400, "Review already submitted");
    }
    const review = await tx.review.create({
      data: {
        bookingId,
        rating,
        comment,
        tutorId: booking.tutorProfileId,
        studentId: user.id,
      },
    });

    const stats = await tx.review.aggregate({
      where: { tutorId: booking.tutorProfileId },
      _avg: { rating: true },
    });
    await tx.tutorProfile.update({
      where: { id: booking.tutorProfileId },
      data: {
        avgRating: stats._avg.rating || 0,
      },
    });
    return review;
  });
};

export const reviewService = { createReview };
