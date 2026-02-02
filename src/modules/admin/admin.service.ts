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
export const adminService = {
  getAllUser,
  updateUserStatus,
};
