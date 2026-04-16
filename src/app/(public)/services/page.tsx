import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

export const metadata = { title: "Services" };
export const revalidate = 60;

export default async function ServicesPage() {
  const [services, faqSettings, tarifsS, servicesS, images] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    getSettings("services_faq").catch((): Record<string, string> => ({})),
    getSettings("tarifs").catch((): Record<string, string> => ({})),
    getSettings("services_page").catch((): Record<string, string> => ({})),
    getSettings("images").catch((): Record<string, string> => ({}))
  ]);

  // Build perks from settings
  const perks: Record<string, string[]> = {
    HOME: (servicesS["services_perks_home"] || "Aucun déplacement\nMatériel adapté fourni\nHoraires flexibles\nSuivi personnalisé").split("\n").filter(Boolean),
    OUTDOOR: (servicesS["services_perks_outdoor"] || "Pleine nature\nVariété des environnements\nEffet énergisant\nCardio + renforcement").split("\n").filter(Boolean),
    GYM: (servicesS["services_perks_gym"] || "Accès équipement complet\nEncadrement technique\nProgressivité\nIdéal objectifs muscu").split("\n").filter(Boolean),
    ONLINE: (servicesS["services_perks_online"] || "Plan écrit détaillé\nVidéos d'exercices\nSuivi mensuel en visio\nLiberté totale").split("\n").filter(Boolean)
  };

  const serviceImages: Record<string, string> = {
    HOME: images["img_service_home"] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    OUTDOOR: images["img_service_outdoor"] || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
    GYM: images["img_service_gym"] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    ONLINE: images["img_service_online"] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"
  };

  const ctaTitle = servicesS["services_cta_title"] || "On commence ?";
  const pageTitle = tarifsS["services_page_title"] || "Un coaching qui s'adapte à ta vie";
  const pageSubtitle = tarifsS["services_page_subtitle"] || "Quatre formats pour répondre à ta réalité. Toujours la même exigence, toujours le même cap.";

  // Build FAQ items from settings
  const faqItems = [
    { q: faqSettings["faq_q1"] || "Combien de temps dure une séance ?", a: faqSettings["faq_a1"] || "Généralement 60 minutes. Les premiers bilans durent 75 à 90 minutes." },
    { q: faqSettings["faq_q2"] || "Je suis débutante, c'est adapté ?", a: faqSettings["faq_a2"] || "Absolument. Tout est construit en fonction de ton niveau et de ton rythme." },
    { q: faqSettings["faq_q3"] || "Quel est le délai pour annuler ?", a: faqSettings["faq_a3"] || "Merci de prévenir au moins 24h à l'avance. Au-delà, la séance est due." },
    { q: faqSettings["faq_q4"] || "Puis-je mixer plusieurs formats ?", a: faqSettings["faq_a4"] || "Oui, c'est même recommandé : un peu de salle, un peu d'extérieur, suivi en ligne." }
  ];

  return (
    <>
      <section className="container-editorial pt-20 pb-12">
        <p className="eyebrow">Services</p>
        <h1 className="section-title mt-3 max-w-3xl">{pageTitle}</h1>
        <p className="mt-6 max-w-3xl text-lg text-brand-dark/85 leading-relaxed">{pageSubtitle}</p>
      </section>

      <section className="container-editorial pb-24 space-y-20">
        {services.map((s, i) => (
          <article
            key={s.id}
            className={`grid gap-10 md:grid-cols-2 items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
          >
            <div className="relative aspect-[4/3] bg-brand-nude rounded-xl2 overflow-hidden">
              <Image
                src={serviceImages[s.location] || serviceImages["HOME"]}
                alt={s.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">{s.priceLabel}</p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">{s.name}</h2>
              <p className="mt-4 text-brand-dark/85 leading-relaxed">{s.description}</p>
              <ul className="mt-6 space-y-2">
                {(perks[s.location] ?? []).map((pk) => (
                  <li key={pk} className="flex items-start gap-2 text-sm">
                    <Check className="text-brand-rose mt-0.5" size={16} /> {pk}
                  </li>
                ))}
              </ul>
              <Link href={`/contact?service=${s.slug}`} className="mt-6 btn btn-primary">Réserver</Link>
            </div>
          </article>
        ))}
      </section>

      {/* FAQ */}
      <section className="bg-brand-nude">
        <div className="container-editorial py-24">
          <p className="eyebrow text-center">FAQ</p>
          <h2 className="section-title mt-3 text-center">Questions fréquentes</h2>
          <div className="max-w-3xl mx-auto mt-10 space-y-3">
            {faqItems.map((f) => (
              <details key={f.q} className="bg-white rounded-xl2 p-5 group shadow-card">
                <summary className="cursor-pointer font-semibold flex items-center justify-between">
                  {f.q}
                  <span className="text-brand-rose group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-sm text-brand-taupe">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-dark text-brand-ivory">
        <div className="container-editorial py-20 text-center">
          <h2 className="font-serif text-display-md font-bold">{ctaTitle}</h2>
          <Link href="/contact" className="mt-6 btn btn-primary inline-block">Réserver une séance</Link>
        </div>
      </section>
    </>
  );
}
