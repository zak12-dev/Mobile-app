import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      include: { user: true }, // inclure l'utilisateur lié
    });
    return NextResponse.json(agents);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de récupérer les agents" },
      { status: 500 }
    );
  }
}

// POST /api/agents
export async function POST(req: NextRequest) {
  try {
    const { name, phone, pin, userId } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Le nom et le téléphone sont requis" },
        { status: 400 }
      );
    }

    // 🔹 Récupérer un utilisateur existant si userId n’est pas fourni
    let finalUserId = userId;
    if (!finalUserId) {
      const user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json(
          { error: "Aucun utilisateur existant pour assigner l'agent" },
          { status: 400 }
        );
      }
      finalUserId = user.id;
    }

    const newAgent = await prisma.agent.create({
      data: {
        name,
        phone,
        pin,
        userId: finalUserId,
      },
    });

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de créer l'agent" },
      { status: 500 }
    );
  }
}

// DELETE /api/agents
export async function DELETE(req: NextRequest) {
  try {
    const { deleteId } = await req.json();
    await prisma.agent.delete({ where: { id: deleteId } });
    return NextResponse.json({ message: "Agent supprimé" }, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de supprimer l'agent" },
      { status: 500 }
    );
  }
}
