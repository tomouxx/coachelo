import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(2).max(200).optional(),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(5).optional(),
  coverUrl: z.string().url().optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  readingMin: z.number().int().min(1).max(60).optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable()
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const updateData: any = { ...data };
    if (data.publishedAt) updateData.publishedAt = new Date(data.publishedAt);
    if (data.published && !data.publishedAt) updateData.publishedAt = new Date();
    const post = await prisma.blogPost.update({ where: { id: params.id }, data: updateData });
    return NextResponse.json({ post });
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
