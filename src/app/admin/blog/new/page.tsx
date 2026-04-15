"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";
import { Save } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    coverUrl: "",
    category: "",
    content: "<p>Commence à écrire ton article…</p>",
    readingMin: 4
  });
  const [loading, setLoading] = useState(false);

  async function save(publish: boolean) {
    setLoading(true);
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        excerpt: form.excerpt,
        coverUrl: form.coverUrl || null,
        category: form.category || null,
        content: form.content,
        readingMin: form.readingMin,
        published: publish
      })
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/blog");
    } else {
      alert("Erreur lors de l'enregistrement");
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-brand-dark mb-6">Nouvel article</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-3 text-xl border border-brand-divider rounded-lg"
        />
        <textarea
          placeholder="Résumé (affiché sur la liste des articles)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border border-brand-divider rounded-lg text-sm"
        />
        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="url"
            placeholder="URL image de couverture"
            value={form.coverUrl}
            onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
            className="md:col-span-2 px-4 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Catégorie (ex: Nutrition)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-4 py-2 border border-brand-divider rounded-lg text-sm"
          />
        </div>

        <BlogEditor content={form.content} onChange={(c) => setForm({ ...form, content: c })} />

        <div className="flex gap-3">
          <button
            disabled={loading || !form.title}
            onClick={() => save(false)}
            className="px-5 py-2.5 bg-white border border-brand-divider rounded-lg text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Enregistrer en brouillon
          </button>
          <button
            disabled={loading || !form.title}
            onClick={() => save(true)}
            className="px-5 py-2.5 bg-brand-rose text-white rounded-lg hover:bg-brand-terracotta text-sm"
          >
            Publier
          </button>
        </div>
      </div>
    </div>
  );
}
