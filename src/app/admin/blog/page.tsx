import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-dark mb-1">Blog</h1>
          <p className="text-brand-taupe">Rédige et publie tes articles.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-5 py-2.5 bg-brand-rose text-white rounded-lg hover:bg-brand-terracotta flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Nouvel article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-nude/30 text-left">
            <tr>
              <th className="p-4">Titre</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Publié le</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-brand-divider/50">
                <td className="p-4">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-brand-taupe">/blog/{p.slug}</div>
                </td>
                <td>{p.category || "—"}</td>
                <td>
                  {p.published ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Publié
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      Brouillon
                    </span>
                  )}
                </td>
                <td>
                  {p.publishedAt
                    ? new Intl.DateTimeFormat("fr-CH").format(p.publishedAt)
                    : "—"}
                </td>
                <td className="text-right pr-4">
                  <Link
                    href={`/admin/blog/${p.id}`}
                    className="text-brand-rose text-sm hover:underline"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-brand-taupe">
                  Aucun article pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
