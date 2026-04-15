import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = { title: "Tarifs" };

const plans = [
  {
    name: "Découverte",
    price: "90 CHF",
    unit: "la séance",
    features: [
      "Séance de 60 minutes",
      "Bilan initial inclus",
      "À domicile, extérieur ou salle",
      "Sans engagement"
    ],
    cta: "Réserver",
    featured: false
  },
  {
    name: "Transformation",
    price: "790 CHF",
    unit: "pack 10 séances",
    features: [
      "10 séances de coaching",
      "Bilan nutrition inclus",
      "Plan d'entraînement personnalisé",
      "Suivi WhatsApp",
      "Validité 4 mois"
    ],
    cta: "Choisir ce pack",
    featured: true,
    tag: "Le plus populaire"
  },
  {
    name: "Sur mesure",
    price: "Sur devis",
    unit: "",
    features: [
      "Format 100% adapté",
      "Coaching + nutrition",
      "Présentiel + en ligne",
      "Accompagnement longue durée"
    ],
    cta: "Demander un devis",
    featured: false
  }
];

export default function TarifsPage() {
  return (
    <>
      <section className="container-editorial pt-20 pb-12 text-center">
        <p className="eyebrow">Tarifs</p>
        <h1 className="section-title mt-3">Des formules claires, pas de surprise</h1>
        <p className="mt-5 max-w-xl mx-auto text-brand-taupe">
          Première séance découverte offerte. Paiement par virement, TWINT ou facture. Échelonnement
          possible pour le pack Transformation.
        </p>
      </section>

      <section className="container-editorial pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl2 p-8 flex flex-col ${
                p.featured
                  ? "bg-brand-dark text-brand-ivory shadow-soft relative"
                  : "bg-white border border-brand-divider"
              }`}
            >
              {p.tag && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-rose text-white text-xs uppercase tracking-wider px-3 py-1 rounded-full">
                  {p.tag}
                </span>
              )}
              <h3 className="font-serif text-2xl font-bold">{p.name}</h3>
              <div className="mt-4">
                <span className={`font-serif text-4xl font-bold ${p.featured ? "text-brand-roseLight" : "text-brand-rose"}`}>{p.price}</span>
                {p.unit && <span className="ml-2 text-sm opacity-70">{p.unit}</span>}
              </div>
              <ul className="mt-6 space-y-3 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} className={p.featured ? "text-brand-roseLight mt-0.5" : "text-brand-rose mt-0.5"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-8 btn ${p.featured ? "btn-primary" : "btn-outline"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-brand-taupe">
          Tarifs en francs suisses (CHF). Déplacement dans un rayon de 15 km autour de Poliez-Pittet inclus.
        </p>
      </section>
    </>
  );
}
