import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(120).optional(),
  slug: z.string().optional(),
  description: z.string().max(2000).optional(),
  priceLabel: z.string().max(80).optional(),
  durationMin: z.number().int().min(15).max(300).optional(),
  location: z.enum(["HOME", "OUTDOOR", "GYM", "ONLINE"]).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const service = await prisma.service.update({ where: { id: params.id }, data });
    return NextResponse.json({ service });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
