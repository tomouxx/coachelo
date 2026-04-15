"use client";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

const WEEKDAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

type Rule = {
  id: string;
  weekday: number;
  startMin: number;
  endMin: number;
  active: boolean;
};

type Exception = {
  id: string;
  date: string;
  allDayOff: boolean;
  note: string | null;
};

function toHHmm(mins: number) {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}
function fromHHmm(s: string) {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

export default function DisponibilitesClient({
  initialRules,
  initialExceptions
}: {
  initialRules: Rule[];
  initialExceptions: Exception[];
}) {
  const [rules, setRules] = useState(initialRules);
  const [exceptions, setExceptions] = useState(initialExceptions);
  const [newRule, setNewRule] = useState({ weekday: 1, start: "09:00", end: "18:00" });
  const [newException, setNewException] = useState({ date: "", note: "" });

  async function addRule() {
    const res = await fetch("/api/availability-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weekday: newRule.weekday,
        startMin: fromHHmm(newRule.start),
        endMin: fromHHmm(newRule.end),
        active: true
      })
    });
    if (res.ok) {
      const { rule } = await res.json();
      setRules([...rules, rule].sort((a, b) => a.weekday - b.weekday || a.startMin - b.startMin));
    }
  }

  async function removeRule(id: string) {
    const res = await fetch(`/api/availability-rules/${id}`, { method: "DELETE" });
    if (res.ok) setRules(rules.filter((r) => r.id !== id));
  }

  async function addException() {
    if (!newException.date) return;
    const res = await fetch("/api/availability-exceptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date(newException.date).toISOString(),
        allDayOff: true,
        note: newException.note || null
      })
    });
    if (res.ok) {
      const { exception } = await res.json();
      setExceptions(
        [...exceptions, { ...exception, date: exception.date }].sort((a, b) =>
          a.date.localeCompare(b.date)
        )
      );
      setNewException({ date: "", note: "" });
    }
  }

  async function removeException(id: string) {
    const res = await fetch(`/api/availability-exceptions/${id}`, { method: "DELETE" });
    if (res.ok) setExceptions(exceptions.filter((e) => e.id !== id));
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="font-serif text-xl mb-4">Horaires hebdomadaires</h2>
        <div className="space-y-2 mb-4">
          {rules.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between bg-brand-nude/20 px-4 py-2 rounded-lg text-sm"
            >
              <span>
                <strong>{WEEKDAYS[r.weekday]}</strong> — {toHHmm(r.startMin)} à {toHHmm(r.endMin)}
              </span>
              <button
                onClick={() => removeRule(r.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {rules.length === 0 && <p className="text-sm text-brand-taupe">Aucun horaire défini.</p>}
        </div>

        <div className="border-t border-brand-divider pt-4 space-y-3">
          <div className="flex gap-2">
            <select
              value={newRule.weekday}
              onChange={(e) => setNewRule({ ...newRule, weekday: Number(e.target.value) })}
              className="flex-1 px-3 py-2 border border-brand-divider rounded-lg text-sm"
            >
              {WEEKDAYS.map((d, i) => (
                <option key={i} value={i}>{d}</option>
              ))}
            </select>
            <input
              type="time"
              value={newRule.start}
              onChange={(e) => setNewRule({ ...newRule, start: e.target.value })}
              className="px-3 py-2 border border-brand-divider rounded-lg text-sm"
            />
            <input
              type="time"
              value={newRule.end}
              onChange={(e) => setNewRule({ ...newRule, end: e.target.value })}
              className="px-3 py-2 border border-brand-divider rounded-lg text-sm"
            />
          </div>
          <button
            onClick={addRule}
            className="w-full py-2 rounded-lg bg-brand-rose text-white hover:bg-brand-terracotta text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="font-serif text-xl mb-4">Jours fermés / exceptions</h2>
        <div className="space-y-2 mb-4">
          {exceptions.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between bg-brand-nude/20 px-4 py-2 rounded-lg text-sm"
            >
              <span>
                <strong>
                  {new Intl.DateTimeFormat("fr-CH", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }).format(new Date(e.date))}
                </strong>
                {e.note && <span className="text-brand-taupe"> — {e.note}</span>}
              </span>
              <button
                onClick={() => removeException(e.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {exceptions.length === 0 && (
            <p className="text-sm text-brand-taupe">Aucune exception pour les prochains jours.</p>
          )}
        </div>

        <div className="border-t border-brand-divider pt-4 space-y-2">
          <input
            type="date"
            value={newException.date}
            onChange={(e) => setNewException({ ...newException, date: e.target.value })}
            className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Note (optionnel)"
            value={newException.note}
            onChange={(e) => setNewException({ ...newException, note: e.target.value })}
            className="w-full px-3 py-2 border border-brand-divider rounded-lg text-sm"
          />
          <button
            onClick={addException}
            className="w-full py-2 rounded-lg bg-brand-rose text-white hover:bg-brand-terracotta text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Ajouter un jour fermé
          </button>
        </div>
      </div>
    </div>
  );
}
