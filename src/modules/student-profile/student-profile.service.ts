import { unescape } from "querystring";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { requireRole } from "../../utils/requireRole";

const getStudentProfile = async (req: any) => {
  const user = await requireRole(req, Role.STUDENT);

  const student = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      studentBookings: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          tutor: {
            select: {
              id: true,
              hourlyRate: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });
  if (!student) {
    throw new ApiError(400, "Tutor profile not found");
  }
  return student;
};

const updateStudentProfile = async (req: any) => {
  const user = requireRole(req, Role.STUDENT);
  const { name, phone } = req.body;

  if (name && name.trim().length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters ");
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name && { name: name.trim() }),
      ...(phone && { phone }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      updatedAt: true,
    },
  });
};

const getStudentDashboard = async (req: any) => {
  const user = requireRole(req, Role.STUDENT);

  const [upcomingBookings, pastBookings, totalSpent] = await Promise.all([
    prisma.booking.findMany({
      where: {
        studentId: user.id,
        status: "CONFIRMED",
        availability: {
          startTime: {
            gt: new Date(),
          },
        },
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
            availabilities: {
              select: {
                startTime: true,
                endTime: true,
              },
            },
          },
        },
      },
      orderBy: {
        availability: {
          startTime: "asc",
        },
      },
      take: 5,
    }),
    prisma.booking.findMany({
      where: {
        studentId: user.id,
        OR: [{ status: "COMPLETED" }, { status: "CANCELLED" }],
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        availability: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
        review: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
    prisma.booking.aggregate({
      where: {
        studentId: user.id,
        status: "COMPLETED",
      },
      _sum: {
        priceSnapshot: true,
      },
    }),
  ]);

  const stats = {
    totalBookings: upcomingBookings.length + pastBookings.length,
    upcomingSession: upcomingBookings.length,
    completedSessions: pastBookings.filter((b) => b.status === "COMPLETED")
      .length,
    totalSpent: totalSpent._sum.priceSnapshot || 0,
  };
  return {
    stats,
    upcomingBookings,
    pastBookings,
  };
};
export const tutorProfileService = {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
};
