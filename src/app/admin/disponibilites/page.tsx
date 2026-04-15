import { prisma } from "@/lib/prisma";
import DisponibilitesClient from "./DisponibilitesClient";

export const dynamic = "force-dynamic";

export default async function Disponibilites() {
  const [rules, exceptions] = await Promise.all([
    prisma.availabilityRule.findMany({ orderBy: [{ weekday: "asc" }, { startMin: "asc" }] }),
    prisma.availabilityException.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" }
    })
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-dark mb-2">Disponibilités</h1>
      <p className="text-brand-taupe mb-6">
        Définis tes créneaux hebdomadaires et ajoute des exceptions (vacances, absences…).
      </p>
      <DisponibilitesClient
        initialRules={rules}
        initialExceptions={exceptions.map((e) => ({
          id: e.id,
          date: e.date.toISOString(),
          allDayOff: e.allDayOff,
          note: e.note
        }))}
      />
    </div>
  );
}
