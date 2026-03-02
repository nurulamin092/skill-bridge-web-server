// src/server.ts
import "dotenv/config";

// src/app.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.2",
  "engineVersion": "94a226be1cf2967af2541cca5529f0f7ba866919",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n  NO_SHOW\n}\n\nmodel Session {\n  id        String   @id @default(uuid())\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id @default(uuid())\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id @default(uuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel User {\n  id            String  @id @default(uuid())\n  name          String\n  email         String  @unique\n  phone         String?\n  emailVerified Boolean @default(false)\n  role          Role    @default(STUDENT)\n  isBanned      Boolean @default(false)\n\n  tutorProfile    TutorProfile?\n  studentBookings Booking[]     @relation("StudentBookings")\n  reviews         Review[]\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  sessions  Session[]\n  accounts  Account[]\n\n  image  String?\n  status String? @default("ACTIVE")\n\n  @@index([role])\n  @@index([isBanned])\n  @@map("user")\n}\n\nmodel TutorProfile {\n  id         String  @id @default(uuid())\n  userId     String  @unique\n  bio        String?\n  hourlyRate Float\n  experience Int\n  avgRating  Float   @default(0)\n  isApproved Boolean @default(false)\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  tutorCategories TutorCategory[]\n  availabilities  Availability[]\n  bookings        Booking[]\n  reviews         Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([isApproved])\n}\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n  slug String @unique\n\n  tutors TutorCategory[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel TutorCategory {\n  tutorId    String\n  categoryId String\n\n  tutor    TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  category Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@id([tutorId, categoryId])\n}\n\nmodel Availability {\n  id        String   @id @default(uuid())\n  tutorId   String\n  startTime DateTime\n  endTime   DateTime\n  isBooked  Boolean  @default(false)\n  bookingId String?  @unique\n\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  booking   Booking?\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n\n  @@index([tutorId, startTime, endTime])\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String\n  tutorProfileId String\n  availabilityId String        @unique\n  status         BookingStatus @default(CONFIRMED)\n  priceSnapshot  Float\n\n  student User         @relation("StudentBookings", fields: [studentId], references: [id])\n  tutor   TutorProfile @relation(fields: [tutorProfileId], references: [id])\n\n  availability Availability @relation(fields: [availabilityId], references: [id])\n  review       Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  cancelReason String?\n  cancelledBy  Role?\n\n  @@index([status])\n}\n\nmodel Review {\n  id        String @id @default(uuid())\n  rating    Int\n  comment   String\n  tutorId   String\n  studentId String\n  bookingId String @unique\n\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  student User         @relation(fields: [studentId], references: [id])\n  booking Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"tutorCategories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"priceSnapshot","kind":"scalar","type":"Float"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cancelReason","kind":"scalar","type":"String"},{"name":"cancelledBy","kind":"enum","type":"Role"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","user","orderBy","cursor","tutor","tutors","_count","category","tutorCategories","student","availability","booking","review","availabilities","bookings","reviews","tutorProfile","studentBookings","sessions","accounts","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","data","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","create","update","Session.upsertOne","Session.deleteOne","Session.deleteMany","having","_min","_max","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","TutorProfile.findUnique","TutorProfile.findUniqueOrThrow","TutorProfile.findFirst","TutorProfile.findFirstOrThrow","TutorProfile.findMany","TutorProfile.createOne","TutorProfile.createMany","TutorProfile.createManyAndReturn","TutorProfile.updateOne","TutorProfile.updateMany","TutorProfile.updateManyAndReturn","TutorProfile.upsertOne","TutorProfile.deleteOne","TutorProfile.deleteMany","_avg","_sum","TutorProfile.groupBy","TutorProfile.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","TutorCategory.findUnique","TutorCategory.findUniqueOrThrow","TutorCategory.findFirst","TutorCategory.findFirstOrThrow","TutorCategory.findMany","TutorCategory.createOne","TutorCategory.createMany","TutorCategory.createManyAndReturn","TutorCategory.updateOne","TutorCategory.updateMany","TutorCategory.updateManyAndReturn","TutorCategory.upsertOne","TutorCategory.deleteOne","TutorCategory.deleteMany","TutorCategory.groupBy","TutorCategory.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","comment","tutorId","studentId","bookingId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","tutorProfileId","availabilityId","BookingStatus","status","priceSnapshot","updatedAt","cancelReason","Role","cancelledBy","startTime","endTime","isBooked","categoryId","name","slug","every","some","none","userId","bio","hourlyRate","experience","avgRating","isApproved","email","phone","emailVerified","role","isBanned","image","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","tutorId_categoryId","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "_QRaoAEMAQAAuAIAILwBAADOAgAwvQEAAB8AEL4BAADOAgAwvwEBAAAAAcUBQACwAgAh1gFAALACACHjAQEArwIAIfEBQACwAgAh-wEBAAAAAfwBAQC0AgAh_QEBALQCACEBAAAAAQAgEQEAALgCACAIAACxAgAgDQAAuQIAIA4AALoCACAPAAC7AgAgvAEAALMCADC9AQAAAwAQvgEAALMCADC_AQEArwIAIcUBQACwAgAh1gFAALACACHjAQEArwIAIeQBAQC0AgAh5QEIALUCACHmAQIAtgIAIecBCAC1AgAh6AEgALcCACEBAAAAAwAgBwQAANACACAHAADbAgAgvAEAANoCADC9AQAABQAQvgEAANoCADDCAQEArwIAId0BAQCvAgAhAgQAAKUEACAHAAC4BAAgCAQAANACACAHAADbAgAgvAEAANoCADC9AQAABQAQvgEAANoCADDCAQEArwIAId0BAQCvAgAh_gEAANkCACADAAAABQAgAgAABgAwAwAABwAgAwAAAAUAIAIAAAYAMAMAAAcAIAEAAAAFACANBAAA0AIAIAsAANgCACC8AQAA1wIAML0BAAALABC-AQAA1wIAML8BAQCvAgAhwgEBAK8CACHEAQEAtAIAIcUBQACwAgAh1gFAALACACHaAUAAsAIAIdsBQACwAgAh3AEgALcCACEDBAAApQQAIAsAALUEACDEAQAA6gIAIA0EAADQAgAgCwAA2AIAILwBAADXAgAwvQEAAAsAEL4BAADXAgAwvwEBAAAAAcIBAQCvAgAhxAEBAAAAAcUBQACwAgAh1gFAALACACHaAUAAsAIAIdsBQACwAgAh3AEgALcCACEDAAAACwAgAgAADAAwAwAADQAgEQQAANACACAJAAC4AgAgCgAA1QIAIAwAANYCACC8AQAA0gIAML0BAAAPABC-AQAA0gIAML8BAQCvAgAhwwEBAK8CACHFAUAAsAIAIdEBAQCvAgAh0gEBAK8CACHUAQAA0wLUASLVAQgAtQIAIdYBQACwAgAh1wEBALQCACHZAQAA1ALZASMBAAAADwAgDQQAANACACAJAAC4AgAgCwAA0QIAILwBAADPAgAwvQEAABEAEL4BAADPAgAwvwEBAK8CACHAAQIAtgIAIcEBAQCvAgAhwgEBAK8CACHDAQEArwIAIcQBAQCvAgAhxQFAALACACEBAAAAEQAgBgQAAKUEACAJAADjAwAgCgAAtgQAIAwAALcEACDXAQAA6gIAINkBAADqAgAgEQQAANACACAJAAC4AgAgCgAA1QIAIAwAANYCACC8AQAA0gIAML0BAAAPABC-AQAA0gIAML8BAQAAAAHDAQEArwIAIcUBQACwAgAh0QEBAK8CACHSAQEAAAAB1AEAANMC1AEi1QEIALUCACHWAUAAsAIAIdcBAQC0AgAh2QEAANQC2QEjAwAAAA8AIAIAABMAMAMAABQAIAMEAAClBAAgCQAA4wMAIAsAALUEACANBAAA0AIAIAkAALgCACALAADRAgAgvAEAAM8CADC9AQAAEQAQvgEAAM8CADC_AQEAAAABwAECALYCACHBAQEArwIAIcIBAQCvAgAhwwEBAK8CACHEAQEAAAABxQFAALACACEDAAAAEQAgAgAAFgAwAwAAFwAgAQAAAAUAIAEAAAALACABAAAADwAgAQAAABEAIAMAAAAPACACAAATADADAAAUACADAAAAEQAgAgAAFgAwAwAAFwAgDAEAALgCACC8AQAAzgIAML0BAAAfABC-AQAAzgIAML8BAQCvAgAhxQFAALACACHWAUAAsAIAIeMBAQCvAgAh8QFAALACACH7AQEArwIAIfwBAQC0AgAh_QEBALQCACEDAQAA4wMAIPwBAADqAgAg_QEAAOoCACADAAAAHwAgAgAAIAAwAwAAAQAgEQEAALgCACC8AQAAzAIAML0BAAAiABC-AQAAzAIAML8BAQCvAgAhxQFAALACACHWAUAAsAIAIeMBAQCvAgAh8gEBAK8CACHzAQEArwIAIfQBAQC0AgAh9QEBALQCACH2AQEAtAIAIfcBQADNAgAh-AFAAM0CACH5AQEAtAIAIfoBAQC0AgAhCAEAAOMDACD0AQAA6gIAIPUBAADqAgAg9gEAAOoCACD3AQAA6gIAIPgBAADqAgAg-QEAAOoCACD6AQAA6gIAIBEBAAC4AgAgvAEAAMwCADC9AQAAIgAQvgEAAMwCADC_AQEAAAABxQFAALACACHWAUAAsAIAIeMBAQCvAgAh8gEBAK8CACHzAQEArwIAIfQBAQC0AgAh9QEBALQCACH2AQEAtAIAIfcBQADNAgAh-AFAAM0CACH5AQEAtAIAIfoBAQC0AgAhAwAAACIAIAIAACMAMAMAACQAIAEAAAAPACABAAAAEQAgAQAAAB8AIAEAAAAiACABAAAAAQAgAwAAAB8AIAIAACAAMAMAAAEAIAMAAAAfACACAAAgADADAAABACADAAAAHwAgAgAAIAAwAwAAAQAgCQEAALQEACC_AQEAAAABxQFAAAAAAdYBQAAAAAHjAQEAAAAB8QFAAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQEZAAAuACAIvwEBAAAAAcUBQAAAAAHWAUAAAAAB4wEBAAAAAfEBQAAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAEBGQAAMAAwARkAADAAMAkBAACzBAAgvwEBAOECACHFAUAA4wIAIdYBQADjAgAh4wEBAOECACHxAUAA4wIAIfsBAQDhAgAh_AEBAPICACH9AQEA8gIAIQIAAAABACAZAAAzACAIvwEBAOECACHFAUAA4wIAIdYBQADjAgAh4wEBAOECACHxAUAA4wIAIfsBAQDhAgAh_AEBAPICACH9AQEA8gIAIQIAAAAfACAZAAA1ACACAAAAHwAgGQAANQAgAwAAAAEAICAAAC4AICEAADMAIAEAAAABACABAAAAHwAgBQYAALAEACAmAACyBAAgJwAAsQQAIPwBAADqAgAg_QEAAOoCACALvAEAAMsCADC9AQAAPAAQvgEAAMsCADC_AQEAkQIAIcUBQACTAgAh1gFAAJMCACHjAQEAkQIAIfEBQACTAgAh-wEBAJECACH8AQEAngIAIf0BAQCeAgAhAwAAAB8AIAIAADsAMCUAADwAIAMAAAAfACACAAAgADADAAABACABAAAAJAAgAQAAACQAIAMAAAAiACACAAAjADADAAAkACADAAAAIgAgAgAAIwAwAwAAJAAgAwAAACIAIAIAACMAMAMAACQAIA4BAACvBAAgvwEBAAAAAcUBQAAAAAHWAUAAAAAB4wEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wFAAAAAAfgBQAAAAAH5AQEAAAAB-gEBAAAAAQEZAABEACANvwEBAAAAAcUBQAAAAAHWAUAAAAAB4wEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wFAAAAAAfgBQAAAAAH5AQEAAAAB-gEBAAAAAQEZAABGADABGQAARgAwDgEAAK4EACC_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHjAQEA4QIAIfIBAQDhAgAh8wEBAOECACH0AQEA8gIAIfUBAQDyAgAh9gEBAPICACH3AUAA-gMAIfgBQAD6AwAh-QEBAPICACH6AQEA8gIAIQIAAAAkACAZAABJACANvwEBAOECACHFAUAA4wIAIdYBQADjAgAh4wEBAOECACHyAQEA4QIAIfMBAQDhAgAh9AEBAPICACH1AQEA8gIAIfYBAQDyAgAh9wFAAPoDACH4AUAA-gMAIfkBAQDyAgAh-gEBAPICACECAAAAIgAgGQAASwAgAgAAACIAIBkAAEsAIAMAAAAkACAgAABEACAhAABJACABAAAAJAAgAQAAACIAIAoGAACrBAAgJgAArQQAICcAAKwEACD0AQAA6gIAIPUBAADqAgAg9gEAAOoCACD3AQAA6gIAIPgBAADqAgAg-QEAAOoCACD6AQAA6gIAIBC8AQAAxwIAML0BAABSABC-AQAAxwIAML8BAQCRAgAhxQFAAJMCACHWAUAAkwIAIeMBAQCRAgAh8gEBAJECACHzAQEAkQIAIfQBAQCeAgAh9QEBAJ4CACH2AQEAngIAIfcBQADIAgAh-AFAAMgCACH5AQEAngIAIfoBAQCeAgAhAwAAACIAIAIAAFEAMCUAAFIAIAMAAAAiACACAAAjADADAAAkACAJvAEAAMYCADC9AQAAWAAQvgEAAMYCADC_AQEAAAABxQFAALACACHWAUAAsAIAIe8BAQCvAgAh8AEBAK8CACHxAUAAsAIAIQEAAABVACABAAAAVQAgCbwBAADGAgAwvQEAAFgAEL4BAADGAgAwvwEBAK8CACHFAUAAsAIAIdYBQACwAgAh7wEBAK8CACHwAQEArwIAIfEBQACwAgAhAAMAAABYACACAABZADADAABVACADAAAAWAAgAgAAWQAwAwAAVQAgAwAAAFgAIAIAAFkAMAMAAFUAIAa_AQEAAAABxQFAAAAAAdYBQAAAAAHvAQEAAAAB8AEBAAAAAfEBQAAAAAEBGQAAXQAgBr8BAQAAAAHFAUAAAAAB1gFAAAAAAe8BAQAAAAHwAQEAAAAB8QFAAAAAAQEZAABfADABGQAAXwAwBr8BAQDhAgAhxQFAAOMCACHWAUAA4wIAIe8BAQDhAgAh8AEBAOECACHxAUAA4wIAIQIAAABVACAZAABiACAGvwEBAOECACHFAUAA4wIAIdYBQADjAgAh7wEBAOECACHwAQEA4QIAIfEBQADjAgAhAgAAAFgAIBkAAGQAIAIAAABYACAZAABkACADAAAAVQAgIAAAXQAgIQAAYgAgAQAAAFUAIAEAAABYACADBgAAqAQAICYAAKoEACAnAACpBAAgCbwBAADFAgAwvQEAAGsAEL4BAADFAgAwvwEBAJECACHFAUAAkwIAIdYBQACTAgAh7wEBAJECACHwAQEAkQIAIfEBQACTAgAhAwAAAFgAIAIAAGoAMCUAAGsAIAMAAABYACACAABZADADAABVACATDwAAuwIAIBAAAMICACARAAC6AgAgEgAAwwIAIBMAAMQCACC8AQAAwAIAML0BAABxABC-AQAAwAIAML8BAQAAAAHFAUAAsAIAIdQBAQC0AgAh1gFAALACACHeAQEArwIAIekBAQAAAAHqAQEAtAIAIesBIAC3AgAh7AEAAMEC2QEi7QEgALcCACHuAQEAtAIAIQEAAABuACABAAAAbgAgEw8AALsCACAQAADCAgAgEQAAugIAIBIAAMMCACATAADEAgAgvAEAAMACADC9AQAAcQAQvgEAAMACADC_AQEArwIAIcUBQACwAgAh1AEBALQCACHWAUAAsAIAId4BAQCvAgAh6QEBAK8CACHqAQEAtAIAIesBIAC3AgAh7AEAAMEC2QEi7QEgALcCACHuAQEAtAIAIQgPAADmAwAgEAAApQQAIBEAAOUDACASAACmBAAgEwAApwQAINQBAADqAgAg6gEAAOoCACDuAQAA6gIAIAMAAABxACACAAByADADAABuACADAAAAcQAgAgAAcgAwAwAAbgAgAwAAAHEAIAIAAHIAMAMAAG4AIBAPAACiBAAgEAAAoAQAIBEAAKEEACASAACjBAAgEwAApAQAIL8BAQAAAAHFAUAAAAAB1AEBAAAAAdYBQAAAAAHeAQEAAAAB6QEBAAAAAeoBAQAAAAHrASAAAAAB7AEAAADZAQLtASAAAAAB7gEBAAAAAQEZAAB2ACALvwEBAAAAAcUBQAAAAAHUAQEAAAAB1gFAAAAAAd4BAQAAAAHpAQEAAAAB6gEBAAAAAesBIAAAAAHsAQAAANkBAu0BIAAAAAHuAQEAAAABARkAAHgAMAEZAAB4ADAQDwAA7QMAIBAAAOsDACARAADsAwAgEgAA7gMAIBMAAO8DACC_AQEA4QIAIcUBQADjAgAh1AEBAPICACHWAUAA4wIAId4BAQDhAgAh6QEBAOECACHqAQEA8gIAIesBIACEAwAh7AEAAOoD2QEi7QEgAIQDACHuAQEA8gIAIQIAAABuACAZAAB7ACALvwEBAOECACHFAUAA4wIAIdQBAQDyAgAh1gFAAOMCACHeAQEA4QIAIekBAQDhAgAh6gEBAPICACHrASAAhAMAIewBAADqA9kBIu0BIACEAwAh7gEBAPICACECAAAAcQAgGQAAfQAgAgAAAHEAIBkAAH0AIAMAAABuACAgAAB2ACAhAAB7ACABAAAAbgAgAQAAAHEAIAYGAADnAwAgJgAA6QMAICcAAOgDACDUAQAA6gIAIOoBAADqAgAg7gEAAOoCACAOvAEAALwCADC9AQAAhAEAEL4BAAC8AgAwvwEBAJECACHFAUAAkwIAIdQBAQCeAgAh1gFAAJMCACHeAQEAkQIAIekBAQCRAgAh6gEBAJ4CACHrASAAqQIAIewBAAC9AtkBIu0BIACpAgAh7gEBAJ4CACEDAAAAcQAgAgAAgwEAMCUAAIQBACADAAAAcQAgAgAAcgAwAwAAbgAgEQEAALgCACAIAACxAgAgDQAAuQIAIA4AALoCACAPAAC7AgAgvAEAALMCADC9AQAAAwAQvgEAALMCADC_AQEAAAABxQFAALACACHWAUAAsAIAIeMBAQAAAAHkAQEAtAIAIeUBCAC1AgAh5gECALYCACHnAQgAtQIAIegBIAC3AgAhAQAAAIcBACABAAAAhwEAIAYBAADjAwAgCAAApgMAIA0AAOQDACAOAADlAwAgDwAA5gMAIOQBAADqAgAgAwAAAAMAIAIAAIoBADADAACHAQAgAwAAAAMAIAIAAIoBADADAACHAQAgAwAAAAMAIAIAAIoBADADAACHAQAgDgEAAN4DACAIAADfAwAgDQAA4AMAIA4AAOEDACAPAADiAwAgvwEBAAAAAcUBQAAAAAHWAUAAAAAB4wEBAAAAAeQBAQAAAAHlAQgAAAAB5gECAAAAAecBCAAAAAHoASAAAAABARkAAI4BACAJvwEBAAAAAcUBQAAAAAHWAUAAAAAB4wEBAAAAAeQBAQAAAAHlAQgAAAAB5gECAAAAAecBCAAAAAHoASAAAAABARkAAJABADABGQAAkAEAMA4BAACsAwAgCAAArQMAIA0AAK4DACAOAACvAwAgDwAAsAMAIL8BAQDhAgAhxQFAAOMCACHWAUAA4wIAIeMBAQDhAgAh5AEBAPICACHlAQgA8QIAIeYBAgDiAgAh5wEIAPECACHoASAAhAMAIQIAAACHAQAgGQAAkwEAIAm_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHjAQEA4QIAIeQBAQDyAgAh5QEIAPECACHmAQIA4gIAIecBCADxAgAh6AEgAIQDACECAAAAAwAgGQAAlQEAIAIAAAADACAZAACVAQAgAwAAAIcBACAgAACOAQAgIQAAkwEAIAEAAACHAQAgAQAAAAMAIAYGAACnAwAgJgAAqgMAICcAAKkDACBoAACoAwAgaQAAqwMAIOQBAADqAgAgDLwBAACyAgAwvQEAAJwBABC-AQAAsgIAML8BAQCRAgAhxQFAAJMCACHWAUAAkwIAIeMBAQCRAgAh5AEBAJ4CACHlAQgAnQIAIeYBAgCSAgAh5wEIAJ0CACHoASAAqQIAIQMAAAADACACAACbAQAwJQAAnAEAIAMAAAADACACAACKAQAwAwAAhwEAIAkFAACxAgAgvAEAAK4CADC9AQAAogEAEL4BAACuAgAwvwEBAAAAAcUBQACwAgAh1gFAALACACHeAQEAAAAB3wEBAAAAAQEAAACfAQAgAQAAAJ8BACAJBQAAsQIAILwBAACuAgAwvQEAAKIBABC-AQAArgIAML8BAQCvAgAhxQFAALACACHWAUAAsAIAId4BAQCvAgAh3wEBAK8CACEBBQAApgMAIAMAAACiAQAgAgAAowEAMAMAAJ8BACADAAAAogEAIAIAAKMBADADAACfAQAgAwAAAKIBACACAACjAQAwAwAAnwEAIAYFAAClAwAgvwEBAAAAAcUBQAAAAAHWAUAAAAAB3gEBAAAAAd8BAQAAAAEBGQAApwEAIAW_AQEAAAABxQFAAAAAAdYBQAAAAAHeAQEAAAAB3wEBAAAAAQEZAACpAQAwARkAAKkBADAGBQAAmAMAIL8BAQDhAgAhxQFAAOMCACHWAUAA4wIAId4BAQDhAgAh3wEBAOECACECAAAAnwEAIBkAAKwBACAFvwEBAOECACHFAUAA4wIAIdYBQADjAgAh3gEBAOECACHfAQEA4QIAIQIAAACiAQAgGQAArgEAIAIAAACiAQAgGQAArgEAIAMAAACfAQAgIAAApwEAICEAAKwBACABAAAAnwEAIAEAAACiAQAgAwYAAJUDACAmAACXAwAgJwAAlgMAIAi8AQAArQIAML0BAAC1AQAQvgEAAK0CADC_AQEAkQIAIcUBQACTAgAh1gFAAJMCACHeAQEAkQIAId8BAQCRAgAhAwAAAKIBACACAAC0AQAwJQAAtQEAIAMAAACiAQAgAgAAowEAMAMAAJ8BACABAAAABwAgAQAAAAcAIAMAAAAFACACAAAGADADAAAHACADAAAABQAgAgAABgAwAwAABwAgAwAAAAUAIAIAAAYAMAMAAAcAIAQEAACTAwAgBwAAlAMAIMIBAQAAAAHdAQEAAAABARkAAL0BACACwgEBAAAAAd0BAQAAAAEBGQAAvwEAMAEZAAC_AQAwBAQAAJEDACAHAACSAwAgwgEBAOECACHdAQEA4QIAIQIAAAAHACAZAADCAQAgAsIBAQDhAgAh3QEBAOECACECAAAABQAgGQAAxAEAIAIAAAAFACAZAADEAQAgAwAAAAcAICAAAL0BACAhAADCAQAgAQAAAAcAIAEAAAAFACADBgAAjgMAICYAAJADACAnAACPAwAgBbwBAACsAgAwvQEAAMsBABC-AQAArAIAMMIBAQCRAgAh3QEBAJECACEDAAAABQAgAgAAygEAMCUAAMsBACADAAAABQAgAgAABgAwAwAABwAgAQAAAA0AIAEAAAANACADAAAACwAgAgAADAAwAwAADQAgAwAAAAsAIAIAAAwAMAMAAA0AIAMAAAALACACAAAMADADAAANACAKBAAAjAMAIAsAAI0DACC_AQEAAAABwgEBAAAAAcQBAQAAAAHFAUAAAAAB1gFAAAAAAdoBQAAAAAHbAUAAAAAB3AEgAAAAAQEZAADTAQAgCL8BAQAAAAHCAQEAAAABxAEBAAAAAcUBQAAAAAHWAUAAAAAB2gFAAAAAAdsBQAAAAAHcASAAAAABARkAANUBADABGQAA1QEAMAoEAACFAwAgCwAAhgMAIL8BAQDhAgAhwgEBAOECACHEAQEA8gIAIcUBQADjAgAh1gFAAOMCACHaAUAA4wIAIdsBQADjAgAh3AEgAIQDACECAAAADQAgGQAA2AEAIAi_AQEA4QIAIcIBAQDhAgAhxAEBAPICACHFAUAA4wIAIdYBQADjAgAh2gFAAOMCACHbAUAA4wIAIdwBIACEAwAhAgAAAAsAIBkAANoBACACAAAACwAgGQAA2gEAIAMAAAANACAgAADTAQAgIQAA2AEAIAEAAAANACABAAAACwAgBAYAAIEDACAmAACDAwAgJwAAggMAIMQBAADqAgAgC7wBAACoAgAwvQEAAOEBABC-AQAAqAIAML8BAQCRAgAhwgEBAJECACHEAQEAngIAIcUBQACTAgAh1gFAAJMCACHaAUAAkwIAIdsBQACTAgAh3AEgAKkCACEDAAAACwAgAgAA4AEAMCUAAOEBACADAAAACwAgAgAADAAwAwAADQAgAQAAABQAIAEAAAAUACADAAAADwAgAgAAEwAwAwAAFAAgAwAAAA8AIAIAABMAMAMAABQAIAMAAAAPACACAAATADADAAAUACAOBAAA_gIAIAkAAP0CACAKAAD_AgAgDAAAgAMAIL8BAQAAAAHDAQEAAAABxQFAAAAAAdEBAQAAAAHSAQEAAAAB1AEAAADUAQLVAQgAAAAB1gFAAAAAAdcBAQAAAAHZAQAAANkBAwEZAADpAQAgCr8BAQAAAAHDAQEAAAABxQFAAAAAAdEBAQAAAAHSAQEAAAAB1AEAAADUAQLVAQgAAAAB1gFAAAAAAdcBAQAAAAHZAQAAANkBAwEZAADrAQAwARkAAOsBADAOBAAA9QIAIAkAAPQCACAKAAD2AgAgDAAA9wIAIL8BAQDhAgAhwwEBAOECACHFAUAA4wIAIdEBAQDhAgAh0gEBAOECACHUAQAA8ALUASLVAQgA8QIAIdYBQADjAgAh1wEBAPICACHZAQAA8wLZASMCAAAAFAAgGQAA7gEAIAq_AQEA4QIAIcMBAQDhAgAhxQFAAOMCACHRAQEA4QIAIdIBAQDhAgAh1AEAAPAC1AEi1QEIAPECACHWAUAA4wIAIdcBAQDyAgAh2QEAAPMC2QEjAgAAAA8AIBkAAPABACACAAAADwAgGQAA8AEAIAMAAAAUACAgAADpAQAgIQAA7gEAIAEAAAAUACABAAAADwAgBwYAAOsCACAmAADuAgAgJwAA7QIAIGgAAOwCACBpAADvAgAg1wEAAOoCACDZAQAA6gIAIA28AQAAmwIAML0BAAD3AQAQvgEAAJsCADC_AQEAkQIAIcMBAQCRAgAhxQFAAJMCACHRAQEAkQIAIdIBAQCRAgAh1AEAAJwC1AEi1QEIAJ0CACHWAUAAkwIAIdcBAQCeAgAh2QEAAJ8C2QEjAwAAAA8AIAIAAPYBADAlAAD3AQAgAwAAAA8AIAIAABMAMAMAABQAIAEAAAAXACABAAAAFwAgAwAAABEAIAIAABYAMAMAABcAIAMAAAARACACAAAWADADAAAXACADAAAAEQAgAgAAFgAwAwAAFwAgCgQAAOcCACAJAADoAgAgCwAA6QIAIL8BAQAAAAHAAQIAAAABwQEBAAAAAcIBAQAAAAHDAQEAAAABxAEBAAAAAcUBQAAAAAEBGQAA_wEAIAe_AQEAAAABwAECAAAAAcEBAQAAAAHCAQEAAAABwwEBAAAAAcQBAQAAAAHFAUAAAAABARkAAIECADABGQAAgQIAMAoEAADkAgAgCQAA5QIAIAsAAOYCACC_AQEA4QIAIcABAgDiAgAhwQEBAOECACHCAQEA4QIAIcMBAQDhAgAhxAEBAOECACHFAUAA4wIAIQIAAAAXACAZAACEAgAgB78BAQDhAgAhwAECAOICACHBAQEA4QIAIcIBAQDhAgAhwwEBAOECACHEAQEA4QIAIcUBQADjAgAhAgAAABEAIBkAAIYCACACAAAAEQAgGQAAhgIAIAMAAAAXACAgAAD_AQAgIQAAhAIAIAEAAAAXACABAAAAEQAgBQYAANwCACAmAADfAgAgJwAA3gIAIGgAAN0CACBpAADgAgAgCrwBAACQAgAwvQEAAI0CABC-AQAAkAIAML8BAQCRAgAhwAECAJICACHBAQEAkQIAIcIBAQCRAgAhwwEBAJECACHEAQEAkQIAIcUBQACTAgAhAwAAABEAIAIAAIwCADAlAACNAgAgAwAAABEAIAIAABYAMAMAABcAIAq8AQAAkAIAML0BAACNAgAQvgEAAJACADC_AQEAkQIAIcABAgCSAgAhwQEBAJECACHCAQEAkQIAIcMBAQCRAgAhxAEBAJECACHFAUAAkwIAIQ4GAACVAgAgJgAAmgIAICcAAJoCACDGAQEAAAABxwEBAAAABMgBAQAAAATJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAJkCACHOAQEAAAABzwEBAAAAAdABAQAAAAENBgAAlQIAICYAAJUCACAnAACVAgAgaAAAmAIAIGkAAJUCACDGAQIAAAABxwECAAAABMgBAgAAAATJAQIAAAABygECAAAAAcsBAgAAAAHMAQIAAAABzQECAJcCACELBgAAlQIAICYAAJYCACAnAACWAgAgxgFAAAAAAccBQAAAAATIAUAAAAAEyQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQACUAgAhCwYAAJUCACAmAACWAgAgJwAAlgIAIMYBQAAAAAHHAUAAAAAEyAFAAAAABMkBQAAAAAHKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAlAIAIQjGAQIAAAABxwECAAAABMgBAgAAAATJAQIAAAABygECAAAAAcsBAgAAAAHMAQIAAAABzQECAJUCACEIxgFAAAAAAccBQAAAAATIAUAAAAAEyQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQACWAgAhDQYAAJUCACAmAACVAgAgJwAAlQIAIGgAAJgCACBpAACVAgAgxgECAAAAAccBAgAAAATIAQIAAAAEyQECAAAAAcoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgCXAgAhCMYBCAAAAAHHAQgAAAAEyAEIAAAABMkBCAAAAAHKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgAmAIAIQ4GAACVAgAgJgAAmgIAICcAAJoCACDGAQEAAAABxwEBAAAABMgBAQAAAATJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAJkCACHOAQEAAAABzwEBAAAAAdABAQAAAAELxgEBAAAAAccBAQAAAATIAQEAAAAEyQEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQCaAgAhzgEBAAAAAc8BAQAAAAHQAQEAAAABDbwBAACbAgAwvQEAAPcBABC-AQAAmwIAML8BAQCRAgAhwwEBAJECACHFAUAAkwIAIdEBAQCRAgAh0gEBAJECACHUAQAAnALUASLVAQgAnQIAIdYBQACTAgAh1wEBAJ4CACHZAQAAnwLZASMHBgAAlQIAICYAAKcCACAnAACnAgAgxgEAAADUAQLHAQAAANQBCMgBAAAA1AEIzQEAAKYC1AEiDQYAAJUCACAmAACYAgAgJwAAmAIAIGgAAJgCACBpAACYAgAgxgEIAAAAAccBCAAAAATIAQgAAAAEyQEIAAAAAcoBCAAAAAHLAQgAAAABzAEIAAAAAc0BCAClAgAhDgYAAKECACAmAACkAgAgJwAApAIAIMYBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAowIAIc4BAQAAAAHPAQEAAAAB0AEBAAAAAQcGAAChAgAgJgAAogIAICcAAKICACDGAQAAANkBA8cBAAAA2QEJyAEAAADZAQnNAQAAoALZASMHBgAAoQIAICYAAKICACAnAACiAgAgxgEAAADZAQPHAQAAANkBCcgBAAAA2QEJzQEAAKAC2QEjCMYBAgAAAAHHAQIAAAAFyAECAAAABckBAgAAAAHKAQIAAAABywECAAAAAcwBAgAAAAHNAQIAoQIAIQTGAQAAANkBA8cBAAAA2QEJyAEAAADZAQnNAQAAogLZASMOBgAAoQIAICYAAKQCACAnAACkAgAgxgEBAAAAAccBAQAAAAXIAQEAAAAFyQEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQCjAgAhzgEBAAAAAc8BAQAAAAHQAQEAAAABC8YBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEApAIAIc4BAQAAAAHPAQEAAAAB0AEBAAAAAQ0GAACVAgAgJgAAmAIAICcAAJgCACBoAACYAgAgaQAAmAIAIMYBCAAAAAHHAQgAAAAEyAEIAAAABMkBCAAAAAHKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgApQIAIQcGAACVAgAgJgAApwIAICcAAKcCACDGAQAAANQBAscBAAAA1AEIyAEAAADUAQjNAQAApgLUASIExgEAAADUAQLHAQAAANQBCMgBAAAA1AEIzQEAAKcC1AEiC7wBAACoAgAwvQEAAOEBABC-AQAAqAIAML8BAQCRAgAhwgEBAJECACHEAQEAngIAIcUBQACTAgAh1gFAAJMCACHaAUAAkwIAIdsBQACTAgAh3AEgAKkCACEFBgAAlQIAICYAAKsCACAnAACrAgAgxgEgAAAAAc0BIACqAgAhBQYAAJUCACAmAACrAgAgJwAAqwIAIMYBIAAAAAHNASAAqgIAIQLGASAAAAABzQEgAKsCACEFvAEAAKwCADC9AQAAywEAEL4BAACsAgAwwgEBAJECACHdAQEAkQIAIQi8AQAArQIAML0BAAC1AQAQvgEAAK0CADC_AQEAkQIAIcUBQACTAgAh1gFAAJMCACHeAQEAkQIAId8BAQCRAgAhCQUAALECACC8AQAArgIAML0BAACiAQAQvgEAAK4CADC_AQEArwIAIcUBQACwAgAh1gFAALACACHeAQEArwIAId8BAQCvAgAhC8YBAQAAAAHHAQEAAAAEyAEBAAAABMkBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAmgIAIc4BAQAAAAHPAQEAAAAB0AEBAAAAAQjGAUAAAAABxwFAAAAABMgBQAAAAATJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAAJYCACED4AEAAAUAIOEBAAAFACDiAQAABQAgDLwBAACyAgAwvQEAAJwBABC-AQAAsgIAML8BAQCRAgAhxQFAAJMCACHWAUAAkwIAIeMBAQCRAgAh5AEBAJ4CACHlAQgAnQIAIeYBAgCSAgAh5wEIAJ0CACHoASAAqQIAIREBAAC4AgAgCAAAsQIAIA0AALkCACAOAAC6AgAgDwAAuwIAILwBAACzAgAwvQEAAAMAEL4BAACzAgAwvwEBAK8CACHFAUAAsAIAIdYBQACwAgAh4wEBAK8CACHkAQEAtAIAIeUBCAC1AgAh5gECALYCACHnAQgAtQIAIegBIAC3AgAhC8YBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEApAIAIc4BAQAAAAHPAQEAAAAB0AEBAAAAAQjGAQgAAAABxwEIAAAABMgBCAAAAATJAQgAAAABygEIAAAAAcsBCAAAAAHMAQgAAAABzQEIAJgCACEIxgECAAAAAccBAgAAAATIAQIAAAAEyQECAAAAAcoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgCVAgAhAsYBIAAAAAHNASAAqwIAIRUPAAC7AgAgEAAAwgIAIBEAALoCACASAADDAgAgEwAAxAIAILwBAADAAgAwvQEAAHEAEL4BAADAAgAwvwEBAK8CACHFAUAAsAIAIdQBAQC0AgAh1gFAALACACHeAQEArwIAIekBAQCvAgAh6gEBALQCACHrASAAtwIAIewBAADBAtkBIu0BIAC3AgAh7gEBALQCACH_AQAAcQAggAIAAHEAIAPgAQAACwAg4QEAAAsAIOIBAAALACAD4AEAAA8AIOEBAAAPACDiAQAADwAgA-ABAAARACDhAQAAEQAg4gEAABEAIA68AQAAvAIAML0BAACEAQAQvgEAALwCADC_AQEAkQIAIcUBQACTAgAh1AEBAJ4CACHWAUAAkwIAId4BAQCRAgAh6QEBAJECACHqAQEAngIAIesBIACpAgAh7AEAAL0C2QEi7QEgAKkCACHuAQEAngIAIQcGAACVAgAgJgAAvwIAICcAAL8CACDGAQAAANkBAscBAAAA2QEIyAEAAADZAQjNAQAAvgLZASIHBgAAlQIAICYAAL8CACAnAAC_AgAgxgEAAADZAQLHAQAAANkBCMgBAAAA2QEIzQEAAL4C2QEiBMYBAAAA2QECxwEAAADZAQjIAQAAANkBCM0BAAC_AtkBIhMPAAC7AgAgEAAAwgIAIBEAALoCACASAADDAgAgEwAAxAIAILwBAADAAgAwvQEAAHEAEL4BAADAAgAwvwEBAK8CACHFAUAAsAIAIdQBAQC0AgAh1gFAALACACHeAQEArwIAIekBAQCvAgAh6gEBALQCACHrASAAtwIAIewBAADBAtkBIu0BIAC3AgAh7gEBALQCACEExgEAAADZAQLHAQAAANkBCMgBAAAA2QEIzQEAAL8C2QEiEwEAALgCACAIAACxAgAgDQAAuQIAIA4AALoCACAPAAC7AgAgvAEAALMCADC9AQAAAwAQvgEAALMCADC_AQEArwIAIcUBQACwAgAh1gFAALACACHjAQEArwIAIeQBAQC0AgAh5QEIALUCACHmAQIAtgIAIecBCAC1AgAh6AEgALcCACH_AQAAAwAggAIAAAMAIAPgAQAAHwAg4QEAAB8AIOIBAAAfACAD4AEAACIAIOEBAAAiACDiAQAAIgAgCbwBAADFAgAwvQEAAGsAEL4BAADFAgAwvwEBAJECACHFAUAAkwIAIdYBQACTAgAh7wEBAJECACHwAQEAkQIAIfEBQACTAgAhCbwBAADGAgAwvQEAAFgAEL4BAADGAgAwvwEBAK8CACHFAUAAsAIAIdYBQACwAgAh7wEBAK8CACHwAQEArwIAIfEBQACwAgAhELwBAADHAgAwvQEAAFIAEL4BAADHAgAwvwEBAJECACHFAUAAkwIAIdYBQACTAgAh4wEBAJECACHyAQEAkQIAIfMBAQCRAgAh9AEBAJ4CACH1AQEAngIAIfYBAQCeAgAh9wFAAMgCACH4AUAAyAIAIfkBAQCeAgAh-gEBAJ4CACELBgAAoQIAICYAAMoCACAnAADKAgAgxgFAAAAAAccBQAAAAAXIAUAAAAAFyQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQADJAgAhCwYAAKECACAmAADKAgAgJwAAygIAIMYBQAAAAAHHAUAAAAAFyAFAAAAABckBQAAAAAHKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAyQIAIQjGAUAAAAABxwFAAAAABcgBQAAAAAXJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAAMoCACELvAEAAMsCADC9AQAAPAAQvgEAAMsCADC_AQEAkQIAIcUBQACTAgAh1gFAAJMCACHjAQEAkQIAIfEBQACTAgAh-wEBAJECACH8AQEAngIAIf0BAQCeAgAhEQEAALgCACC8AQAAzAIAML0BAAAiABC-AQAAzAIAML8BAQCvAgAhxQFAALACACHWAUAAsAIAIeMBAQCvAgAh8gEBAK8CACHzAQEArwIAIfQBAQC0AgAh9QEBALQCACH2AQEAtAIAIfcBQADNAgAh-AFAAM0CACH5AQEAtAIAIfoBAQC0AgAhCMYBQAAAAAHHAUAAAAAFyAFAAAAABckBQAAAAAHKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAygIAIQwBAAC4AgAgvAEAAM4CADC9AQAAHwAQvgEAAM4CADC_AQEArwIAIcUBQACwAgAh1gFAALACACHjAQEArwIAIfEBQACwAgAh-wEBAK8CACH8AQEAtAIAIf0BAQC0AgAhDQQAANACACAJAAC4AgAgCwAA0QIAILwBAADPAgAwvQEAABEAEL4BAADPAgAwvwEBAK8CACHAAQIAtgIAIcEBAQCvAgAhwgEBAK8CACHDAQEArwIAIcQBAQCvAgAhxQFAALACACETAQAAuAIAIAgAALECACANAAC5AgAgDgAAugIAIA8AALsCACC8AQAAswIAML0BAAADABC-AQAAswIAML8BAQCvAgAhxQFAALACACHWAUAAsAIAIeMBAQCvAgAh5AEBALQCACHlAQgAtQIAIeYBAgC2AgAh5wEIALUCACHoASAAtwIAIf8BAAADACCAAgAAAwAgEwQAANACACAJAAC4AgAgCgAA1QIAIAwAANYCACC8AQAA0gIAML0BAAAPABC-AQAA0gIAML8BAQCvAgAhwwEBAK8CACHFAUAAsAIAIdEBAQCvAgAh0gEBAK8CACHUAQAA0wLUASLVAQgAtQIAIdYBQACwAgAh1wEBALQCACHZAQAA1ALZASP_AQAADwAggAIAAA8AIBEEAADQAgAgCQAAuAIAIAoAANUCACAMAADWAgAgvAEAANICADC9AQAADwAQvgEAANICADC_AQEArwIAIcMBAQCvAgAhxQFAALACACHRAQEArwIAIdIBAQCvAgAh1AEAANMC1AEi1QEIALUCACHWAUAAsAIAIdcBAQC0AgAh2QEAANQC2QEjBMYBAAAA1AECxwEAAADUAQjIAQAAANQBCM0BAACnAtQBIgTGAQAAANkBA8cBAAAA2QEJyAEAAADZAQnNAQAAogLZASMPBAAA0AIAIAsAANgCACC8AQAA1wIAML0BAAALABC-AQAA1wIAML8BAQCvAgAhwgEBAK8CACHEAQEAtAIAIcUBQACwAgAh1gFAALACACHaAUAAsAIAIdsBQACwAgAh3AEgALcCACH_AQAACwAggAIAAAsAIA8EAADQAgAgCQAAuAIAIAsAANECACC8AQAAzwIAML0BAAARABC-AQAAzwIAML8BAQCvAgAhwAECALYCACHBAQEArwIAIcIBAQCvAgAhwwEBAK8CACHEAQEArwIAIcUBQACwAgAh_wEAABEAIIACAAARACANBAAA0AIAIAsAANgCACC8AQAA1wIAML0BAAALABC-AQAA1wIAML8BAQCvAgAhwgEBAK8CACHEAQEAtAIAIcUBQACwAgAh1gFAALACACHaAUAAsAIAIdsBQACwAgAh3AEgALcCACETBAAA0AIAIAkAALgCACAKAADVAgAgDAAA1gIAILwBAADSAgAwvQEAAA8AEL4BAADSAgAwvwEBAK8CACHDAQEArwIAIcUBQACwAgAh0QEBAK8CACHSAQEArwIAIdQBAADTAtQBItUBCAC1AgAh1gFAALACACHXAQEAtAIAIdkBAADUAtkBI_8BAAAPACCAAgAADwAgAsIBAQAAAAHdAQEAAAABBwQAANACACAHAADbAgAgvAEAANoCADC9AQAABQAQvgEAANoCADDCAQEArwIAId0BAQCvAgAhCwUAALECACC8AQAArgIAML0BAACiAQAQvgEAAK4CADC_AQEArwIAIcUBQACwAgAh1gFAALACACHeAQEArwIAId8BAQCvAgAh_wEAAKIBACCAAgAAogEAIAAAAAAAAYcCAQAAAAEFhwICAAAAAYoCAgAAAAGLAgIAAAABjAICAAAAAY0CAgAAAAEBhwJAAAAAAQUgAADzBAAgIQAA_AQAIIECAAD0BAAgggIAAPsEACCFAgAAhwEAIAUgAADxBAAgIQAA-QQAIIECAADyBAAgggIAAPgEACCFAgAAbgAgBSAAAO8EACAhAAD2BAAggQIAAPAEACCCAgAA9QQAIIUCAAAUACADIAAA8wQAIIECAAD0BAAghQIAAIcBACADIAAA8QQAIIECAADyBAAghQIAAG4AIAMgAADvBAAggQIAAPAEACCFAgAAFAAgAAAAAAAAAYcCAAAA1AECBYcCCAAAAAGKAggAAAABiwIIAAAAAYwCCAAAAAGNAggAAAABAYcCAQAAAAEBhwIAAADZAQMFIAAA5AQAICEAAO0EACCBAgAA5QQAIIICAADsBAAghQIAAG4AIAUgAADiBAAgIQAA6gQAIIECAADjBAAgggIAAOkEACCFAgAAhwEAIAUgAADgBAAgIQAA5wQAIIECAADhBAAgggIAAOYEACCFAgAADQAgByAAAPgCACAhAAD7AgAggQIAAPkCACCCAgAA-gIAIIMCAAARACCEAgAAEQAghQIAABcAIAgEAADnAgAgCQAA6AIAIL8BAQAAAAHAAQIAAAABwQEBAAAAAcIBAQAAAAHDAQEAAAABxQFAAAAAAQIAAAAXACAgAAD4AgAgAwAAABEAICAAAPgCACAhAAD8AgAgCgAAABEAIAQAAOQCACAJAADlAgAgGQAA_AIAIL8BAQDhAgAhwAECAOICACHBAQEA4QIAIcIBAQDhAgAhwwEBAOECACHFAUAA4wIAIQgEAADkAgAgCQAA5QIAIL8BAQDhAgAhwAECAOICACHBAQEA4QIAIcIBAQDhAgAhwwEBAOECACHFAUAA4wIAIQMgAADkBAAggQIAAOUEACCFAgAAbgAgAyAAAOIEACCBAgAA4wQAIIUCAACHAQAgAyAAAOAEACCBAgAA4QQAIIUCAAANACADIAAA-AIAIIECAAD5AgAghQIAABcAIAAAAAGHAiAAAAABBSAAANsEACAhAADeBAAggQIAANwEACCCAgAA3QQAIIUCAACHAQAgByAAAIcDACAhAACKAwAggQIAAIgDACCCAgAAiQMAIIMCAAAPACCEAgAADwAghQIAABQAIAwEAAD-AgAgCQAA_QIAIAwAAIADACC_AQEAAAABwwEBAAAAAcUBQAAAAAHRAQEAAAAB1AEAAADUAQLVAQgAAAAB1gFAAAAAAdcBAQAAAAHZAQAAANkBAwIAAAAUACAgAACHAwAgAwAAAA8AICAAAIcDACAhAACLAwAgDgAAAA8AIAQAAPUCACAJAAD0AgAgDAAA9wIAIBkAAIsDACC_AQEA4QIAIcMBAQDhAgAhxQFAAOMCACHRAQEA4QIAIdQBAADwAtQBItUBCADxAgAh1gFAAOMCACHXAQEA8gIAIdkBAADzAtkBIwwEAAD1AgAgCQAA9AIAIAwAAPcCACC_AQEA4QIAIcMBAQDhAgAhxQFAAOMCACHRAQEA4QIAIdQBAADwAtQBItUBCADxAgAh1gFAAOMCACHXAQEA8gIAIdkBAADzAtkBIwMgAADbBAAggQIAANwEACCFAgAAhwEAIAMgAACHAwAggQIAAIgDACCFAgAAFAAgAAAABSAAANMEACAhAADZBAAggQIAANQEACCCAgAA2AQAIIUCAACHAQAgBSAAANEEACAhAADWBAAggQIAANIEACCCAgAA1QQAIIUCAACfAQAgAyAAANMEACCBAgAA1AQAIIUCAACHAQAgAyAAANEEACCBAgAA0gQAIIUCAACfAQAgAAAACyAAAJkDADAhAACeAwAwgQIAAJoDADCCAgAAmwMAMIMCAACdAwAwhAIAAJ0DADCFAgAAnQMAMIYCAACcAwAghwIAAJ0DADCIAgAAnwMAMIkCAACgAwAwAgQAAJMDACDCAQEAAAABAgAAAAcAICAAAKQDACADAAAABwAgIAAApAMAICEAAKMDACABGQAA0AQAMAgEAADQAgAgBwAA2wIAILwBAADaAgAwvQEAAAUAEL4BAADaAgAwwgEBAK8CACHdAQEArwIAIf4BAADZAgAgAgAAAAcAIBkAAKMDACACAAAAoQMAIBkAAKIDACAFvAEAAKADADC9AQAAoQMAEL4BAACgAwAwwgEBAK8CACHdAQEArwIAIQW8AQAAoAMAML0BAAChAwAQvgEAAKADADDCAQEArwIAId0BAQCvAgAhAcIBAQDhAgAhAgQAAJEDACDCAQEA4QIAIQIEAACTAwAgwgEBAAAAAQQgAACZAwAwgQIAAJoDADCFAgAAnQMAMIYCAACcAwAgAAAAAAAABSAAAMcEACAhAADOBAAggQIAAMgEACCCAgAAzQQAIIUCAABuACALIAAA1QMAMCEAANkDADCBAgAA1gMAMIICAADXAwAwgwIAAJ0DADCEAgAAnQMAMIUCAACdAwAwhgIAANgDACCHAgAAnQMAMIgCAADaAwAwiQIAAKADADALIAAAyQMAMCEAAM4DADCBAgAAygMAMIICAADLAwAwgwIAAM0DADCEAgAAzQMAMIUCAADNAwAwhgIAAMwDACCHAgAAzQMAMIgCAADPAwAwiQIAANADADALIAAAvQMAMCEAAMIDADCBAgAAvgMAMIICAAC_AwAwgwIAAMEDADCEAgAAwQMAMIUCAADBAwAwhgIAAMADACCHAgAAwQMAMIgCAADDAwAwiQIAAMQDADALIAAAsQMAMCEAALYDADCBAgAAsgMAMIICAACzAwAwgwIAALUDADCEAgAAtQMAMIUCAAC1AwAwhgIAALQDACCHAgAAtQMAMIgCAAC3AwAwiQIAALgDADAICQAA6AIAIAsAAOkCACC_AQEAAAABwAECAAAAAcEBAQAAAAHDAQEAAAABxAEBAAAAAcUBQAAAAAECAAAAFwAgIAAAvAMAIAMAAAAXACAgAAC8AwAgIQAAuwMAIAEZAADMBAAwDQQAANACACAJAAC4AgAgCwAA0QIAILwBAADPAgAwvQEAABEAEL4BAADPAgAwvwEBAAAAAcABAgC2AgAhwQEBAK8CACHCAQEArwIAIcMBAQCvAgAhxAEBAAAAAcUBQACwAgAhAgAAABcAIBkAALsDACACAAAAuQMAIBkAALoDACAKvAEAALgDADC9AQAAuQMAEL4BAAC4AwAwvwEBAK8CACHAAQIAtgIAIcEBAQCvAgAhwgEBAK8CACHDAQEArwIAIcQBAQCvAgAhxQFAALACACEKvAEAALgDADC9AQAAuQMAEL4BAAC4AwAwvwEBAK8CACHAAQIAtgIAIcEBAQCvAgAhwgEBAK8CACHDAQEArwIAIcQBAQCvAgAhxQFAALACACEGvwEBAOECACHAAQIA4gIAIcEBAQDhAgAhwwEBAOECACHEAQEA4QIAIcUBQADjAgAhCAkAAOUCACALAADmAgAgvwEBAOECACHAAQIA4gIAIcEBAQDhAgAhwwEBAOECACHEAQEA4QIAIcUBQADjAgAhCAkAAOgCACALAADpAgAgvwEBAAAAAcABAgAAAAHBAQEAAAABwwEBAAAAAcQBAQAAAAHFAUAAAAABDAkAAP0CACAKAAD_AgAgDAAAgAMAIL8BAQAAAAHDAQEAAAABxQFAAAAAAdIBAQAAAAHUAQAAANQBAtUBCAAAAAHWAUAAAAAB1wEBAAAAAdkBAAAA2QEDAgAAABQAICAAAMgDACADAAAAFAAgIAAAyAMAICEAAMcDACABGQAAywQAMBEEAADQAgAgCQAAuAIAIAoAANUCACAMAADWAgAgvAEAANICADC9AQAADwAQvgEAANICADC_AQEAAAABwwEBAK8CACHFAUAAsAIAIdEBAQCvAgAh0gEBAAAAAdQBAADTAtQBItUBCAC1AgAh1gFAALACACHXAQEAtAIAIdkBAADUAtkBIwIAAAAUACAZAADHAwAgAgAAAMUDACAZAADGAwAgDbwBAADEAwAwvQEAAMUDABC-AQAAxAMAML8BAQCvAgAhwwEBAK8CACHFAUAAsAIAIdEBAQCvAgAh0gEBAK8CACHUAQAA0wLUASLVAQgAtQIAIdYBQACwAgAh1wEBALQCACHZAQAA1ALZASMNvAEAAMQDADC9AQAAxQMAEL4BAADEAwAwvwEBAK8CACHDAQEArwIAIcUBQACwAgAh0QEBAK8CACHSAQEArwIAIdQBAADTAtQBItUBCAC1AgAh1gFAALACACHXAQEAtAIAIdkBAADUAtkBIwm_AQEA4QIAIcMBAQDhAgAhxQFAAOMCACHSAQEA4QIAIdQBAADwAtQBItUBCADxAgAh1gFAAOMCACHXAQEA8gIAIdkBAADzAtkBIwwJAAD0AgAgCgAA9gIAIAwAAPcCACC_AQEA4QIAIcMBAQDhAgAhxQFAAOMCACHSAQEA4QIAIdQBAADwAtQBItUBCADxAgAh1gFAAOMCACHXAQEA8gIAIdkBAADzAtkBIwwJAAD9AgAgCgAA_wIAIAwAAIADACC_AQEAAAABwwEBAAAAAcUBQAAAAAHSAQEAAAAB1AEAAADUAQLVAQgAAAAB1gFAAAAAAdcBAQAAAAHZAQAAANkBAwgLAACNAwAgvwEBAAAAAcQBAQAAAAHFAUAAAAAB1gFAAAAAAdoBQAAAAAHbAUAAAAAB3AEgAAAAAQIAAAANACAgAADUAwAgAwAAAA0AICAAANQDACAhAADTAwAgARkAAMoEADANBAAA0AIAIAsAANgCACC8AQAA1wIAML0BAAALABC-AQAA1wIAML8BAQAAAAHCAQEArwIAIcQBAQAAAAHFAUAAsAIAIdYBQACwAgAh2gFAALACACHbAUAAsAIAIdwBIAC3AgAhAgAAAA0AIBkAANMDACACAAAA0QMAIBkAANIDACALvAEAANADADC9AQAA0QMAEL4BAADQAwAwvwEBAK8CACHCAQEArwIAIcQBAQC0AgAhxQFAALACACHWAUAAsAIAIdoBQACwAgAh2wFAALACACHcASAAtwIAIQu8AQAA0AMAML0BAADRAwAQvgEAANADADC_AQEArwIAIcIBAQCvAgAhxAEBALQCACHFAUAAsAIAIdYBQACwAgAh2gFAALACACHbAUAAsAIAIdwBIAC3AgAhB78BAQDhAgAhxAEBAPICACHFAUAA4wIAIdYBQADjAgAh2gFAAOMCACHbAUAA4wIAIdwBIACEAwAhCAsAAIYDACC_AQEA4QIAIcQBAQDyAgAhxQFAAOMCACHWAUAA4wIAIdoBQADjAgAh2wFAAOMCACHcASAAhAMAIQgLAACNAwAgvwEBAAAAAcQBAQAAAAHFAUAAAAAB1gFAAAAAAdoBQAAAAAHbAUAAAAAB3AEgAAAAAQIHAACUAwAg3QEBAAAAAQIAAAAHACAgAADdAwAgAwAAAAcAICAAAN0DACAhAADcAwAgARkAAMkEADACAAAABwAgGQAA3AMAIAIAAAChAwAgGQAA2wMAIAHdAQEA4QIAIQIHAACSAwAg3QEBAOECACECBwAAlAMAIN0BAQAAAAEDIAAAxwQAIIECAADIBAAghQIAAG4AIAQgAADVAwAwgQIAANYDADCFAgAAnQMAMIYCAADYAwAgBCAAAMkDADCBAgAAygMAMIUCAADNAwAwhgIAAMwDACAEIAAAvQMAMIECAAC-AwAwhQIAAMEDADCGAgAAwAMAIAQgAACxAwAwgQIAALIDADCFAgAAtQMAMIYCAAC0AwAgCA8AAOYDACAQAAClBAAgEQAA5QMAIBIAAKYEACATAACnBAAg1AEAAOoCACDqAQAA6gIAIO4BAADqAgAgAAAAAAAAAYcCAAAA2QECByAAAJsEACAhAACeBAAggQIAAJwEACCCAgAAnQQAIIMCAAADACCEAgAAAwAghQIAAIcBACALIAAAkgQAMCEAAJYEADCBAgAAkwQAMIICAACUBAAwgwIAAMEDADCEAgAAwQMAMIUCAADBAwAwhgIAAJUEACCHAgAAwQMAMIgCAACXBAAwiQIAAMQDADALIAAAiQQAMCEAAI0EADCBAgAAigQAMIICAACLBAAwgwIAALUDADCEAgAAtQMAMIUCAAC1AwAwhgIAAIwEACCHAgAAtQMAMIgCAACOBAAwiQIAALgDADALIAAA_QMAMCEAAIIEADCBAgAA_gMAMIICAAD_AwAwgwIAAIEEADCEAgAAgQQAMIUCAACBBAAwhgIAAIAEACCHAgAAgQQAMIgCAACDBAAwiQIAAIQEADALIAAA8AMAMCEAAPUDADCBAgAA8QMAMIICAADyAwAwgwIAAPQDADCEAgAA9AMAMIUCAAD0AwAwhgIAAPMDACCHAgAA9AMAMIgCAAD2AwAwiQIAAPcDADAMvwEBAAAAAcUBQAAAAAHWAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAH6AQEAAAABAgAAACQAICAAAPwDACADAAAAJAAgIAAA_AMAICEAAPsDACABGQAAxgQAMBEBAAC4AgAgvAEAAMwCADC9AQAAIgAQvgEAAMwCADC_AQEAAAABxQFAALACACHWAUAAsAIAIeMBAQCvAgAh8gEBAK8CACHzAQEArwIAIfQBAQC0AgAh9QEBALQCACH2AQEAtAIAIfcBQADNAgAh-AFAAM0CACH5AQEAtAIAIfoBAQC0AgAhAgAAACQAIBkAAPsDACACAAAA-AMAIBkAAPkDACAQvAEAAPcDADC9AQAA-AMAEL4BAAD3AwAwvwEBAK8CACHFAUAAsAIAIdYBQACwAgAh4wEBAK8CACHyAQEArwIAIfMBAQCvAgAh9AEBALQCACH1AQEAtAIAIfYBAQC0AgAh9wFAAM0CACH4AUAAzQIAIfkBAQC0AgAh-gEBALQCACEQvAEAAPcDADC9AQAA-AMAEL4BAAD3AwAwvwEBAK8CACHFAUAAsAIAIdYBQACwAgAh4wEBAK8CACHyAQEArwIAIfMBAQCvAgAh9AEBALQCACH1AQEAtAIAIfYBAQC0AgAh9wFAAM0CACH4AUAAzQIAIfkBAQC0AgAh-gEBALQCACEMvwEBAOECACHFAUAA4wIAIdYBQADjAgAh8gEBAOECACHzAQEA4QIAIfQBAQDyAgAh9QEBAPICACH2AQEA8gIAIfcBQAD6AwAh-AFAAPoDACH5AQEA8gIAIfoBAQDyAgAhAYcCQAAAAAEMvwEBAOECACHFAUAA4wIAIdYBQADjAgAh8gEBAOECACHzAQEA4QIAIfQBAQDyAgAh9QEBAPICACH2AQEA8gIAIfcBQAD6AwAh-AFAAPoDACH5AQEA8gIAIfoBAQDyAgAhDL8BAQAAAAHFAUAAAAAB1gFAAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wFAAAAAAfgBQAAAAAH5AQEAAAAB-gEBAAAAAQe_AQEAAAABxQFAAAAAAdYBQAAAAAHxAUAAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAABAgAAAAEAICAAAIgEACADAAAAAQAgIAAAiAQAICEAAIcEACABGQAAxQQAMAwBAAC4AgAgvAEAAM4CADC9AQAAHwAQvgEAAM4CADC_AQEAAAABxQFAALACACHWAUAAsAIAIeMBAQCvAgAh8QFAALACACH7AQEAAAAB_AEBALQCACH9AQEAtAIAIQIAAAABACAZAACHBAAgAgAAAIUEACAZAACGBAAgC7wBAACEBAAwvQEAAIUEABC-AQAAhAQAML8BAQCvAgAhxQFAALACACHWAUAAsAIAIeMBAQCvAgAh8QFAALACACH7AQEArwIAIfwBAQC0AgAh_QEBALQCACELvAEAAIQEADC9AQAAhQQAEL4BAACEBAAwvwEBAK8CACHFAUAAsAIAIdYBQACwAgAh4wEBAK8CACHxAUAAsAIAIfsBAQCvAgAh_AEBALQCACH9AQEAtAIAIQe_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHxAUAA4wIAIfsBAQDhAgAh_AEBAPICACH9AQEA8gIAIQe_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHxAUAA4wIAIfsBAQDhAgAh_AEBAPICACH9AQEA8gIAIQe_AQEAAAABxQFAAAAAAdYBQAAAAAHxAUAAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAABCAQAAOcCACALAADpAgAgvwEBAAAAAcABAgAAAAHBAQEAAAABwgEBAAAAAcQBAQAAAAHFAUAAAAABAgAAABcAICAAAJEEACADAAAAFwAgIAAAkQQAICEAAJAEACABGQAAxAQAMAIAAAAXACAZAACQBAAgAgAAALkDACAZAACPBAAgBr8BAQDhAgAhwAECAOICACHBAQEA4QIAIcIBAQDhAgAhxAEBAOECACHFAUAA4wIAIQgEAADkAgAgCwAA5gIAIL8BAQDhAgAhwAECAOICACHBAQEA4QIAIcIBAQDhAgAhxAEBAOECACHFAUAA4wIAIQgEAADnAgAgCwAA6QIAIL8BAQAAAAHAAQIAAAABwQEBAAAAAcIBAQAAAAHEAQEAAAABxQFAAAAAAQwEAAD-AgAgCgAA_wIAIAwAAIADACC_AQEAAAABxQFAAAAAAdEBAQAAAAHSAQEAAAAB1AEAAADUAQLVAQgAAAAB1gFAAAAAAdcBAQAAAAHZAQAAANkBAwIAAAAUACAgAACaBAAgAwAAABQAICAAAJoEACAhAACZBAAgARkAAMMEADACAAAAFAAgGQAAmQQAIAIAAADFAwAgGQAAmAQAIAm_AQEA4QIAIcUBQADjAgAh0QEBAOECACHSAQEA4QIAIdQBAADwAtQBItUBCADxAgAh1gFAAOMCACHXAQEA8gIAIdkBAADzAtkBIwwEAAD1AgAgCgAA9gIAIAwAAPcCACC_AQEA4QIAIcUBQADjAgAh0QEBAOECACHSAQEA4QIAIdQBAADwAtQBItUBCADxAgAh1gFAAOMCACHXAQEA8gIAIdkBAADzAtkBIwwEAAD-AgAgCgAA_wIAIAwAAIADACC_AQEAAAABxQFAAAAAAdEBAQAAAAHSAQEAAAAB1AEAAADUAQLVAQgAAAAB1gFAAAAAAdcBAQAAAAHZAQAAANkBAwwIAADfAwAgDQAA4AMAIA4AAOEDACAPAADiAwAgvwEBAAAAAcUBQAAAAAHWAUAAAAAB5AEBAAAAAeUBCAAAAAHmAQIAAAAB5wEIAAAAAegBIAAAAAECAAAAhwEAICAAAJsEACADAAAAAwAgIAAAmwQAICEAAJ8EACAOAAAAAwAgCAAArQMAIA0AAK4DACAOAACvAwAgDwAAsAMAIBkAAJ8EACC_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHkAQEA8gIAIeUBCADxAgAh5gECAOICACHnAQgA8QIAIegBIACEAwAhDAgAAK0DACANAACuAwAgDgAArwMAIA8AALADACC_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHkAQEA8gIAIeUBCADxAgAh5gECAOICACHnAQgA8QIAIegBIACEAwAhAyAAAJsEACCBAgAAnAQAIIUCAACHAQAgBCAAAJIEADCBAgAAkwQAMIUCAADBAwAwhgIAAJUEACAEIAAAiQQAMIECAACKBAAwhQIAALUDADCGAgAAjAQAIAQgAAD9AwAwgQIAAP4DADCFAgAAgQQAMIYCAACABAAgBCAAAPADADCBAgAA8QMAMIUCAAD0AwAwhgIAAPMDACAGAQAA4wMAIAgAAKYDACANAADkAwAgDgAA5QMAIA8AAOYDACDkAQAA6gIAIAAAAAAAAAAABSAAAL4EACAhAADBBAAggQIAAL8EACCCAgAAwAQAIIUCAABuACADIAAAvgQAIIECAAC_BAAghQIAAG4AIAAAAAUgAAC5BAAgIQAAvAQAIIECAAC6BAAgggIAALsEACCFAgAAbgAgAyAAALkEACCBAgAAugQAIIUCAABuACAGBAAApQQAIAkAAOMDACAKAAC2BAAgDAAAtwQAINcBAADqAgAg2QEAAOoCACADBAAApQQAIAsAALUEACDEAQAA6gIAIAMEAAClBAAgCQAA4wMAIAsAALUEACABBQAApgMAIA8PAACiBAAgEAAAoAQAIBEAAKEEACATAACkBAAgvwEBAAAAAcUBQAAAAAHUAQEAAAAB1gFAAAAAAd4BAQAAAAHpAQEAAAAB6gEBAAAAAesBIAAAAAHsAQAAANkBAu0BIAAAAAHuAQEAAAABAgAAAG4AICAAALkEACADAAAAcQAgIAAAuQQAICEAAL0EACARAAAAcQAgDwAA7QMAIBAAAOsDACARAADsAwAgEwAA7wMAIBkAAL0EACC_AQEA4QIAIcUBQADjAgAh1AEBAPICACHWAUAA4wIAId4BAQDhAgAh6QEBAOECACHqAQEA8gIAIesBIACEAwAh7AEAAOoD2QEi7QEgAIQDACHuAQEA8gIAIQ8PAADtAwAgEAAA6wMAIBEAAOwDACATAADvAwAgvwEBAOECACHFAUAA4wIAIdQBAQDyAgAh1gFAAOMCACHeAQEA4QIAIekBAQDhAgAh6gEBAPICACHrASAAhAMAIewBAADqA9kBIu0BIACEAwAh7gEBAPICACEPDwAAogQAIBAAAKAEACARAAChBAAgEgAAowQAIL8BAQAAAAHFAUAAAAAB1AEBAAAAAdYBQAAAAAHeAQEAAAAB6QEBAAAAAeoBAQAAAAHrASAAAAAB7AEAAADZAQLtASAAAAAB7gEBAAAAAQIAAABuACAgAAC-BAAgAwAAAHEAICAAAL4EACAhAADCBAAgEQAAAHEAIA8AAO0DACAQAADrAwAgEQAA7AMAIBIAAO4DACAZAADCBAAgvwEBAOECACHFAUAA4wIAIdQBAQDyAgAh1gFAAOMCACHeAQEA4QIAIekBAQDhAgAh6gEBAPICACHrASAAhAMAIewBAADqA9kBIu0BIACEAwAh7gEBAPICACEPDwAA7QMAIBAAAOsDACARAADsAwAgEgAA7gMAIL8BAQDhAgAhxQFAAOMCACHUAQEA8gIAIdYBQADjAgAh3gEBAOECACHpAQEA4QIAIeoBAQDyAgAh6wEgAIQDACHsAQAA6gPZASLtASAAhAMAIe4BAQDyAgAhCb8BAQAAAAHFAUAAAAAB0QEBAAAAAdIBAQAAAAHUAQAAANQBAtUBCAAAAAHWAUAAAAAB1wEBAAAAAdkBAAAA2QEDBr8BAQAAAAHAAQIAAAABwQEBAAAAAcIBAQAAAAHEAQEAAAABxQFAAAAAAQe_AQEAAAABxQFAAAAAAdYBQAAAAAHxAUAAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAABDL8BAQAAAAHFAUAAAAAB1gFAAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wFAAAAAAfgBQAAAAAH5AQEAAAAB-gEBAAAAAQ8PAACiBAAgEQAAoQQAIBIAAKMEACATAACkBAAgvwEBAAAAAcUBQAAAAAHUAQEAAAAB1gFAAAAAAd4BAQAAAAHpAQEAAAAB6gEBAAAAAesBIAAAAAHsAQAAANkBAu0BIAAAAAHuAQEAAAABAgAAAG4AICAAAMcEACAB3QEBAAAAAQe_AQEAAAABxAEBAAAAAcUBQAAAAAHWAUAAAAAB2gFAAAAAAdsBQAAAAAHcASAAAAABCb8BAQAAAAHDAQEAAAABxQFAAAAAAdIBAQAAAAHUAQAAANQBAtUBCAAAAAHWAUAAAAAB1wEBAAAAAdkBAAAA2QEDBr8BAQAAAAHAAQIAAAABwQEBAAAAAcMBAQAAAAHEAQEAAAABxQFAAAAAAQMAAABxACAgAADHBAAgIQAAzwQAIBEAAABxACAPAADtAwAgEQAA7AMAIBIAAO4DACATAADvAwAgGQAAzwQAIL8BAQDhAgAhxQFAAOMCACHUAQEA8gIAIdYBQADjAgAh3gEBAOECACHpAQEA4QIAIeoBAQDyAgAh6wEgAIQDACHsAQAA6gPZASLtASAAhAMAIe4BAQDyAgAhDw8AAO0DACARAADsAwAgEgAA7gMAIBMAAO8DACC_AQEA4QIAIcUBQADjAgAh1AEBAPICACHWAUAA4wIAId4BAQDhAgAh6QEBAOECACHqAQEA8gIAIesBIACEAwAh7AEAAOoD2QEi7QEgAIQDACHuAQEA8gIAIQHCAQEAAAABBb8BAQAAAAHFAUAAAAAB1gFAAAAAAd4BAQAAAAHfAQEAAAABAgAAAJ8BACAgAADRBAAgDQEAAN4DACANAADgAwAgDgAA4QMAIA8AAOIDACC_AQEAAAABxQFAAAAAAdYBQAAAAAHjAQEAAAAB5AEBAAAAAeUBCAAAAAHmAQIAAAAB5wEIAAAAAegBIAAAAAECAAAAhwEAICAAANMEACADAAAAogEAICAAANEEACAhAADXBAAgBwAAAKIBACAZAADXBAAgvwEBAOECACHFAUAA4wIAIdYBQADjAgAh3gEBAOECACHfAQEA4QIAIQW_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHeAQEA4QIAId8BAQDhAgAhAwAAAAMAICAAANMEACAhAADaBAAgDwAAAAMAIAEAAKwDACANAACuAwAgDgAArwMAIA8AALADACAZAADaBAAgvwEBAOECACHFAUAA4wIAIdYBQADjAgAh4wEBAOECACHkAQEA8gIAIeUBCADxAgAh5gECAOICACHnAQgA8QIAIegBIACEAwAhDQEAAKwDACANAACuAwAgDgAArwMAIA8AALADACC_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHjAQEA4QIAIeQBAQDyAgAh5QEIAPECACHmAQIA4gIAIecBCADxAgAh6AEgAIQDACENAQAA3gMAIAgAAN8DACAOAADhAwAgDwAA4gMAIL8BAQAAAAHFAUAAAAAB1gFAAAAAAeMBAQAAAAHkAQEAAAAB5QEIAAAAAeYBAgAAAAHnAQgAAAAB6AEgAAAAAQIAAACHAQAgIAAA2wQAIAMAAAADACAgAADbBAAgIQAA3wQAIA8AAAADACABAACsAwAgCAAArQMAIA4AAK8DACAPAACwAwAgGQAA3wQAIL8BAQDhAgAhxQFAAOMCACHWAUAA4wIAIeMBAQDhAgAh5AEBAPICACHlAQgA8QIAIeYBAgDiAgAh5wEIAPECACHoASAAhAMAIQ0BAACsAwAgCAAArQMAIA4AAK8DACAPAACwAwAgvwEBAOECACHFAUAA4wIAIdYBQADjAgAh4wEBAOECACHkAQEA8gIAIeUBCADxAgAh5gECAOICACHnAQgA8QIAIegBIACEAwAhCQQAAIwDACC_AQEAAAABwgEBAAAAAcQBAQAAAAHFAUAAAAAB1gFAAAAAAdoBQAAAAAHbAUAAAAAB3AEgAAAAAQIAAAANACAgAADgBAAgDQEAAN4DACAIAADfAwAgDQAA4AMAIA8AAOIDACC_AQEAAAABxQFAAAAAAdYBQAAAAAHjAQEAAAAB5AEBAAAAAeUBCAAAAAHmAQIAAAAB5wEIAAAAAegBIAAAAAECAAAAhwEAICAAAOIEACAPDwAAogQAIBAAAKAEACASAACjBAAgEwAApAQAIL8BAQAAAAHFAUAAAAAB1AEBAAAAAdYBQAAAAAHeAQEAAAAB6QEBAAAAAeoBAQAAAAHrASAAAAAB7AEAAADZAQLtASAAAAAB7gEBAAAAAQIAAABuACAgAADkBAAgAwAAAAsAICAAAOAEACAhAADoBAAgCwAAAAsAIAQAAIUDACAZAADoBAAgvwEBAOECACHCAQEA4QIAIcQBAQDyAgAhxQFAAOMCACHWAUAA4wIAIdoBQADjAgAh2wFAAOMCACHcASAAhAMAIQkEAACFAwAgvwEBAOECACHCAQEA4QIAIcQBAQDyAgAhxQFAAOMCACHWAUAA4wIAIdoBQADjAgAh2wFAAOMCACHcASAAhAMAIQMAAAADACAgAADiBAAgIQAA6wQAIA8AAAADACABAACsAwAgCAAArQMAIA0AAK4DACAPAACwAwAgGQAA6wQAIL8BAQDhAgAhxQFAAOMCACHWAUAA4wIAIeMBAQDhAgAh5AEBAPICACHlAQgA8QIAIeYBAgDiAgAh5wEIAPECACHoASAAhAMAIQ0BAACsAwAgCAAArQMAIA0AAK4DACAPAACwAwAgvwEBAOECACHFAUAA4wIAIdYBQADjAgAh4wEBAOECACHkAQEA8gIAIeUBCADxAgAh5gECAOICACHnAQgA8QIAIegBIACEAwAhAwAAAHEAICAAAOQEACAhAADuBAAgEQAAAHEAIA8AAO0DACAQAADrAwAgEgAA7gMAIBMAAO8DACAZAADuBAAgvwEBAOECACHFAUAA4wIAIdQBAQDyAgAh1gFAAOMCACHeAQEA4QIAIekBAQDhAgAh6gEBAPICACHrASAAhAMAIewBAADqA9kBIu0BIACEAwAh7gEBAPICACEPDwAA7QMAIBAAAOsDACASAADuAwAgEwAA7wMAIL8BAQDhAgAhxQFAAOMCACHUAQEA8gIAIdYBQADjAgAh3gEBAOECACHpAQEA4QIAIeoBAQDyAgAh6wEgAIQDACHsAQAA6gPZASLtASAAhAMAIe4BAQDyAgAhDQQAAP4CACAJAAD9AgAgCgAA_wIAIL8BAQAAAAHDAQEAAAABxQFAAAAAAdEBAQAAAAHSAQEAAAAB1AEAAADUAQLVAQgAAAAB1gFAAAAAAdcBAQAAAAHZAQAAANkBAwIAAAAUACAgAADvBAAgDxAAAKAEACARAAChBAAgEgAAowQAIBMAAKQEACC_AQEAAAABxQFAAAAAAdQBAQAAAAHWAUAAAAAB3gEBAAAAAekBAQAAAAHqAQEAAAAB6wEgAAAAAewBAAAA2QEC7QEgAAAAAe4BAQAAAAECAAAAbgAgIAAA8QQAIA0BAADeAwAgCAAA3wMAIA0AAOADACAOAADhAwAgvwEBAAAAAcUBQAAAAAHWAUAAAAAB4wEBAAAAAeQBAQAAAAHlAQgAAAAB5gECAAAAAecBCAAAAAHoASAAAAABAgAAAIcBACAgAADzBAAgAwAAAA8AICAAAO8EACAhAAD3BAAgDwAAAA8AIAQAAPUCACAJAAD0AgAgCgAA9gIAIBkAAPcEACC_AQEA4QIAIcMBAQDhAgAhxQFAAOMCACHRAQEA4QIAIdIBAQDhAgAh1AEAAPAC1AEi1QEIAPECACHWAUAA4wIAIdcBAQDyAgAh2QEAAPMC2QEjDQQAAPUCACAJAAD0AgAgCgAA9gIAIL8BAQDhAgAhwwEBAOECACHFAUAA4wIAIdEBAQDhAgAh0gEBAOECACHUAQAA8ALUASLVAQgA8QIAIdYBQADjAgAh1wEBAPICACHZAQAA8wLZASMDAAAAcQAgIAAA8QQAICEAAPoEACARAAAAcQAgEAAA6wMAIBEAAOwDACASAADuAwAgEwAA7wMAIBkAAPoEACC_AQEA4QIAIcUBQADjAgAh1AEBAPICACHWAUAA4wIAId4BAQDhAgAh6QEBAOECACHqAQEA8gIAIesBIACEAwAh7AEAAOoD2QEi7QEgAIQDACHuAQEA8gIAIQ8QAADrAwAgEQAA7AMAIBIAAO4DACATAADvAwAgvwEBAOECACHFAUAA4wIAIdQBAQDyAgAh1gFAAOMCACHeAQEA4QIAIekBAQDhAgAh6gEBAPICACHrASAAhAMAIewBAADqA9kBIu0BIACEAwAh7gEBAPICACEDAAAAAwAgIAAA8wQAICEAAP0EACAPAAAAAwAgAQAArAMAIAgAAK0DACANAACuAwAgDgAArwMAIBkAAP0EACC_AQEA4QIAIcUBQADjAgAh1gFAAOMCACHjAQEA4QIAIeQBAQDyAgAh5QEIAPECACHmAQIA4gIAIecBCADxAgAh6AEgAIQDACENAQAArAMAIAgAAK0DACANAACuAwAgDgAArwMAIL8BAQDhAgAhxQFAAOMCACHWAUAA4wIAIeMBAQDhAgAh5AEBAPICACHlAQgA8QIAIeYBAgDiAgAh5wEIAPECACHoASAAhAMAIQEBAAIGBgAMDx4JEAQDER0IEiEBEyULBgEAAgYACggIBA0OBw4VCA8YCQIEAAMHAAUCBQkEBgAGAQUKAAIEAAMLEAgEBAADCQACCgAHDBIJAwQAAwkAAgsACAQIGQANGgAOGwAPHAABAQACBA8nABEmABIoABMpAAABAQACAQEAAgMGABEmABInABMAAAADBgARJgASJwATAQEAAgEBAAIDBgAYJgAZJwAaAAAAAwYAGCYAGScAGgAAAAMGACAmACEnACIAAAADBgAgJgAhJwAiAAADBgAnJgAoJwApAAAAAwYAJyYAKCcAKQEBAAIBAQACBQYALiYAMScAMmgAL2kAMAAAAAAABQYALiYAMScAMmgAL2kAMAAAAwYANyYAOCcAOQAAAAMGADcmADgnADkCBAADBwAFAgQAAwcABQMGAD4mAD8nAEAAAAADBgA-JgA_JwBAAQQAAwEEAAMDBgBFJgBGJwBHAAAAAwYARSYARicARwMEAAMJAAIKAAcDBAADCQACCgAHBQYATCYATycAUGgATWkATgAAAAAABQYATCYATycAUGgATWkATgMEAAMJAAILAAgDBAADCQACCwAIBQYAVSYAWCcAWWgAVmkAVwAAAAAABQYAVSYAWCcAWWgAVmkAVxQCARUqARYrARcsARgtARovARsxDRwyDh00AR42DR83DyI4ASM5ASQ6DSg9ECk-FCo_CytACyxBCy1CCy5DCy9FCzBHDTFIFTJKCzNMDTRNFjVOCzZPCzdQDThTFzlUGzpWHDtXHDxaHD1bHD5cHD9eHEBgDUFhHUJjHENlDURmHkVnHEZoHEdpDUhsH0ltI0pvAktwAkxzAk10Ak51Ak93AlB5DVF6JFJ8AlN-DVR_JVWAAQJWgQECV4IBDViFASZZhgEqWogBA1uJAQNciwEDXYwBA16NAQNfjwEDYJEBDWGSAStilAEDY5YBDWSXASxlmAEDZpkBA2eaAQ1qnQEta54BM2ygAQVtoQEFbqQBBW-lAQVwpgEFcagBBXKqAQ1zqwE0dK0BBXWvAQ12sAE1d7EBBXiyAQV5swENerYBNnu3ATp8uAEEfbkBBH66AQR_uwEEgAG8AQSBAb4BBIIBwAENgwHBATuEAcMBBIUBxQENhgHGATyHAccBBIgByAEEiQHJAQ2KAcwBPYsBzQFBjAHOAQeNAc8BB44B0AEHjwHRAQeQAdIBB5EB1AEHkgHWAQ2TAdcBQpQB2QEHlQHbAQ2WAdwBQ5cB3QEHmAHeAQeZAd8BDZoB4gFEmwHjAUicAeQBCJ0B5QEIngHmAQifAecBCKAB6AEIoQHqAQiiAewBDaMB7QFJpAHvAQilAfEBDaYB8gFKpwHzAQioAfQBCKkB9QENqgH4AUurAfkBUawB-gEJrQH7AQmuAfwBCa8B_QEJsAH-AQmxAYACCbIBggINswGDAlK0AYUCCbUBhwINtgGIAlO3AYkCCbgBigIJuQGLAg26AY4CVLsBjwJa"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  STUDENT: "STUDENT",
  TUTOR: "TUTOR",
  ADMIN: "ADMIN"
};
var BookingStatus = {
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [
    "https://skill-bridge-web-client.vercel.app",
    "http://localhost:3000"
  ],
  endpoints: {
    signUp: "/api/auth/sign-up",
    signIn: "/api/auth/sign-in",
    signOut: "/api/auth/sign-out",
    session: "/api/auth/session"
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Please verify your email",
          html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .header {
      background-color: #0f172a;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
    }

    .content {
      padding: 30px;
      color: #334155;
      line-height: 1.6;
    }

    .content h2 {
      margin-top: 0;
      font-size: 20px;
      color: #0f172a;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .verify-button {
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 6px;
      display: inline-block;
    }

    .verify-button:hover {
      background-color: #1d4ed8;
    }

    .footer {
      background-color: #f1f5f9;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
    }

    .link {
      word-break: break-all;
      font-size: 13px;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Prisma Blog</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>
        Hello ${user.name} <br /><br />
        Thank you for registering on <strong>Prisma Blog</strong>.
        Please confirm your email address to activate your account.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn\u2019t work, copy and paste the link below into your browser:
      </p>

      <p class="link">
        ${url}
      </p>

      <p>
        This verification link will expire soon for security reasons.
        If you did not create an account, you can safely ignore this email.
      </p>

      <p>
        Regards, <br />
        <strong>Prisma Blog Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      \xA9 2025 Prisma Blog. All rights reserved.
    </div>
  </div>
</body>
</html>
`
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  user: {
    modelName: "User",
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: true,
        input: true
      },
      phone: {
        type: "string",
        required: false
      },
      isBanned: {
        type: "boolean",
        defaultValue: false,
        required: true
      }
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          const allowedRole = [Role.STUDENT, Role.TUTOR];
          let inputRole = user.role?.toUpperCase();
          const role = inputRole && allowedRole.includes(inputRole) ? inputRole : Role.STUDENT;
          return {
            data: {
              ...user,
              role
            }
          };
        }
      }
    }
  }
});

// src/middleware/globalErrorHandler.ts
var errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message
  });
};

// src/app.ts
import cors from "cors";

// src/modules/tutor/tutor.router.ts
import { Router } from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// src/utils/apiError.ts
var ApiError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
};

// src/utils/requireRole.ts
var requireRole = (req, role) => {
  const user = req.user;
  if (!user || user.role !== role) {
    throw new ApiError(403, "Forbidden");
  }
  return user;
};

// src/modules/tutor/tutor.service.ts
var getAllTutor = async (query) => {
  const { category, minPrice, maxPrice, rating, featured } = query;
  const priceFilter = {};
  if (minPrice) {
    priceFilter.gte = Number(minPrice);
  }
  if (maxPrice) {
    priceFilter.lte = Number(maxPrice);
  }
  const options = {
    where: {
      isApproved: true,
      ...Object.keys(priceFilter).length && {
        hourlyRate: priceFilter
      },
      ...rating && {
        avgRating: { gte: Number(rating) }
      },
      ...category && {
        tutorCategories: {
          some: {
            category: { slug: category }
          }
        }
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      tutorCategories: {
        include: {
          category: true
        }
      }
    }
  };
  if (featured) {
    options.orderBy = { avgRating: "desc" };
    options.take = 4;
  }
  return prisma.tutorProfile.findMany(options);
};
var getSingleTutor = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      tutorCategories: {
        include: { category: true }
      },
      availabilities: {
        where: { isBooked: false },
        orderBy: { startTime: "asc" }
      },
      reviews: {
        include: {
          student: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });
  if (!tutor || !tutor.isApproved) {
    throw new ApiError(404, "Tutor not found");
  }
  return tutor;
};
var geTutorReviews = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id }
  });
  if (!tutorProfile) {
    throw new ApiError(404, "Tutor profile not found");
  }
  const review = await prisma.review.findMany({
    where: { tutorId: tutorProfile.id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const transformedReviews = review.map((review2) => ({
    id: review2.id,
    rating: review2.rating,
    comment: review2.comment,
    createdAt: review2.createdAt,
    student: {
      id: review2.student.id,
      name: review2.student.name,
      image: review2.student.image
    }
  }));
  return transformedReviews;
};
var getMySessions = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  return prisma.booking.findMany({
    where: {
      tutor: {
        userId: user.id
      }
    },
    include: {
      student: true,
      availability: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateSessionStatus = async (req, bookingId) => {
  const user = requireRole(req, Role.TUTOR);
  const { status } = req.body;
  if (![BookingStatus.COMPLETED, BookingStatus.NO_SHOW].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutor: true
      }
    });
    if (!booking || booking.tutor.userId !== user.id) {
      throw new ApiError(403, "Not allowed to update this booking");
    }
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new ApiError(400, "Only confirmed bookings can be updated");
    }
    const updateBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status }
    });
    if (status === BookingStatus.NO_SHOW) {
      await tx.availability.update({
        where: { id: booking.availabilityId },
        data: {
          isBooked: false,
          bookingId: null
        }
      });
    }
    return updateBooking;
  });
};
var getTutorDashboard = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id }
  });
  if (!tutorProfile) {
    throw new ApiError(404, "Tutor profile not found");
  }
  const [totalSessions, upComingSessions, completedSessions, recentReviews] = await Promise.all([
    prisma.booking.count({
      where: { tutorProfileId: tutorProfile.id }
    }),
    prisma.booking.count({
      where: {
        tutorProfileId: tutorProfile.id,
        status: BookingStatus.CONFIRMED,
        availability: { startTime: { gt: /* @__PURE__ */ new Date() } }
      }
    }),
    prisma.booking.count({
      where: {
        tutorProfileId: tutorProfile.id,
        status: BookingStatus.COMPLETED
      }
    }),
    prisma.review.findMany({
      where: {
        tutorId: tutorProfile.id
      },
      include: { student: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);
  return {
    stats: {
      totalSessions,
      upComingSessions,
      completedSessions,
      avgRating: tutorProfile.avgRating
    },
    recentReviews
  };
};
var tutorService = {
  getAllTutor,
  getSingleTutor,
  getMySessions,
  updateSessionStatus,
  getTutorDashboard,
  geTutorReviews
};

// src/modules/tutor/tutor.controller.ts
var getAllTutor2 = catchAsync(async (req, res) => {
  const result = await tutorService.getAllTutor(req.query);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getSingleTutor2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await tutorService.getSingleTutor(id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getMySession = catchAsync(async (req, res) => {
  const result = await tutorService.getMySessions(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateSessionStatus2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await tutorService.updateSessionStatus(req, id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getTutorDashboard2 = catchAsync(async (req, res) => {
  const result = await tutorService.getTutorDashboard(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getTutorReviews = catchAsync(async (req, res) => {
  const result = await tutorService.geTutorReviews(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var tutorController = {
  getAllTutor: getAllTutor2,
  getSingleTutor: getSingleTutor2,
  getMySession,
  updateSessionStatus: updateSessionStatus2,
  getTutorDashboard: getTutorDashboard2,
  getTutorReviews
};

// src/middleware/auth.middleware.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session || !session.user) {
        throw new ApiError(401, "You are not authorized, please login.");
      }
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          isBanned: true
        }
      });
      if (!user) {
        throw new ApiError(404, "User not found in database");
      }
      if (user.isBanned) {
        throw new ApiError(
          403,
          "Your account has been banned. Contact support."
        );
      }
      const isTutorProfileCreation = req.method === "POST" && (req.originalUrl === "/api/v1/tutor/profile" || req.originalUrl.includes("/api/v1/tutor/profile") && req.path === "" || req.path === "/" && req.baseUrl === "/api/v1/tutor/profile");
      if (user.role === Role.TUTOR && !isTutorProfileCreation) {
        const tutor = await prisma.tutorProfile.findUnique({
          where: { userId: user.id }
        });
        if (!tutor) {
          if (roles.includes(Role.ADMIN)) {
            console.log("Admin accessing - skipping tutor profile check");
          } else {
            throw new ApiError(403, "Please complete your tutor profile first");
          }
        }
        if (tutor && !tutor.isApproved) {
          if (roles.includes(Role.ADMIN)) {
            console.log("Admin accessing - skipping tutor approval check");
          } else {
            const allowedRoutes = ["/availability", "/profile"];
            const isAllowedRoute = allowedRoutes.some(
              (route) => req.originalUrl.includes(route)
            );
            if (!isAllowedRoute) {
              throw new ApiError(
                403,
                "Your tutor profile is pending admin approval"
              );
            }
          }
        }
      }
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: session.user.emailVerified,
        isBanned: user.isBanned
      };
      if (roles.length > 0) {
        if (!roles.includes(req.user.role)) {
          throw new ApiError(
            403,
            `Access denied. Required role: ${roles.join(", ")}. Your role: ${req.user.role}`
          );
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var auth_middleware_default = auth2;

// src/modules/tutor/tutor.router.ts
var router = Router();
router.get("/", tutorController.getAllTutor);
router.get("/me/bookings", auth_middleware_default(Role.TUTOR), tutorController.getMySession);
router.get("/dashboard", auth_middleware_default(Role.TUTOR), tutorController.getTutorDashboard);
router.get("/me/reviews", auth_middleware_default(Role.TUTOR), tutorController.getTutorReviews);
router.patch(
  "/bookings/:id/status",
  auth_middleware_default(Role.TUTOR),
  tutorController.updateSessionStatus
);
router.get("/:id", tutorController.getSingleTutor);
var tutorRouter = router;

// src/modules/booking/booking.router.ts
import { Router as Router2 } from "express";

// src/utils/authUser.ts
var getAuthUser = async (req) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  if (!session || !session.user) {
    throw new ApiError(401, "You are not authorize. please login");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      isBanned: true
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found in database");
  }
  if (user.isBanned) {
    throw new ApiError(
      403,
      "Your account has been banned. Please Contact Support."
    );
  }
  if (!user.emailVerified) {
    throw new ApiError(
      403,
      "Email verification required. Please verify your email"
    );
  }
  return user;
};

// src/modules/booking/booking.service.ts
var createBooking = async (req) => {
  const user = await getAuthUser(req);
  if (user.role !== Role.STUDENT) {
    throw new ApiError(403, "Only student can book session");
  }
  const { availabilityId } = req.body;
  return prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUnique({
      where: { id: availabilityId }
    });
    if (!availability || availability.isBooked) {
      throw new ApiError(400, "Slot is no available");
    }
    const tutor = await tx.tutorProfile.findUnique({
      where: { id: availability.tutorId }
    });
    if (!tutor || !tutor.isApproved) {
      throw new ApiError(404, "Tutor not available");
    }
    if (availability.tutorId !== tutor.id) {
      throw new ApiError(400, "Invalid availability");
    }
    const booking = await tx.booking.create({
      data: {
        studentId: user.id,
        tutorProfileId: availability.tutorId,
        availabilityId: availability.id,
        priceSnapshot: tutor.hourlyRate,
        status: BookingStatus.CONFIRMED
      }
    });
    await tx.availability.update({
      where: { id: availability.id },
      data: {
        isBooked: true,
        bookingId: booking.id
      }
    });
    return booking;
  });
};
var getMyBooking = async (req) => {
  const user = await getAuthUser(req);
  return prisma.booking.findMany({
    where: {
      studentId: user.id
    },
    include: {
      tutor: {
        include: {
          user: true
        }
      },
      availability: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var cancelBooking = async (req, bookingId) => {
  const user = await getAuthUser(req);
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { availability: true }
    });
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }
    if (booking.studentId !== user.id && user.role !== Role.ADMIN) {
      throw new ApiError(403, "Not allowed to cancel");
    }
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new ApiError(400, "Booking can't be cancelled");
    }
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledBy: user.role
      }
    });
    await tx.availability.update({
      where: { id: booking.availabilityId },
      data: {
        isBooked: false,
        bookingId: null
      }
    });
    return { message: "Booking cancelled" };
  });
};
var bookingService = { createBooking, getMyBooking, cancelBooking };

// src/modules/booking/booking.controller.ts
var createBooking2 = catchAsync(async (req, res) => {
  const result = await bookingService.createBooking(req);
  res.status(201).json({
    success: true,
    data: result
  });
});
var getMyBooking2 = catchAsync(async (req, res) => {
  const result = await bookingService.getMyBooking(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var cancelBooking2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.cancelBooking(req, id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var bookingController = {
  createBooking: createBooking2,
  getMyBooking: getMyBooking2,
  cancelBooking: cancelBooking2
};

// src/modules/booking/booking.router.ts
var router2 = Router2();
router2.use(auth_middleware_default());
router2.post("/", bookingController.createBooking);
router2.get("/me", bookingController.getMyBooking);
router2.patch("/:id/cancel", bookingController.cancelBooking);
var bookingRouter = router2;

// src/modules/availability/availability.router.ts
import { Router as Router3 } from "express";

// src/modules/availability/availability.service.ts
var createAvailability = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  const { startTime, endTime } = req.body;
  if (!startTime || !endTime) {
    throw new ApiError(400, "startTime and endTime required");
  }
  if (new Date(startTime) >= new Date(endTime)) {
    throw new ApiError(400, "Invalid time range");
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id }
  });
  if (!tutorProfile) {
    throw new ApiError(404, "Tutor not found");
  }
  const clash = await prisma.availability.findFirst({
    where: {
      tutorId: tutorProfile.id,
      startTime: { lt: new Date(endTime) },
      endTime: { gt: new Date(startTime) }
    }
  });
  if (clash) {
    throw new ApiError(400, "Time slot overlaps with existing availability");
  }
  return prisma.availability.create({
    data: {
      tutorId: tutorProfile.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    }
  });
};
var getMyAvailability = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id }
  });
  if (!tutorProfile) {
    throw new ApiError(404, "tutor profile not found");
  }
  return prisma.availability.findMany({
    where: {
      tutorId: tutorProfile.id
    },
    orderBy: { startTime: "asc" }
  });
};
var updateAvailability = async (req, availabilityId) => {
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
  if (newStart < /* @__PURE__ */ new Date()) {
    throw new ApiError(400, "Can't set availability in the past");
  }
  return prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUnique({
      where: { id: availabilityId },
      include: {
        tutor: true
      }
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
        endTime: { gt: newStart }
      }
    });
    if (clash) {
      throw new ApiError(400, "Time slot overlaps with existing availability");
    }
    return tx.availability.update({
      where: { id: availabilityId },
      data: {
        startTime: newStart,
        endTime: newEnd
      }
    });
  });
};
var deleteAvailability = async (req, availabilityId) => {
  const user = requireRole(req, Role.TUTOR);
  return prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUnique({
      where: { id: availabilityId },
      include: {
        tutor: true
      }
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
      where: { id: availabilityId }
    });
    return { message: "Availability deleted successfully" };
  });
};
var getTutorBookedSessions = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id }
  });
  if (!tutorProfile) {
    throw new ApiError(404, "Tutor profile not found");
  }
  return prisma.availability.findMany({
    where: {
      tutorId: tutorProfile.id,
      isBooked: true,
      booking: {
        status: "CONFIRMED"
      }
    },
    include: {
      booking: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: {
      startTime: "asc"
    }
  });
};
var availabilityService = {
  createAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability,
  getTutorBookedSessions
};

// src/modules/availability/availability.controller.ts
var createAvailability2 = catchAsync(async (req, res) => {
  const result = await availabilityService.createAvailability(req);
  res.status(201).json({
    success: true,
    data: result
  });
});
var getMyAvailability2 = catchAsync(async (req, res) => {
  const result = await availabilityService.getMyAvailability(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateAvailability2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await availabilityService.updateAvailability(
    req,
    id
  );
  res.status(200).json({
    success: true,
    message: "Availability update successfully",
    data: result
  });
});
var deleteAvailability2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await availabilityService.deleteAvailability(
    req,
    id
  );
  res.status(200).json({
    success: true,
    message: result.message
  });
});
var getBookedSessions = catchAsync(async (req, res) => {
  const result = await availabilityService.getTutorBookedSessions(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var availabilityController = {
  createAvailability: createAvailability2,
  getMyAvailability: getMyAvailability2,
  updateAvailability: updateAvailability2,
  deleteAvailability: deleteAvailability2,
  getBookedSessions
};

// src/modules/availability/availability.router.ts
var router3 = Router3();
router3.use(auth_middleware_default(Role.TUTOR));
router3.post("/", availabilityController.createAvailability);
router3.get("/me", availabilityController.getMyAvailability);
router3.get("/booked", availabilityController.getBookedSessions);
router3.put("/:id", availabilityController.updateAvailability);
router3.delete("/:id", availabilityController.deleteAvailability);
var availabilityRouter = router3;

// src/modules/review/review.router.ts
import { Router as Router4 } from "express";

// src/modules/review/review.service.ts
var createReview = async (req) => {
  const user = await getAuthUser(req);
  if (user.role !== Role.STUDENT) {
    throw new ApiError(403, "Only student can review");
  }
  const { bookingId, rating, comment } = req.body;
  if (!bookingId || !rating) {
    throw new ApiError(400, "bookingId and rating is required");
  }
  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must between 1 and 5");
  }
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking || booking.studentId !== user.id || booking.status !== BookingStatus.COMPLETED) {
      throw new ApiError(400, "Invalid Booking");
    }
    const exists = await tx.review.findUnique({
      where: { bookingId }
    });
    if (exists) {
      throw new ApiError(400, "Review already submitted");
    }
    const review = await tx.review.create({
      data: {
        bookingId,
        rating,
        comment,
        tutorId: booking.tutorProfileId,
        studentId: user.id
      }
    });
    const stats = await tx.review.aggregate({
      where: { tutorId: booking.tutorProfileId },
      _avg: { rating: true }
    });
    await tx.tutorProfile.update({
      where: { id: booking.tutorProfileId },
      data: {
        avgRating: stats._avg.rating || 0
      }
    });
    return review;
  });
};
var reviewService = { createReview };

// src/modules/review/review.controller.ts
var createReview2 = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(req);
  res.status(201).json({
    success: true,
    data: result
  });
});
var reviewController = { createReview: createReview2 };

// src/modules/review/review.router.ts
var router4 = Router4();
router4.use(auth_middleware_default());
router4.post("/", reviewController.createReview);
var reviewRouter = router4;

// src/modules/admin/admin.router.ts
import { Router as Router5 } from "express";

// src/modules/admin/admin.service.ts
var getAllUser = async (req) => {
  console.log("=== getAllUser Debug ===");
  console.log("req.user:", req.user);
  requireRole(req, Role.ADMIN);
  const users = await prisma.user.findMany({
    include: {
      tutorProfile: true
    }
  });
  console.log("Total users found:", users.length);
  return users;
};
var getDashboardStats = async (req) => {
  requireRole(req, Role.ADMIN);
  const [
    totalUsers,
    totalTutors,
    totalStudents,
    approvedTutors,
    pendingTutors,
    totalBookings,
    todayBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue,
    weeklyRevenue,
    recentUsers,
    recentBookings,
    categoryStats
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tutorProfile.count(),
    prisma.user.count({
      where: { role: Role.STUDENT }
    }),
    prisma.tutorProfile.count({ where: { isApproved: true } }),
    prisma.tutorProfile.count({ where: { isApproved: false } }),
    prisma.booking.count(),
    prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)))
        }
      }
    }),
    prisma.booking.count({
      where: { status: "CONFIRMED" }
    }),
    prisma.booking.count({
      where: { status: "COMPLETED" }
    }),
    prisma.booking.count({
      where: { status: "CANCELLED" }
    }),
    prisma.booking.aggregate({
      where: { status: "COMPLETED" },
      _sum: { priceSnapshot: true }
    }),
    prisma.booking.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
        }
      },
      _sum: { priceSnapshot: true }
    }),
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    }),
    prisma.booking.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true
          }
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    }),
    prisma.category.findMany({
      include: {
        tutors: {
          select: {
            tutorId: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })
  ]);
  return {
    overview: {
      totalUsers,
      tutors: {
        total: totalTutors,
        approved: approvedTutors,
        pending: pendingTutors
      },
      totalStudents,
      bookings: {
        total: totalBookings,
        today: todayBookings,
        byStatus: {
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancel: cancelledBookings
        }
      },
      revenue: {
        total: totalRevenue._sum.priceSnapshot || 0,
        weekly: weeklyRevenue._sum.priceSnapshot || 0
      },
      pendingTutorApproved: pendingTutors
    },
    recentActivity: {
      users: recentUsers,
      bookings: recentBookings
    },
    categories: categoryStats.map((category) => ({
      id: category.id,
      name: category.name,
      tutorCount: category.tutors.length
    }))
  };
};
var getAllBookings = async (req) => {
  requireRole(req, Role.ADMIN);
  return prisma.booking.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      tutor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },
      availability: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateUserStatus = async (req, userId) => {
  requireRole(req, Role.ADMIN);
  const { isBanned } = req.body;
  return prisma.user.update({
    where: { id: userId },
    data: { isBanned }
  });
};
var approvedTutor = async (req, tutorId) => {
  requireRole(req, Role.ADMIN);
  return prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { isApproved: true }
  });
};
var createCategory = async (req) => {
  requireRole(req, Role.ADMIN);
  const { name, slug } = req.body;
  const exists = await prisma.category.findUnique({
    where: { slug }
  });
  if (exists) {
    throw new ApiError(400, "Category already exist");
  }
  return prisma.category.create({
    data: { name, slug }
  });
};
var getAllCategories = async (req) => {
  requireRole(req, Role.ADMIN);
  return await prisma.category.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var updateCategory = async (req, categoryId) => {
  requireRole(req, Role.ADMIN);
  const { name, slug } = req.body;
  if (slug) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: categoryId }
      }
    });
    if (existing) {
      throw new ApiError(400, "Slug already exists");
    }
  }
  return await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...name && { name },
      ...slug && { slug },
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
};
var deleteCategory = async (req, categoryId) => {
  requireRole(req, Role.ADMIN);
  const categoryIdUse = await prisma.tutorCategory.findFirst({
    where: { categoryId }
  });
  if (categoryIdUse) {
    throw new ApiError(400, "Can't delete category that assign to tutor");
  }
  await prisma.category.delete({
    where: { id: categoryId }
  });
  return { message: "Category delete successfully" };
};
var adminService = {
  getAllUser,
  getDashboardStats,
  getAllBookings,
  updateUserStatus,
  approvedTutor,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};

// src/modules/admin/admin.controller.ts
var getAllUsers = catchAsync(async (req, res) => {
  const result = await adminService.getAllUser(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getDashboardStats2 = catchAsync(async (req, res) => {
  const result = await adminService.getDashboardStats(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getAllBookings2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllBookings(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.updateUserStatus(req, id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var approvedTutor2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.approvedTutor(req, id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var createCategory2 = catchAsync(async (req, res) => {
  const result = await adminService.createCategory(req);
  res.status(201).json({
    success: true,
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllCategories(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.updateCategory(req, id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.deleteCategory(req, id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var adminController = {
  getAllUsers,
  getDashboardStats: getDashboardStats2,
  getAllBookings: getAllBookings2,
  updateUserStatus: updateUserStatus2,
  approvedTutor: approvedTutor2,
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/admin/admin.router.ts
var router5 = Router5();
router5.use(auth_middleware_default(Role.ADMIN));
router5.get("/users", adminController.getAllUsers);
router5.get("/bookings", adminController.getAllBookings);
router5.get("/categories", adminController.getAllCategories);
router5.get("/stats", adminController.getDashboardStats);
router5.patch("/users/:id/status", adminController.updateUserStatus);
router5.patch("/tutor/:id/approved", adminController.approvedTutor);
router5.post("/categories", adminController.createCategory);
router5.put("/categories/:id", adminController.updateCategory);
router5.delete("/categories/:id", adminController.deleteCategory);
var adminRouter = router5;

// src/modules/category/category.router.ts
import { Router as Router6 } from "express";

// src/modules/category/category.service.ts
var getAllCategories3 = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" }
  });
};
var getCategoryBySlug = async (slug) => {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      tutors: {
        include: {
          tutor: {
            include: {
              user: true
            }
          }
        }
      }
    }
  });
};
var categoryService = {
  getAllCategories: getAllCategories3,
  getCategoryBySlug
};

// src/modules/category/category.controller.ts
var getAllCategories4 = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    data: result
  });
});
var getCategoryBySlug2 = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await categoryService.getCategoryBySlug(slug);
  res.status(200).json({
    success: true,
    data: result
  });
});
var categoryController = {
  getAllCategories: getAllCategories4,
  getCategoryBySlug: getCategoryBySlug2
};

// src/modules/category/category.router.ts
var router6 = Router6();
router6.get("/", categoryController.getAllCategories);
router6.get("/:slug", categoryController.getCategoryBySlug);
var categoriesRouter = router6;

// src/modules/auth/auth.router.ts
import { Router as Router7 } from "express";

// src/modules/auth/auth.controller.ts
var getCurrentUser = catchAsync(async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  if (!session || !session.user) {
    throw new ApiError(401, "You are not authorize, please login.");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      emailVerified: true,
      isBanned: true,
      createdAt: true,
      tutorProfile: {
        select: {
          id: true,
          bio: true,
          hourlyRate: true,
          experience: true,
          avgRating: true,
          isApproved: true
        }
      }
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.isBanned) {
    throw new ApiError(
      403,
      "Your account has been banned. Please Contact Support!"
    );
  }
  res.status(200).json({
    success: true,
    data: user
  });
});
var getSession = catchAsync(async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  res.json(session);
});
var authController = {
  getCurrentUser,
  getSession
};

// src/modules/auth/auth.router.ts
var router7 = Router7();
router7.get("/me", authController.getCurrentUser);
router7.get("/session", authController.getSession);
var authRouter = router7;

// src/modules/student-profile/student-profile.router.ts
import { Router as Router8 } from "express";

// src/modules/student-profile/student-profile.service.ts
var getStudentProfile = async (req) => {
  const user = requireRole(req, Role.STUDENT);
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
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 10
      }
    }
  });
  if (!student) {
    throw new ApiError(404, "Student profile not found");
  }
  return student;
};
var getMyReview = async (req) => {
  const user = requireRole(req, Role.STUDENT);
  const review = await prisma.review.findMany({
    where: { studentId: user.id },
    include: {
      tutor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      },
      student: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const transformedReviews = review.map((review2) => ({
    id: review2.id,
    rating: review2.rating,
    comment: review2.comment,
    createdAt: review2.createdAt,
    student: {
      id: review2.student.id,
      name: review2.student.name,
      image: review2.student.image
    },
    tutor: review2.tutor ? {
      id: review2.tutor.id,
      name: review2.tutor.user.name,
      image: review2.tutor.user.image
    } : void 0
  }));
  return transformedReviews;
};
var updateStudentProfile = async (req) => {
  const user = requireRole(req, Role.STUDENT);
  const { name, phone } = req.body;
  if (name && name.trim().length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters ");
  }
  return prisma.user.update({
    where: { id: user.id },
    data: {
      ...name && { name: name.trim() },
      ...phone && { phone }
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      updatedAt: true
    }
  });
};
var getStudentDashboard = async (req) => {
  const user = requireRole(req, Role.STUDENT);
  const [upcomingBookings, pastBookings, totalSpent] = await Promise.all([
    prisma.booking.findMany({
      where: {
        studentId: user.id,
        status: "CONFIRMED",
        availability: {
          startTime: {
            gt: /* @__PURE__ */ new Date()
          }
        }
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true
              }
            },
            availabilities: {
              select: {
                startTime: true,
                endTime: true
              }
            }
          }
        }
      },
      orderBy: {
        availability: {
          startTime: "asc"
        }
      },
      take: 5
    }),
    prisma.booking.findMany({
      where: {
        studentId: user.id,
        OR: [{ status: "COMPLETED" }, { status: "CANCELLED" }]
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        availability: {
          select: {
            startTime: true,
            endTime: true
          }
        },
        review: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 3
    }),
    prisma.booking.aggregate({
      where: {
        studentId: user.id,
        status: "COMPLETED"
      },
      _sum: {
        priceSnapshot: true
      }
    })
  ]);
  const stats = {
    totalBookings: upcomingBookings.length + pastBookings.length,
    upcomingSession: upcomingBookings.length,
    completedSessions: pastBookings.filter((b) => b.status === "COMPLETED").length,
    totalSpent: totalSpent._sum.priceSnapshot || 0
  };
  return {
    stats,
    upcomingBookings,
    pastBookings
  };
};
var studentProfileService = {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
  getMyReview
};

// src/modules/student-profile/student-profile.controller.ts
var getStudentProfile2 = catchAsync(async (req, res) => {
  const result = await studentProfileService.getStudentProfile(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateStudentProfile2 = catchAsync(async (req, res) => {
  const result = await studentProfileService.updateStudentProfile(req);
  res.status(200).json({
    success: true,
    message: "Profile update successfully",
    data: result
  });
});
var getStudentDashboard2 = catchAsync(async (req, res) => {
  const result = await studentProfileService.getStudentDashboard(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getMyReview2 = catchAsync(async (req, res) => {
  const result = await studentProfileService.getMyReview(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var studentProfileController = {
  getStudentProfile: getStudentProfile2,
  updateStudentProfile: updateStudentProfile2,
  getStudentDashboard: getStudentDashboard2,
  getMyReview: getMyReview2
};

// src/modules/student-profile/student-profile.router.ts
var router8 = Router8();
router8.use(auth_middleware_default(Role.STUDENT));
router8.get("/profile", studentProfileController.getStudentProfile);
router8.put("/profile", studentProfileController.updateStudentProfile);
router8.get("/dashboard", studentProfileController.getStudentDashboard);
router8.get("/reviews", studentProfileController.getMyReview);
var studentProfileRouter = router8;

// src/modules/tutor-profile/tutor-profile.router.ts
import { Router as Router9 } from "express";

// src/modules/tutor-profile/tutor-profile.service.ts
var createTutorProfile = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  const { bio, hourlyRate, experience, categoryIds } = req.body;
  if (!hourlyRate || hourlyRate <= 0) {
    throw new ApiError(400, "Valid hourly rate is required");
  }
  if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    throw new ApiError(400, "Al least one category is required");
  }
  const existingProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id }
  });
  if (existingProfile) {
    throw new ApiError(400, "Tutor profile already exist");
  }
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } }
  });
  if (categories.length !== categoryIds.length) {
    const foundIds = categories.map((c) => c.id);
    const missingIds = categoryIds.filter((id) => !foundIds.includes(id));
    throw new ApiError(400, `Categories not found: ${missingIds.join(", ")}`);
  }
  return prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.create({
      data: {
        userId: user.id,
        bio: bio || null,
        hourlyRate: parseFloat(hourlyRate),
        experience: parseInt(experience) || 0
      }
    });
    await tx.tutorCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        tutorId: tutorProfile.id,
        categoryId
      }))
    });
    return tutorProfile;
  });
};
var getMyTutorProfile = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
    include: {
      tutorCategories: {
        include: {
          category: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true
        }
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      },
      availabilities: {
        where: {
          startTime: { gt: /* @__PURE__ */ new Date() },
          isBooked: false
        },
        take: 5,
        orderBy: {
          startTime: "asc"
        }
      }
    }
  });
  if (!tutorProfile) {
    throw new ApiError(404, "Tutor profile not found");
  }
  return tutorProfile;
};
var updateTutorProfile = async (req) => {
  const user = requireRole(req, Role.TUTOR);
  const { bio, hourlyRate, experience, categoryIds } = req.body;
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: user.id
    }
  });
  if (!tutorProfile) {
    throw new ApiError(404, "Tutor profile not found");
  }
  if (hourlyRate !== void 0 && hourlyRate <= 0) {
    throw new ApiError(400, "Hourly rate must be positive");
  }
  return prisma.$transaction(async (tx) => {
    const updateProfile = await tx.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: {
        ...bio !== void 0 && { bio },
        ...hourlyRate !== void 0 && { hourlyRate: parseFloat(hourlyRate) },
        ...experience !== void 0 && {
          experience: parseInt(experience) || 0
        }
      }
    });
    if (categoryIds && Array.isArray(categoryIds)) {
      await tx.tutorCategory.deleteMany({
        where: { tutorId: tutorProfile.id }
      });
      const categories = await tx.category.findMany({
        where: { id: { in: categoryIds } }
      });
      if (categories.length !== categoryIds.length) {
        throw new ApiError(400, "One or more category not found");
      }
      await tx.tutorCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          tutorId: tutorProfile.id,
          categoryId
        }))
      });
    }
    return updateProfile;
  });
};
var tutorProfileService = {
  createTutorProfile,
  getMyTutorProfile,
  updateTutorProfile
};

// src/modules/tutor-profile/tutor-profile.controller.ts
var createTutorProfile2 = catchAsync(async (req, res) => {
  const result = await tutorProfileService.createTutorProfile(req);
  res.status(200).json({
    success: true,
    message: "Tutor profile create successfully",
    data: result
  });
});
var getMyTutorProfile2 = catchAsync(async (req, res) => {
  const result = await tutorProfileService.getMyTutorProfile(req);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateTutorProfile2 = catchAsync(async (req, res) => {
  const result = await tutorProfileService.updateTutorProfile(req);
  res.status(200).json({
    success: true,
    message: "Tutor profile update successfully",
    data: result
  });
});
var tutorProfileController = {
  createTutorProfile: createTutorProfile2,
  getMyTutorProfile: getMyTutorProfile2,
  updateTutorProfile: updateTutorProfile2
};

// src/modules/tutor-profile/tutor-profile.router.ts
var router9 = Router9();
router9.use(auth_middleware_default(Role.TUTOR));
router9.post("/", tutorProfileController.createTutorProfile);
router9.get("/me", tutorProfileController.getMyTutorProfile);
router9.put("/", tutorProfileController.updateTutorProfile);
var tutorProfileRouter = router9;

// src/app.ts
var app = express();
var allowedOrigins = [
  "http://localhost:3000",
  "https://skill-bridge-web-client.vercel.app"
];
var corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.all("/api/auth/*", toNodeHandler(auth));
app.use("/api/v1/tutors", tutorRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentProfileRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/tutor/availability", availabilityRouter);
app.use("/api/v1/tutor/profile", tutorProfileRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/admin", adminRouter);
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Skill Bridge API is running!"
  });
});
app.get("/api/auth/debug", (req, res) => {
  res.json({
    message: "Auth endpoint is working",
    origin: req.headers.origin,
    headers: req.headers
  });
});
app.use(errorHandler);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  console.log("\u{1F680} Starting server...");
  console.log("\u{1F4CA} Node version:", process.version);
  console.log("\u{1F3AF} PORT:", PORT);
  try {
    await prisma.$connect();
    console.log("\u2705 Connected to database successfully");
    const server = app_default.listen(PORT, () => {
      console.log(`\u2705 Server running on port ${PORT}`);
    });
    process.on("SIGTERM", async () => {
      console.log("\u{1F6D1} SIGTERM received, closing server...");
      await prisma.$disconnect();
      server.close(() => process.exit(0));
    });
    process.on("SIGINT", async () => {
      console.log("\u{1F6D1} SIGINT received, closing server...");
      await prisma.$disconnect();
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("\u274C Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
