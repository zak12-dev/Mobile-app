import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const rules = await prisma.commissionRule.findMany();
      return res.status(200).json(rules);

    case "POST":
      const { type, percentage } = req.body;
      const newRule = await prisma.commissionRule.create({
        data: { type, percentage: Number(percentage) },
      });
      return res.status(201).json(newRule);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
