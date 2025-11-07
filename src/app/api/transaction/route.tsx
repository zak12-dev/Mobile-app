import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const transactions = await prisma.transaction.findMany({
        include: { compte: true },
      });
      return res.status(200).json(transactions);

    case "POST":
      const { compteId, type, amount } = req.body;
      const newTransaction = await prisma.transaction.create({
        data: { compteId: Number(compteId), type, amount: Number(amount) },
      });
      return res.status(201).json(newTransaction);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
