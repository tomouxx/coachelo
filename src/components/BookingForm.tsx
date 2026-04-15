"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

type Service = { id: string; slug: string; name: string; durationMin: number; priceLabel: string };
type Slot = { start: string; end: string };

export default function BookingForm({ services, preselectedSlug }: { services: Service[]; preselectedSlug?: string }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [service, setService] = useState<Service | null>(
    services.find((s) => s.slug === preselectedSlug) ?? null
  );
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    goal: "",
    message: "",
    rgpd: false
  });

  const today = useMemo(() => new Date(), []);
  const firstOfMonth = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return d;
  }, [today, monthOffset]);

  // Charger les créneaux quand une date est sélectionnée
  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetch(`/api/availability?date=${selectedDate}&duration=${service?.durationMin ?? 60}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []))
      .finally(() => setLoading(false));
  }, [selectedDate, service]);

  // Jours du mois
  const monthDays = useMemo(() => {
    const year = firstOfMonth.getFullYear();
    const month = firstOfMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // lundi = 0
    const days: { label: string; iso: string | null; past: boolean }[] = [];
    for (let i = 0; i < firstWeekday; i++) days.push({ label: "", iso: null, past: false });
    for (let d = 1; d <= lastDay; d++) {
      const date = new Date(year, month, d);
      const iso = date.toISOString().split("T")[0];
      const past = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      days.push({ label: String(d), iso, past });
    }
    return days;
  }, [firstOfMonth, today]);

  async function submit() {
    if (!service || !selectedSlot) return;
    if (!form.rgpd) {
      setError("Merci d'accepter le traitement de tes données.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          startsAt: selectedSlot.start,
          endsAt: selectedSlot.end,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          goal: form.goal,
          message: form.message
        })
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Erreur");
      }
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-brand-nude rounded-xl2 p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-brand-rose text-white flex items-center justify-center">
          <Check size={28} />
        </div>
        <h3 className="mt-5 font-serif text-2xl font-bold">Ta demande est envoyée !</h3>
        <p className="mt-3 text-brand-taupe max-w-md mx-auto">
          Un email de confirmation vient de partir. Élodie te recontacte très vite pour valider ton créneau.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl2 shadow-card border border-brand-divider overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-divider flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-taupe">
          {["Service", "Date", "Créneau", "Coordonnées"].map((label, i) => (
            <span key={label} className={`flex items-center gap-1 ${step >= i + 1 ? "text-brand-rose font-semibold" : ""}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center ${step >= i + 1 ? "bg-brand-rose text-white" : "bg-brand-divider"}`}>
                {i + 1}
              </span>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* STEP 1: Service */}
        {step === 1 && (
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4">Choisis ta prestation</h3>
            <div className="grid gap-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setService(s);
                    setStep(2);
                  }}
                  className={`text-left p-4 rounded-xl2 border transition ${
                    service?.id === s.id
                      ? "border-brand-rose bg-brand-nude"
                      : "border-brand-divider hover:border-brand-rose"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-sm text-brand-terracotta">{s.priceLabel}</span>
                  </div>
                  <div className="text-xs text-brand-taupe mt-1">{s.durationMin} min</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Date */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMonthOffset((m) => Math.max(0, m - 1))} className="p-2">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-serif text-xl font-semibold">
                {firstOfMonth.toLocaleDateString("fr-CH", { month: "long", year: "numeric" })}
              </h3>
              <button onClick={() => setMonthOffset((m) => m + 1)} className="p-2">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-7 text-xs text-center text-brand-taupe mb-2">
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((d, i) => (
                <button
                  key={i}
                  disabled={!d.iso || d.past}
                  onClick={() => {
                    if (!d.iso) return;
                    setSelectedDate(d.iso);
                    setStep(3);
                  }}
                  className={`aspect-square rounded-md text-sm transition ${
                    !d.iso
                      ? "invisible"
                      : d.past
                      ? "text-brand-divider"
                      : selectedDate === d.iso
                      ? "bg-brand-rose text-white"
                      : "hover:bg-brand-nude"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-6 text-sm text-brand-taupe">
              ← Retour
            </button>
          </div>
        )}

        {/* STEP 3: Slot */}
        {step === 3 && (
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4">
              Créneaux disponibles
            </h3>
            {loading ? (
              <p className="text-sm text-brand-taupe">Chargement...</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-brand-taupe">Aucun créneau sur ce jour. Choisis une autre date.</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {slots.map((s) => (
                  <button
                    key={s.start}
                    onClick={() => {
                      setSelectedSlot(s);
                      setStep(4);
                    }}
                    className={`px-3 py-2 rounded-md border text-sm transition ${
                      selectedSlot?.start === s.start
                        ? "bg-brand-rose text-white border-brand-rose"
                        : "border-brand-divider hover:border-brand-rose"
                    }`}
                  >
                    {new Date(s.start).toLocaleTimeString("fr-CH", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setStep(2)} className="mt-6 text-sm text-brand-taupe">
              ← Retour
            </button>
          </div>
        )}

        {/* STEP 4: Form */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">Tes coordonnées</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Prénom*" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
              <Input label="Nom*" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
              <Input label="Email*" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Input label="Téléphone*" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </div>
            <Input label="Ton objectif" value={form.goal} onChange={(v) => setForm({ ...form, goal: v })} />
            <Textarea label="Un message ?" value={form.message} onChange={(v) => setForm({ ...form, message: v })} />
            <label className="flex items-start gap-2 text-xs text-brand-taupe">
              <input
                type="checkbox"
                checked={form.rgpd}
                onChange={(e) => setForm({ ...form, rgpd: e.target.checked })}
                className="mt-0.5"
              />
              J'accepte que mes données soient utilisées pour traiter ma demande de réservation
              (voir <a href="/confidentialite" className="text-brand-terracotta underline">politique de confidentialité</a>).
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(3)} className="btn btn-outline flex-1">
                Retour
              </button>
              <button onClick={submit} disabled={loading} className="btn btn-primary flex-1 disabled:opacity-60">
                {loading ? "Envoi..." : "Confirmer la demande"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-brand-taupe">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 bg-brand-ivory border border-brand-divider rounded-md focus:border-brand-rose outline-none"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-brand-taupe">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full px-3 py-2 bg-brand-ivory border border-brand-divider rounded-md focus:border-brand-rose outline-none"
      />
    </label>
  );
}
