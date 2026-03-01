import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
  console.log("🚀 Starting server...");
  console.log("📊 Node version:", process.version);
  console.log("🎯 PORT:", PORT);

  try {
    await prisma.$connect();
    console.log("✅ Connected to database successfully");

    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    process.on("SIGTERM", async () => {
      console.log("🛑 SIGTERM received, closing server...");
      await prisma.$disconnect();
      server.close(() => process.exit(0));
    });

    process.on("SIGINT", async () => {
      console.log("🛑 SIGINT received, closing server...");
      await prisma.$disconnect();
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
