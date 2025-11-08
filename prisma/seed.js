import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Créer un admin
  const admin = await prisma.user.create({
    data: {
      name: "GBACADA Caleb",
      email: "admin@test.com",
      phone: "0123456789",
      role: "ADMIN",
      passwordHash: "hashedpassword",
    },
  });
  console.log("Admin créé :", admin);

  // Créer un agent lié à cet admin
  const agent = await prisma.agent.create({
    data: {
      name: "AGOKOLI Zaki",
      phone: "0987654321",
      userId: admin.id,
    },
  });
  console.log("Agent créé :", agent);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
