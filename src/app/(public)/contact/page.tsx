import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = { title: "Contact & Réservation" };

export default async function ContactPage({ searchParams }: { searchParams: { service?: string } }) {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true, durationMin: true, priceLabel: true }
  }).catch(() => []);

  return (
    <>
      <section className="container-editorial pt-20 pb-12 text-center">
        <p className="eyebrow">Contact</p>
        <h1 className="section-title mt-3">Réservons ta première séance</h1>
        <p className="mt-5 max-w-xl mx-auto text-brand-taupe">
          Trois chemins possibles : réserver un créneau, m'envoyer un message, ou planifier un appel découverte offert.
        </p>
      </section>

      <section className="container-editorial pb-24 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-semibold mb-4">Réserver une séance</h2>
          <BookingForm services={services} preselectedSlug={searchParams.service} />
        </div>

        <aside className="space-y-8">
          <div id="decouverte" className="bg-brand-dark text-brand-ivory rounded-xl2 p-8">
            <h3 className="font-serif text-xl font-semibold text-brand-roseLight">Appel découverte 15 min</h3>
            <p className="mt-3 text-sm text-brand-ivory/80">
              On fait connaissance, on parle de tes objectifs, on voit si on est faites pour
              travailler ensemble. Sans engagement.
            </p>
            <a href="tel:+41000000000" className="mt-5 btn btn-primary w-full">
              Planifier mon appel
            </a>
          </div>

          <div className="bg-brand-nude rounded-xl2 p-8 space-y-3 text-sm">
            <h3 className="font-serif text-xl font-semibold">Mes coordonnées</h3>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand-rose" /> Poliez-Pittet, Suisse</p>
            <p className="flex items-center gap-2"><Mail size={16} className="text-brand-rose" /> contact@elodieduhayon.ch</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-brand-rose" /> +41 00 000 00 00</p>
            <p className="flex items-center gap-2"><Clock size={16} className="text-brand-rose" /> Lun-Ven 8h-19h · Sam 9h-13h</p>
          </div>

          <div className="rounded-xl2 overflow-hidden border border-brand-divider">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=6.6%2C46.6%2C6.7%2C46.7&layer=mapnik"
              className="w-full aspect-video"
              loading="lazy"
              title="Carte Poliez-Pittet"
            />
          </div>
        </aside>
      </section>
    </>
  );
}
