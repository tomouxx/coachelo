import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

const schema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().optional(),
  description: z.string().max(2000),
  priceLabel: z.string().max(80),
  durationMin: z.number().int().min(15).max(300).default(60),
  location: z.enum(["HOME", "OUTDOOR", "GYM", "ONLINE"]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const slug = data.slug || slugify(data.name, { lower: true, strict: true });
    const service = await prisma.service.create({ data: { ...data, slug } });
    return NextResponse.json({ service }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: "Données invalides", issues: err.issues }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
