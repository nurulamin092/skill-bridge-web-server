import { Role } from "../../../generated/prisma/enums";
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

export const bookingService = { createBooking, getMyBooking };
