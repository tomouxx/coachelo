import { prisma } from "@/lib/prisma";
import ReservationsClient from "./ReservationsClient";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const bookings = await prisma.booking.findMany({
    include: { service: true },
    orderBy: { startsAt: "desc" },
    take: 200
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-dark mb-2">Réservations</h1>
      <p className="text-brand-taupe mb-6">Gère toutes tes demandes et séances planifiées.</p>

      <ReservationsClient
        initialBookings={bookings.map((b) => ({
          id: b.id,
          firstName: b.firstName,
          lastName: b.lastName,
          email: b.email,
          phone: b.phone,
          status: b.status,
          goal: b.goal,
          message: b.message,
          startsAt: b.startsAt.toISOString(),
          endsAt: b.endsAt.toISOString(),
          serviceName: b.service.name
        }))}
      />
    </div>
  );
}
