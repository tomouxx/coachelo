import Link from "next/link";
import { Check } from "lucide-react";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Tarifs" };
export const revalidate = 60;

export default async function TarifsPage() {
  const [tarifsS, pageS] = await Promise.all([
    getSettings("tarifs_plans").catch((): Record<string, string> => ({})),
    getSettings("tarifs").catch((): Record<string, string> => ({}))
  ]);

  const t = (key: string, fallback: string) => tarifsS[key] || fallback;
  const p = (key: string, fallback: string) => pageS[key] || fallback;

  const plans = [
    {
      name: t("tarif_plan1_name", "Découverte"),
      price: t("tarif_plan1_price", "90 CHF"),
      unit: t("tarif_plan1_unit", "la séance"),
      features: (t("tarif_plan1_features", "Séance de 60 minutes\nBilan initial inclus\nÀ domicile, extérieur ou salle\nSans engagement")).split("\n").filter(Boolean),
      cta: t("tarif_plan1_cta", "Réserver"),
      featured: false,
      tag: ""
    },
    {
      name: t("tarif_plan2_name", "Transformation"),
      price: t("tarif_plan2_price", "790 CHF"),
      unit: t("tarif_plan2_unit", "pack 10 séances"),
      features: (t("tarif_plan2_features", "10 séances de coaching\nBilan nutrition inclus\nPlan d'entraînement personnalisé\nSuivi WhatsApp\nValidité 4 mois")).split("\n").filter(Boolean),
      cta: t("tarif_plan2_cta", "Choisir ce pack"),
      featured: true,
      tag: t("tarif_plan2_tag", "Le plus populaire")
    },
    {
      name: t("tarif_plan3_name", "Sur mesure"),
      price: t("tarif_plan3_price", "Sur devis"),
      unit: t("tarif_plan3_unit", ""),
      features: (t("tarif_plan3_features", "Format 100% adapté\nCoaching + nutrition\nPrésentiel + en ligne\nAccompagnement longue durée")).split("\n").filter(Boolean),
      cta: t("tarif_plan3_cta", "Demander un devis"),
      featured: false,
      tag: ""
    }
  ];

  const footerNote = t("tarif_footer_note", "Tarifs en francs suisses (CHF). Déplacement dans un rayon de 15 km autour de Poliez-Pittet inclus.");
  const pageDescription = t("tarif_page_description", "Première séance découverte offerte. Paiement par virement, TWINT ou facture. Échelonnement possible pour le pack Transformation.");

  return (
    <>
      <section className="container-editorial pt-20 pb-12 text-center">
        <p className="eyebrow">Tarifs</p>
        <h1 className="section-title mt-3">{p("services_page_title", "Des formules claires, pas de surprise")}</h1>
        <p className="mt-5 max-w-xl mx-auto text-brand-taupe">{pageDescription}</p>
      </section>

      <section className="container-editorial pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((pl) => (
            <div
              key={pl.name}
              className={`rounded-xl2 p-8 flex flex-col ${
                pl.featured
                  ? "bg-brand-dark text-brand-ivory shadow-soft relative"
                  : "bg-white border border-brand-divider"
              }`}
            >
              {pl.tag && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-rose text-white text-xs uppercase tracking-wider px-3 py-1 rounded-full">
                  {pl.tag}
                </span>
              )}
              <h3 className="font-serif text-2xl font-bold">{pl.name}</h3>
              <div className="mt-4">
                <span className={`font-serif text-4xl font-bold ${pl.featured ? "text-brand-roseLight" : "text-brand-rose"}`}>{pl.price}</span>
                {pl.unit && <span className="ml-2 text-sm opacity-70">{pl.unit}</span>}
              </div>
              <ul className="mt-6 space-y-3 text-sm flex-1">
                {pl.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} className={pl.featured ? "text-brand-roseLight mt-0.5" : "text-brand-rose mt-0.5"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={`mt-8 btn ${pl.featured ? "btn-primary" : "btn-outline"}`}>
                {pl.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-brand-taupe">{footerNote}</p>
      </section>
    </>
  );
}
