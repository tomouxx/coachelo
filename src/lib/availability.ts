import { prisma } from "./prisma";

// Retourne les créneaux disponibles pour une date donnée (YYYY-MM-DD)
// en tenant compte des règles hebdo, exceptions et réservations existantes.
export async function getAvailableSlots(date: Date, slotMinutes = 60) {
  const weekday = date.getDay();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  // Exceptions du jour
  const exception = await prisma.availabilityException.findFirst({
    where: { date: { gte: dayStart, lt: dayEnd } }
  });
  if (exception?.allDayOff) return [];

  // Règle du jour
  const rule = await prisma.availabilityRule.findFirst({
    where: { weekday, active: true }
  });
  if (!rule && !exception) return [];

  const startMin = exception?.startMin ?? rule?.startMin ?? 0;
  const endMin = exception?.endMin ?? rule?.endMin ?? 0;

  // Réservations existantes
  const bookings = await prisma.booking.findMany({
    where: {
      startsAt: { gte: dayStart, lt: dayEnd },
      status: { in: ["PENDING", "CONFIRMED"] }
    },
    select: { startsAt: true, endsAt: true }
  });

  const slots: { start: Date; end: Date }[] = [];
  for (let m = startMin; m + slotMinutes <= endMin; m += slotMinutes) {
    const slotStart = new Date(dayStart);
    slotStart.setMinutes(m);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotStart.getMinutes() + slotMinutes);

    // Conflit ?
    const conflict = bookings.some(
      (b) => slotStart < b.endsAt && slotEnd > b.startsAt
    );
    // Pas dans le passé
    if (slotStart <= new Date()) continue;
    if (!conflict) slots.push({ start: slotStart, end: slotEnd });
  }
  return slots;
}
