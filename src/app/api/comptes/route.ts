import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const comptes = await prisma.compte.findMany({
        include: { agent: true },
      });
      return res.status(200).json(comptes);

    case "POST":
      const { agentId, balance } = req.body;
      const newCompte = await prisma.compte.create({
        data: { agentId: Number(agentId), balance: Number(balance) || 0 },
      });
      return res.status(201).json(newCompte);

    case "PUT":
      const { id, ...updateData } = req.body;
      const updatedCompte = await prisma.compte.update({
        where: { id: Number(id) },
        data: updateData,
      });
      return res.status(200).json(updatedCompte);

    case "DELETE":
      const { deleteId } = req.body;
      await prisma.compte.delete({ where: { id: Number(deleteId) } });
      return res.status(204).end();

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
