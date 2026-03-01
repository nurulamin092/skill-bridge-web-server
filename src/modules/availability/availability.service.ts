import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { requireRole } from "../../utils/requireRole";

const createAvailability = async (req: any) => {
  const user = requireRole(req, Role.TUTOR);
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    throw new ApiError(400, "startTime and endTime required");
  }

  if (new Date(startTime) >= new Date(endTime)) {
    throw new ApiError(400, "Invalid time range");
  }

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!tutorProfile) {
    throw new ApiError(404, "Tutor not found");
  }

  const clash = await prisma.availability.findFirst({
    where: {
      tutorId: tutorProfile.id,
      startTime: { lt: new Date(endTime) },
      endTime: { gt: new Date(startTime) },
    },
  });

  if (clash) {
    throw new ApiError(400, "Time slot overlaps with existing availability");
  }
  return prisma.availability.create({
    data: {
      tutorId: tutorProfile.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });
};

const getMyAvailability = async (req: any) => {
  const user = requireRole(req, Role.TUTOR);

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!tutorProfile) {
    throw new ApiError(404, "tutor profile not found");
  }
  return prisma.availability.findMany({
    where: {
      tutorId: tutorProfile.id,
    },
    orderBy: { startTime: "asc" },
  });
};

const updateAvailability = async (req: any, availabilityId: string) => {
  const user = requireRole(req, Role.TUTOR);
  const { startTime, endTime } = req.body;
  if (!startTime || !endTime) {
    throw new ApiError(400, "startTime and endTime are required");
  }

  const newStart = new Date(startTime);
  const newEnd = new Date(endTime);

  if (newStart >= newEnd) {
    throw new ApiError(400, "Invalid time range");
  }

  if (newStart < new Date()) {
    throw new ApiError(400, "Can't set availability in the past");
  }

  return prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUnique({
      where: { id: availabilityId },
      include: {
        tutor: true,
      },
    });

    if (!availability) {
      throw new ApiError(404, "Availability not found");
    }
    if (availability.tutor.userId !== user.id) {
      throw new ApiError(403, "Not authorize to update this availability");
    }

    if (availability.isBooked) {
      throw new ApiError(400, "Can't update a booked time slot");
    }
    const clash = await tx.availability.findFirst({
      where: {
        tutorId: availability.tutorId,
        id: { not: availabilityId },
        startTime: { lt: newEnd },
        endTime: { gt: newStart },
      },
    });

    if (clash) {
      throw new ApiError(400, "Time slot overlaps with existing availability");
    }

    return tx.availability.update({
      where: { id: availabilityId },
      data: {
        startTime: newStart,
        endTime: newEnd,
      },
    });
  });
};
const deleteAvailability = async (req: any, availabilityId: string) => {
  const user = requireRole(req, Role.TUTOR);

  return prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUnique({
      where: { id: availabilityId },
      include: {
        tutor: true,
      },
    });

    if (!availability) {
      throw new ApiError(404, "Availability not found");
    }
    if (availability.tutor.userId !== user.id) {
      throw new ApiError(403, "Not authorize to update this availability");
    }

    if (availability.isBooked) {
      throw new ApiError(400, "Can't delete a booked time slot");
    }

    await tx.availability.delete({
      where: { id: availabilityId },
    });
    return { message: "Availability deleted successfully" };
  });
};

const getTutorBookedSessions = async (req: any) => {
  const user = requireRole(req, Role.TUTOR);

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!tutorProfile) {
    throw new ApiError(404, "Tutor profile not found");
  }

  return prisma.availability.findMany({
    where: {
      tutorId: tutorProfile.id,
      isBooked: true,
      booking: {
        status: "CONFIRMED",
      },
    },
    include: {
      booking: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const availabilityService = {
  createAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability,
  getTutorBookedSessions,
};
