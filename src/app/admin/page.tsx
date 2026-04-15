import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Users, MessageSquare, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const [pending, upcoming, totalContacts, totalPosts, lastBookings] = await Promise.all([
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({
      where: { status: { in: ["PENDING", "CONFIRMED"] }, startsAt: { gte: now, lte: in7d } }
    }),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.blogPost.count(),
    prisma.booking.findMany({
      include: { service: true },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ]);

  const stats = [
    { label: "En attente", value: pending, icon: Calendar, href: "/admin/reservations" },
    { label: "Cette semaine", value: upcoming, icon: Users, href: "/admin/reservations" },
    { label: "Messages à traiter", value: totalContacts, icon: MessageSquare, href: "/admin/reservations" },
    { label: "Articles blog", value: totalPosts, icon: FileText, href: "/admin/blog" }
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-dark mb-2">Bonjour Élodie 🌸</h1>
      <p className="text-brand-taupe mb-8">Voici un aperçu de ton activité.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-md transition"
          >
            <s.icon className="w-6 h-6 text-brand-rose mb-3" />
            <div className="text-3xl font-serif text-brand-dark">{s.value}</div>
            <div className="text-sm text-brand-taupe">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-soft">
        <h2 className="font-serif text-xl text-brand-dark mb-4">Dernières réservations</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-brand-taupe border-b border-brand-divider">
              <th className="py-2">Date</th>
              <th>Client</th>
              <th>Prestation</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {lastBookings.map((b) => (
              <tr key={b.id} className="border-b border-brand-divider/50">
                <td className="py-3">
                  {new Intl.DateTimeFormat("fr-CH", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  }).format(b.startsAt)}
                </td>
                <td>{b.firstName} {b.lastName}</td>
                <td>{b.service.name}</td>
                <td>
                  <StatusPill status={b.status} />
                </td>
              </tr>
            ))}
            {lastBookings.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-brand-taupe text-center">Aucune réservation pour le moment</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    NO_SHOW: "bg-gray-100 text-gray-800"
  };
  const labels: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    CANCELLED: "Annulée",
    COMPLETED: "Effectuée",
    NO_SHOW: "Absente"
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}
