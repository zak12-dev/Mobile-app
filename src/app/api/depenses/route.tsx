import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const depenses = await prisma.depense.findMany({
        include: { agent: true },
      });
      return res.status(200).json(depenses);

    case "POST":
      const { agentId, amount, category } = req.body;
      const newDepense = await prisma.depense.create({
        data: { agentId: Number(agentId), amount: Number(amount), category },
      });
      return res.status(201).json(newDepense);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
