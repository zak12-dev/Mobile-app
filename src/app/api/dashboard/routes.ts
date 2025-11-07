import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalBalance = await prisma.compte.aggregate({
      _sum: { solde: true },
    });
    const totalAgents = await prisma.agent.count();
    const totalTransactions = await prisma.transaction.count();
    const totalDepenses = await prisma.depense.count();

    const recentTransactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { compte: true },
    });

    const recentDepenses = await prisma.depense.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      totalBalance: totalBalance._sum.solde ?? 0,
      totalAgents,
      totalTransactions,
      totalDepenses,
      recentTransactions,
      recentDepenses,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
