import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDateFR } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!post) return { title: "Article introuvable" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogArticle({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!post || !post.published) return notFound();

  return (
    <article className="container-editorial py-20">
      <Link href="/blog" className="text-sm text-brand-terracotta">← Retour au blog</Link>

      <header className="mt-8 text-center max-w-3xl mx-auto">
        {post.category && <p className="eyebrow">{post.category}</p>}
        <h1 className="mt-3 font-serif text-display-md md:text-display-lg font-bold text-brand-dark">
          {post.title}
        </h1>
        <p className="mt-5 text-brand-taupe">
          {post.publishedAt && formatDateFR(post.publishedAt)} · {post.readingMin} min de lecture
        </p>
      </header>

      {post.coverUrl && (
        <div className="relative aspect-video max-w-4xl mx-auto mt-10 rounded-xl2 overflow-hidden">
          <Image src={post.coverUrl} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div
        className="prose-editorial mt-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
