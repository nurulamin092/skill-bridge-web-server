import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { requireRole } from "../../utils/requireRole";

const getAllUser = async (req: any) => {
  requireRole(req, Role.ADMIN);
  return await prisma.user.findMany();
};

export const adminService = {
  getAllUser,
};
