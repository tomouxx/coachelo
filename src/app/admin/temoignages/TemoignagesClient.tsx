"use client";
import { useState } from "react";
import { Trash2, Plus, Star } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  program: string | null;
  quote: string;
  rating: number;
  published: boolean;
  sortOrder: number;
};

export default function TemoignagesClient({
  initialTestimonials
}: {
  initialTestimonials: Testimonial[];
}) {
  const [items, setItems] = useState(initialTestimonials);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<Testimonial>>({
    name: "",
    program: "",
    quote: "",
    rating: 5,
    published: true
  });

  async function add() {
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sortOrder: items.length })
    });
    if (res.ok) {
      const { testimonial } = await res.json();
      setItems([...items, testimonial]);
      setCreating(false);
      setForm({ name: "", program: "", quote: "", rating: 5, published: true });
    }
  }

  async function toggle(id: string, current: boolean) {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !current })
    });
    if (res.ok) {
      const { testimonial } = await res.json();
      setItems(items.map((t) => (t.id === id ? testimonial : t)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce témoignage ?")) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      {!creating ? (
        <button
          onClick={() => setCreating(true)}
          className="px-5 py-2.5 bg-brand-rose text-white rounded-lg hover:bg-brand-terracotta flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Ajouter un témoignage
        </button>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-soft space-y-3">
          <input
            type="text"
            placeholder="Prénom / Auteur"
            value={form.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Programme suivi (optionnel)"
            value={form.program ?? ""}
            onChange={(e) => setForm({ ...form, program: e.target.value })}
            className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <textarea
            placeholder="Témoignage"
            value={form.quote ?? ""}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <div className="flex items-center gap-3 text-sm">
            <label>Note :</label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="px-2 py-1 border border-brand-divider rounded"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} ★</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={add} className="px-4 py-2 bg-brand-rose text-white rounded-lg text-sm">
              Enregistrer
            </button>
            <button onClick={() => setCreating(false)} className="px-4 py-2 text-sm text-brand-taupe">
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-soft p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium">{t.name}</div>
                {t.program && <div className="text-xs text-brand-taupe">{t.program}</div>}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-rose text-brand-rose" />
                ))}
              </div>
            </div>
            <p className="text-sm text-brand-taupe italic mb-4">« {t.quote} »</p>
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => toggle(t.id, t.published)}
                className={`px-3 py-1 rounded-full ${
                  t.published
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.published ? "Publié" : "Masqué"}
              </button>
              <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
