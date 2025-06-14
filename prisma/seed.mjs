import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  const email = "loonhtet.dev@gmail.com";
  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("root", 10);
    await prisma.users.create({
      data: {
        id: uuidv4(),
        name: "Loon Htet",
        email,
        password: hashedPassword,
        email_verified: true,
        verification_token: "verify-token",
        verification_expires: new Date(Date.now() + 86400000),
      },
    });
    console.log("🌲 User created");
  } else {
    console.log("🌲 User already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
