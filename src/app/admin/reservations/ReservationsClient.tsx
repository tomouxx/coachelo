"use client";
import { useMemo, useState } from "react";
import { Check, X, Trash2 } from "lucide-react";

type Booking = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  goal: string | null;
  message: string | null;
  startsAt: string;
  endsAt: string;
  serviceName: string;
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  COMPLETED: "Effectuée",
  NO_SHOW: "Absente"
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  NO_SHOW: "bg-gray-100 text-gray-800"
};

export default function ReservationsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  async function update(id: string, status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const { booking } = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: booking.status } : b))
      );
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette réservation ?")) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (res.ok) setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              filter === f
                ? "bg-brand-rose text-white"
                : "bg-white text-brand-taupe hover:bg-brand-nude"
            }`}
          >
            {f === "ALL" ? "Toutes" : statusLabels[f]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-nude/30">
            <tr className="text-left">
              <th className="p-4">Date</th>
              <th>Client</th>
              <th>Contact</th>
              <th>Prestation</th>
              <th>Statut</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-brand-divider/50 align-top">
                <td className="p-4">
                  {new Intl.DateTimeFormat("fr-CH", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  }).format(new Date(b.startsAt))}
                </td>
                <td>
                  <div className="font-medium">{b.firstName} {b.lastName}</div>
                  {b.goal && <div className="text-xs text-brand-taupe mt-1">Objectif : {b.goal}</div>}
                  {b.message && <div className="text-xs text-brand-taupe mt-1 italic">« {b.message} »</div>}
                </td>
                <td>
                  <div className="text-xs">
                    <a href={`mailto:${b.email}`} className="text-brand-rose">{b.email}</a>
                    <br />
                    <a href={`tel:${b.phone}`} className="text-brand-taupe">{b.phone}</a>
                  </div>
                </td>
                <td>{b.serviceName}</td>
                <td>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                </td>
                <td className="text-right pr-4">
                  {b.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => update(b.id, "CONFIRMED")}
                        className="text-green-600 p-1 hover:bg-green-50 rounded"
                        title="Confirmer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => update(b.id, "CANCELLED")}
                        className="text-red-600 p-1 hover:bg-red-50 rounded ml-1"
                        title="Annuler"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {b.status === "CONFIRMED" && (
                    <button
                      onClick={() => update(b.id, "COMPLETED")}
                      className="text-blue-600 p-1 hover:bg-blue-50 rounded text-xs px-2"
                    >
                      Marquer effectuée
                    </button>
                  )}
                  <button
                    onClick={() => remove(b.id)}
                    className="text-gray-400 p-1 hover:bg-gray-100 rounded ml-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-brand-taupe">
                  Aucune réservation pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
