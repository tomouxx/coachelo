"use client";
import { useState, useEffect, useRef } from "react";
import { Save, AlertCircle, Upload, ImageIcon } from "lucide-react";

interface Setting {
  key: string;
  value: string;
  category: string;
  label: string;
  type: string;
  sortOrder: number;
  updatedAt: string;
}

interface SettingsByCategory {
  [category: string]: Setting[];
}

const categoryLabels: Record<string, string> = {
  hero: "🏠 Hero",
  home_sections: "🏠 Accueil (sections)",
  about: "👩 À propos (intro)",
  about_extra: "👩 À propos (bio & diplômes)",
  services_page: "💪 Services (avantages)",
  nutrition: "🥗 Nutrition",
  nutrition_extra: "🥗 Nutrition (extra)",
  tarifs: "💶 Tarifs (page)",
  tarifs_plans: "💶 Tarifs (offres)",
  services_faq: "❓ FAQ",
  temoignages_page: "⭐ Témoignages",
  images: "📷 Photos & Images",
  contact_info: "📞 Contact (infos)",
  contact_page: "📞 Contact (page)",
  footer: "🔻 Pied de page",
  blog_page: "📝 Blog",
  seo: "🔍 SEO"
};

export default function ContentPage() {
  const [settings, setSettings] = useState<SettingsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");

      const { settings: data } = await res.json();

      // Group by category
      const grouped: SettingsByCategory = {};
      for (const setting of data) {
        if (!grouped[setting.category]) {
          grouped[setting.category] = [];
        }
        grouped[setting.category].push(setting);
      }

      // Sort by sortOrder within each category
      for (const cat in grouped) {
        grouped[cat].sort((a, b) => a.sortOrder - b.sortOrder);
      }

      setSettings(grouped);

      // Initialize form data
      const form: Record<string, string> = {};
      for (const setting of data) {
        form[setting.key] = setting.value;
      }
      setFormData(form);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({ type: "error", text: "Erreur lors du chargement des paramètres" });
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string, value: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({ type: "success", text: "Paramètre sauvegardé ✓" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setMessage({ type: "error", text: "Erreur lors de la sauvegarde" });
    } finally {
      setSaving(false);
    }
  }

  async function saveCategory() {
    setSaving(true);
    const categorySettings = settings[activeTab] || [];
    const updates = categorySettings
      .map((s) => ({
        key: s.key,
        value: formData[s.key] || ""
      }))
      .filter((u) => u.value !== undefined);

    try {
      const res = await fetch("/api/settings/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({ type: "success", text: "Section sauvegardée ✓" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setMessage({ type: "error", text: "Erreur lors de la sauvegarde" });
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(key: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        setMessage({ type: "error", text: err.error || "Erreur upload" });
        return;
      }
      const { url } = await res.json();
      setFormData({ ...formData, [key]: url });
      setMessage({ type: "success", text: "Image uploadée ✓" });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'upload" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-rose mb-4"></div>
          <p className="text-brand-taupe">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  const categoryKeys = Object.keys(categoryLabels).filter((k) => settings[k]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-dark mb-2">Contenu du site</h1>
      <p className="text-brand-taupe mb-8">Modifiez le contenu statique des pages du site.</p>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-brand-divider overflow-x-auto">
        {categoryKeys.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition ${
              activeTab === cat
                ? "border-brand-rose text-brand-rose"
                : "border-transparent text-brand-taupe hover:text-brand-dark"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Content for active tab */}
      {settings[activeTab] && (
        <div className="bg-white rounded-lg shadow-soft p-8 max-w-3xl">
          <div className="space-y-6">
            {settings[activeTab].map((setting) => (
              <div key={setting.key}>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  {setting.label}
                </label>
                {setting.type === "image" ? (
                  <div className="space-y-3">
                    {formData[setting.key] && (
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-brand-divider">
                        <img
                          src={formData[setting.key]}
                          alt={setting.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-3 items-center">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-nude border border-brand-divider rounded-lg text-sm font-medium hover:bg-brand-ivory transition">
                        <Upload className="w-4 h-4" />
                        Uploader une image
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(setting.key, file);
                          }}
                        />
                      </label>
                      <span className="text-xs text-brand-taupe">ou</span>
                      <input
                        type="text"
                        value={formData[setting.key] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [setting.key]: e.target.value })
                        }
                        placeholder="URL de l'image"
                        className="flex-1 px-3 py-2 border border-brand-divider rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/50"
                      />
                    </div>
                    <p className="text-xs text-brand-taupe">
                      JPG, PNG ou WebP — max 5 Mo. Tu peux aussi coller une URL externe.
                    </p>
                  </div>
                ) : setting.type === "textarea" ? (
                  <textarea
                    value={formData[setting.key] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [setting.key]: e.target.value
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-rose/50"
                  />
                ) : setting.type === "richtext" ? (
                  <textarea
                    value={formData[setting.key] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [setting.key]: e.target.value
                      })
                    }
                    rows={6}
                    className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-rose/50"
                    placeholder="Contenu HTML/Texte riche"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[setting.key] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [setting.key]: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/50"
                  />
                )}
                {setting.type === "richtext" && (
                  <p className="mt-1 text-xs text-brand-taupe">
                    HTML accepté (balises &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={saveCategory}
              disabled={saving}
              className="px-6 py-2.5 bg-brand-rose text-white rounded-lg hover:bg-brand-terracotta disabled:opacity-60 flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Enregistrer la section"}
            </button>
            <button
              onClick={() => {
                // Reset to original values
                const form: Record<string, string> = {};
                for (const cat of categoryKeys) {
                  for (const setting of settings[cat]) {
                    form[setting.key] = setting.value;
                  }
                }
                setFormData(form);
              }}
              className="px-6 py-2.5 bg-white border border-brand-divider rounded-lg text-brand-dark hover:bg-brand-ivory"
            >
              Annuler les modifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
