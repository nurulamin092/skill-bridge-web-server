import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { getAuthUser } from "../../utils/authUser";

const createBooking = async (req: any) => {
  const user = getAuthUser(req);

  if (user.role !== Role.STUDENT) {
    throw new ApiError(403, "Only student can book session");
  }

  const { availabilityId } = req.body;

  return prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || availability.isBooked) {
      throw new ApiError(400, "Slot is no available");
    }

    const tutor = await tx.tutorProfile.findUnique({
      where: { id: availability.tutorId },
    });
    if (!tutor || !tutor.isApproved) {
      throw new ApiError(404, "Tutor not available");
    }
    const booking = await tx.booking.create({
      data: {
        studentId: user.id,
        tutorProfileId: tutor.id,
        availabilityId: availability.id,
        priceSnapshot: tutor.hourlyRate,
      },
    });
    await tx.availability.update({
      where: { id: booking.availabilityId },
      data: {
        isBooked: true,
        bookingId: booking.id,
      },
    });
    return booking;
  });
};

const getMyBooking = async (req: any) => {
  const user = await getAuthUser(req);
  return prisma.booking.findMany({
    where: {
      studentId: user.id,
    },
    include: {
      tutor: {
        include: {
          user: true,
        },
      },
      availability: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const cancelBooking = async (req: any, bookingId: string) => {
  const user = getAuthUser(req);

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { availability: true },
    });
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    if (booking.studentId !== user.id && user.role !== Role.ADMIN) {
      throw new ApiError(403, "Not allowed to cancel");
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new ApiError(400, "Booking can't be cancelled");
    }

    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledBy: user.role,
      },
    });
    return { message: "Booking cancelled" };
  });
};

export const bookingService = { createBooking, getMyBooking, cancelBooking };
