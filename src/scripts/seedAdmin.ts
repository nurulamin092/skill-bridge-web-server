import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    console.log("******* Admin seeding stated ******");

    const adminData = {
      name: "Super Admin",
      email: "super@admin.com",
      role: Role.ADMIN,
      password: "Pass@3097",
    };

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
