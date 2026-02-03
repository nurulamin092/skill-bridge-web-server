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

export const availabilityService = {
  createAvailability,
  getMyAvailability,
};
