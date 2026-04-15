import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  weekday: z.number().int().min(0).max(6),
  startMin: z.number().int().min(0).max(1440),
  endMin: z.number().int().min(0).max(1440),
  active: z.boolean().default(true)
});

export async function GET() {
  const rules = await prisma.availabilityRule.findMany({
    orderBy: [{ weekday: "asc" }, { startMin: "asc" }]
  });
  return NextResponse.json({ rules });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    if (data.endMin <= data.startMin) {
      return NextResponse.json({ error: "Fin avant début" }, { status: 400 });
    }
    const rule = await prisma.availabilityRule.create({ data });
    return NextResponse.json({ rule }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
