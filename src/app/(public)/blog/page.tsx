import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatDateFR } from "@/lib/utils";

export const metadata = { title: "Blog · Conseils sport & nutrition" };
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" }
  }).catch(() => []);

  return (
    <>
      <section className="container-editorial pt-20 pb-12 text-center">
        <p className="eyebrow">Journal</p>
        <h1 className="section-title mt-3">Conseils sport & nutrition</h1>
      </section>

      <section className="container-editorial pb-24">
        {posts.length === 0 ? (
          <p className="text-center text-brand-taupe py-20">
            Les premiers articles arrivent bientôt. Reviens vite !
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group block bg-white rounded-xl2 overflow-hidden shadow-card"
              >
                {p.coverUrl && (
                  <div className="relative aspect-video">
                    <Image src={p.coverUrl} alt={p.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                  {p.category && <p className="eyebrow">{p.category}</p>}
                  <h3 className="mt-2 font-serif text-xl font-semibold group-hover:text-brand-terracotta transition">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-taupe line-clamp-3">{p.excerpt}</p>
                  {p.publishedAt && (
                    <p className="mt-4 text-xs text-brand-taupe">
                      {formatDateFR(p.publishedAt)} · {p.readingMin} min
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
