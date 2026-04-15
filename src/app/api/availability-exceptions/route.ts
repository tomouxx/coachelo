import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  date: z.string().datetime(),
  startMin: z.number().int().min(0).max(1440).optional().nullable(),
  endMin: z.number().int().min(0).max(1440).optional().nullable(),
  allDayOff: z.boolean().default(false),
  note: z.string().max(200).optional().nullable()
});

export async function GET() {
  const exceptions = await prisma.availabilityException.findMany({
    orderBy: { date: "asc" },
    where: { date: { gte: new Date() } }
  });
  return NextResponse.json({ exceptions });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const exception = await prisma.availabilityException.create({
      data: { ...data, date: new Date(data.date) }
    });
    return NextResponse.json({ exception }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
