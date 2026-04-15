import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(120),
  program: z.string().max(120).optional().nullable(),
  quote: z.string().min(5).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  photoUrl: z.string().url().optional().nullable(),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const testimonial = await prisma.testimonial.create({ data });
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
