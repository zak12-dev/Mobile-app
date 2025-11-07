import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { agents: true, comptes: true, transactions: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de récupérer les utilisateurs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, role, passwordHash } = await req.json();
    const user = await prisma.user.create({
      data: { name, email, phone, role, passwordHash },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de créer l'utilisateur" },
      { status: 500 }
    );
  }
}
