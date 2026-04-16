import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Témoignages" };
export const revalidate = 60;

export default async function TemoignagesPage() {
  const [list, pageS] = await Promise.all([
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    getSettings("temoignages_page").catch((): Record<string, string> => ({}))
  ]);

  const pageTitle = pageS["temoignages_page_title"] || "Leurs transformations";
  const pageDesc = pageS["temoignages_page_description"] || "Ils m'ont fait confiance. Voici leurs mots.";

  return (
    <>
      <section className="container-editorial pt-20 pb-12 text-center">
        <p className="eyebrow">Témoignages</p>
        <h1 className="section-title mt-3">{pageTitle}</h1>
        <p className="mt-5 max-w-xl mx-auto text-brand-taupe">{pageDesc}</p>
      </section>

      <section className="container-editorial pb-24 columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {list.map((t) => (
          <figure key={t.id} className="break-inside-avoid bg-brand-nude rounded-xl2 p-7 shadow-card">
            <div className="flex gap-1 text-brand-rose mb-3">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <blockquote className="font-serif italic text-brand-dark leading-relaxed">
              « {t.quote} »
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold">{t.name}</span>
              {t.program && <span className="text-brand-taupe"> · {t.program}</span>}
            </figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}
