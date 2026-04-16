import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = { title: "Services" };
export const revalidate = 60;

const perks: Record<string, string[]> = {
  HOME: ["Aucun déplacement", "Matériel adapté fourni", "Horaires flexibles", "Suivi personnalisé"],
  OUTDOOR: ["Pleine nature", "Variété des environnements", "Effet énergisant", "Cardio + renforcement"],
  GYM: ["Accès équipement complet", "Encadrement technique", "Progressivité", "Idéal objectifs muscu"],
  ONLINE: ["Plan écrit détaillé", "Vidéos d'exercices", "Suivi mensuel en visio", "Liberté totale"]
};

export default async function ServicesPage() {
  const [services, faqSettings] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    getSettings("services_faq").catch((): Record<string, string> => ({}))
  ]);

  // Build FAQ items from settings
  const faqItems = [
    {
      q: faqSettings["faq_q1"] || "Combien de temps dure une séance ?",
      a: faqSettings["faq_a1"] || "Généralement 60 minutes. Les premiers bilans durent 75 à 90 minutes."
    },
    {
      q: faqSettings["faq_q2"] || "Je suis débutante, c'est adapté ?",
      a: faqSettings["faq_a2"] || "Absolument. Tout est construit en fonction de ton niveau et de ton rythme."
    },
    {
      q: faqSettings["faq_q3"] || "Quel est le délai pour annuler ?",
      a: faqSettings["faq_a3"] || "Merci de prévenir au moins 24h à l'avance. Au-delà, la séance est due."
    },
    {
      q: faqSettings["faq_q4"] || "Puis-je mixer plusieurs formats ?",
      a: faqSettings["faq_a4"] || "Oui, c'est même recommandé : un peu de salle, un peu d'extérieur, suivi en ligne."
    }
  ];

  return (
    <>
      <section className="container-editorial pt-20 pb-12">
        <p className="eyebrow">Services</p>
        <h1 className="section-title mt-3 max-w-3xl">Un coaching qui s'adapte à ta vie</h1>
        <p className="mt-6 max-w-3xl text-lg text-brand-dark/85 leading-relaxed">
          Quatre formats pour répondre à ta réalité. Toujours la même exigence, toujours le même cap.
        </p>
      </section>

      <section className="container-editorial pb-24 space-y-20">
        {services.map((s, i) => (
          <article
            key={s.id}
            className={`grid gap-10 md:grid-cols-2 items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
          >
            <div className="relative aspect-[4/3] bg-brand-nude rounded-xl2 overflow-hidden flex items-center justify-center">
              <span className="font-serif text-8xl text-brand-rose/30">{i + 1}</span>
            </div>
            <div>
              <p className="eyebrow">{s.priceLabel}</p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">{s.name}</h2>
              <p className="mt-4 text-brand-dark/85 leading-relaxed">{s.description}</p>
              <ul className="mt-6 space-y-2">
                {(perks[s.location] ?? []).map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Check className="text-brand-rose mt-0.5" size={16} /> {p}
                  </li>
                ))}
              </ul>
              <Link href={`/contact?service=${s.slug}`} className="mt-6 btn btn-primary">
                Réserver
              </Link>
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
          <h2 className="font-serif text-display-md font-bold">On commence ?</h2>
          <Link href="/contact" className="mt-6 btn btn-primary inline-block">Réserver une séance</Link>
        </div>
      </section>
    </>
  );
}
