import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import BookingForm from "@/components/BookingForm";
import { Phone, MapPin, Clock } from "lucide-react";

export const metadata = { title: "Réservation" };

export default async function ReservationPage({ searchParams }: { searchParams: { service?: string } }) {
  const [services, contactS, pageS] = await Promise.all([
    prisma.service.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, slug: true, name: true, durationMin: true, priceLabel: true }
    }).catch(() => []),
    getSettings("contact_info").catch((): Record<string, string> => ({})),
    getSettings("contact_page").catch((): Record<string, string> => ({}))
  ]);

  const c = (key: string, fallback: string) => contactS[key] || fallback;
  const pg = (key: string, fallback: string) => pageS[key] || fallback;

  return (
    <>
      <section className="container-editorial pt-20 pb-12 text-center">
        <p className="eyebrow">Réservation</p>
        <h1 className="section-title mt-3">Réserve ta séance</h1>
        <p className="mt-5 max-w-xl mx-auto text-brand-taupe">
          Choisis ta prestation, un créneau, et c&apos;est parti.
        </p>
      </section>

      <section className="container-editorial pb-24 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingForm services={services} preselectedSlug={searchParams.service} />
        </div>

        <aside className="space-y-8">
          <div className="bg-brand-dark text-brand-ivory rounded-xl2 p-8">
            <h3 className="font-serif text-xl font-semibold text-brand-roseLight">
              {pg("contact_discovery_title", "Appel découverte 15 min")}
            </h3>
            <p className="mt-3 text-sm text-brand-ivory/80">
              {pg("contact_discovery_text", "On fait connaissance, on parle de tes objectifs, on voit si on est faites pour travailler ensemble. Sans engagement.")}
            </p>
            <a href={`tel:${c("contact_phone", "+41000000000").replace(/\s/g, "")}`} className="mt-5 btn btn-primary w-full">
              {pg("contact_discovery_cta", "Planifier mon appel")}
            </a>
          </div>

          <div className="bg-brand-nude rounded-xl2 p-8 space-y-3 text-sm">
            <h3 className="font-serif text-xl font-semibold">Infos pratiques</h3>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand-rose" /> {c("contact_address", "Poliez-Pittet, Suisse")}</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-brand-rose" /> {c("contact_phone", "+41 00 000 00 00")}</p>
            <p className="flex items-center gap-2"><Clock size={16} className="text-brand-rose" /> {pg("contact_hours", "Lun-Ven 8h-19h · Sam 9h-13h")}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
