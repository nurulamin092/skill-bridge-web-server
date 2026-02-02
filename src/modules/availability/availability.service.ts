import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { requireRole } from "../../utils/requireRole";

const createAvailability = async (req: any) => {
  const user = requireRole(req, Role.TUTOR);
  const { startTime, endTime } = req.body;
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!tutorProfile) {
    throw new ApiError(404, "Tutor not found");
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
