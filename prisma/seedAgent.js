// prisma/seedAgent.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Vérifie si l'admin existe
  const admin = await prisma.user.findUnique({
    where: { id: "cmhosxrs90000kyt1ith66cut" }, // ton admin ID exact
  });

  if (!admin) {
    console.log("Admin introuvable ! Crée d'abord l'admin.");
    return;
  }

  // Crée l'agent
  const agent = await prisma.agent.create({
    data: {
      name: "Agent Test",
      phone: "0987654321",
      pin: "1234",
      userId: admin.id, // association avec l'admin existant
    },
  });

  console.log("Agent créé :", agent);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
