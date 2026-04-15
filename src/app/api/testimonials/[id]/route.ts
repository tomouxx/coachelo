import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(120).optional(),
  program: z.string().max(120).optional().nullable(),
  quote: z.string().min(5).max(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  photoUrl: z.string().url().optional().nullable(),
  published: z.boolean().optional(),
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
    const testimonial = await prisma.testimonial.update({ where: { id: params.id }, data });
    return NextResponse.json({ testimonial });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await prisma.testimonial.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
