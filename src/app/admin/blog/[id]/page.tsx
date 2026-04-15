import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPostClient from "./EditPostClient";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <EditPostClient
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        coverUrl: post.coverUrl || "",
        category: post.category || "",
        content: post.content,
        published: post.published,
        readingMin: post.readingMin
      }}
    />
  );
}
