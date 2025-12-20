import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "abc@gmail.com";
  const plainPassword = "1234";

  // Check if admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("❌ User already exists with this email");
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: Role.ADMIN,
      name: "Admin",
    },
  });

  console.log("✅ Admin created successfully");
  console.log({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((e) => {
    console.error("❌ Error creating admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
