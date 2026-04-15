"use client";
import { useState } from "react";
import { Trash2, Plus, Save } from "lucide-react";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceLabel: string;
  durationMin: number;
  location: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

const locationLabels: Record<string, string> = {
  HOME: "À domicile",
  OUTDOOR: "Extérieur",
  GYM: "Salle",
  ONLINE: "En ligne"
};

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<Service>>({});

  function startEdit(s: Service) {
    setEditing(s.id);
    setCreating(false);
    setForm(s);
  }
  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({
      name: "",
      description: "",
      priceLabel: "Dès 80 CHF / séance",
      durationMin: 60,
      location: "HOME",
      featured: false,
      active: true,
      sortOrder: services.length
    });
  }
  function cancel() {
    setEditing(null);
    setCreating(false);
    setForm({});
  }

  async function save() {
    const url = creating ? "/api/services" : `/api/services/${editing}`;
    const method = creating ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const { service } = await res.json();
      if (creating) setServices([...services, service]);
      else setServices(services.map((s) => (s.id === service.id ? service : s)));
      cancel();
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette prestation ?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) setServices(services.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-4">
      {!creating && !editing && (
        <button
          onClick={startCreate}
          className="px-5 py-2.5 bg-brand-rose text-white rounded-lg hover:bg-brand-terracotta flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Nouvelle prestation
        </button>
      )}

      {(creating || editing) && (
        <div className="bg-white p-6 rounded-xl shadow-soft space-y-3">
          <h2 className="font-serif text-xl">{creating ? "Nouvelle prestation" : "Modifier"}</h2>
          <input
            type="text"
            placeholder="Nom"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <textarea
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Prix (ex: Dès 80 CHF / séance)"
              value={form.priceLabel || ""}
              onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
              className="px-3 py-2 border border-brand-divider rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Durée min"
              value={form.durationMin || 60}
              onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
              className="px-3 py-2 border border-brand-divider rounded-lg text-sm"
            />
          </div>
          <select
            value={form.location || "HOME"}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm"
          >
            {Object.entries(locationLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active ?? true}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Actif (visible)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured ?? false}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Mis en avant
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="px-4 py-2 bg-brand-rose text-white rounded-lg text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Enregistrer
            </button>
            <button onClick={cancel} className="px-4 py-2 text-sm text-brand-taupe">Annuler</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-nude/30 text-left">
            <tr>
              <th className="p-4">Nom</th>
              <th>Lieu</th>
              <th>Durée</th>
              <th>Prix</th>
              <th>Statut</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t border-brand-divider/50">
                <td className="p-4">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-brand-taupe">
                    {s.description.slice(0, 80)}…
                  </div>
                </td>
                <td>{locationLabels[s.location]}</td>
                <td>{s.durationMin} min</td>
                <td>{s.priceLabel}</td>
                <td>
                  {s.active ? (
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">Actif</span>
                  ) : (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Masqué</span>
                  )}
                </td>
                <td className="text-right pr-4">
                  <button onClick={() => startEdit(s)} className="text-brand-rose text-xs mr-2">Modifier</button>
                  <button onClick={() => remove(s.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
