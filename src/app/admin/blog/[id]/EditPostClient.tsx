"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";
import { Save, Trash2 } from "lucide-react";

export default function EditPostClient({
  post
}: {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverUrl: string;
    category: string;
    content: string;
    published: boolean;
    readingMin: number;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState(post);
  const [loading, setLoading] = useState(false);

  async function save(publish?: boolean) {
    setLoading(true);
    const res = await fetch(`/api/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        excerpt: form.excerpt,
        coverUrl: form.coverUrl || null,
        category: form.category || null,
        content: form.content,
        readingMin: form.readingMin,
        published: publish ?? form.published
      })
    });
    setLoading(false);
    if (res.ok) router.push("/admin/blog");
    else alert("Erreur");
  }

  async function remove() {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
    router.push("/admin/blog");
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-brand-dark mb-6">Modifier l'article</h1>
      <div className="space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-3 text-xl border border-brand-divider rounded-lg"
        />
        <textarea
          placeholder="Résumé"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border border-brand-divider rounded-lg text-sm"
        />
        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="url"
            placeholder="URL image couverture"
            value={form.coverUrl}
            onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
            className="md:col-span-2 px-4 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-4 py-2 border border-brand-divider rounded-lg text-sm"
          />
        </div>
        <BlogEditor content={form.content} onChange={(c) => setForm({ ...form, content: c })} />
        <div className="flex gap-3">
          <button
            disabled={loading}
            onClick={() => save(false)}
            className="px-5 py-2.5 bg-white border border-brand-divider rounded-lg text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Enregistrer brouillon
          </button>
          <button
            disabled={loading}
            onClick={() => save(true)}
            className="px-5 py-2.5 bg-brand-rose text-white rounded-lg text-sm"
          >
            Publier
          </button>
          <div className="flex-1" />
          <button
            onClick={remove}
            className="px-4 py-2 text-sm text-red-600 flex items-center gap-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
