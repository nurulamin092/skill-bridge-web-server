import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { requireRole } from "../../utils/requireRole";

const getAllUser = async (req: any) => {
  requireRole(req, Role.ADMIN);
  return await prisma.user.findMany();
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
export const adminService = {
  getAllUser,
  updateUserStatus,
  approvedTutor,
};
