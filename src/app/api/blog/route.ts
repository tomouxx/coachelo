import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

const schema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().optional(),
  excerpt: z.string().max(500).default(""),
  content: z.string().min(5),
  coverUrl: z.string().url().optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  readingMin: z.number().int().min(1).max(60).default(4),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable()
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const isAdmin = !!session?.user;
  const where = isAdmin ? {} : { published: true };
  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: Number(searchParams.get("take") || 50)
  });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    const slug = data.slug || slugify(data.title, { lower: true, strict: true });
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverUrl: data.coverUrl ?? null,
        category: data.category ?? null,
        readingMin: data.readingMin,
        published: data.published,
        publishedAt: data.published ? new Date(data.publishedAt ?? new Date()) : null
      }
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
