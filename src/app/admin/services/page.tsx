import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-dark mb-2">Prestations</h1>
      <p className="text-brand-taupe mb-6">Gère les formules de coaching proposées sur le site.</p>
      <ServicesClient initialServices={services} />
    </div>
  );
}
