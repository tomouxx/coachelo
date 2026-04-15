import { prisma } from "@/lib/prisma";
import TemoignagesClient from "./TemoignagesClient";

export const dynamic = "force-dynamic";

export default async function TemoignagesPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-dark mb-2">Témoignages</h1>
      <p className="text-brand-taupe mb-6">Publie les avis de tes clientes sur le site.</p>
      <TemoignagesClient initialTestimonials={testimonials} />
    </div>
  );
}
