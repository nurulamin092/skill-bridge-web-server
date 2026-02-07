import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth.middleware";

async function seedAdmin() {
  try {
    console.log("******* Admin seeding stated ******");
    const adminData = {
      name: "Admin Admin",
      email: "admin.a@admin.com",
      role: UserRole.ADMIN,
      password: "Admin@1234",
    };

    // check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exist in db");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: process.env.APP_URL!,
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      console.log("*** Admin Created ***");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });

      console.log("**** Email verification status updated! ***");
    }
    console.log(signUpAdmin);
  } catch (err) {
    console.error(err);
  }
}

seedAdmin();
