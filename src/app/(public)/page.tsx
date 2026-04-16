import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import {
  ArrowRight, Home, Trees, Dumbbell, Laptop, Check,
  Heart, ShieldCheck, Sparkles,
  ClipboardList, Salad, LineChart
} from "lucide-react";

export const revalidate = 60;

const locationIcon: Record<string, any> = {
  HOME: Home, OUTDOOR: Trees, GYM: Dumbbell, ONLINE: Laptop
};

export default async function HomePage() {
  const [
    services, testimonials, latestPosts,
    heroS, images, homeS, aboutS, extraS,
    nutritionS, nutritionExtraS, tarifsS, tarifsPlansS,
    servicesS, faqSettings
  ] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, take: 6 }).catch(() => []),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }).catch(() => []),
    getSettings("hero").catch((): Record<string, string> => ({})),
    getSettings("images").catch((): Record<string, string> => ({})),
    getSettings("home_sections").catch((): Record<string, string> => ({})),
    getSettings("about").catch((): Record<string, string> => ({})),
    getSettings("about_extra").catch((): Record<string, string> => ({})),
    getSettings("nutrition").catch((): Record<string, string> => ({})),
    getSettings("nutrition_extra").catch((): Record<string, string> => ({})),
    getSettings("tarifs").catch((): Record<string, string> => ({})),
    getSettings("tarifs_plans").catch((): Record<string, string> => ({})),
    getSettings("services_page").catch((): Record<string, string> => ({})),
    getSettings("services_faq").catch((): Record<string, string> => ({}))
  ]);

  // Helpers
  const s = (key: string, fallback: string) => homeS[key] || fallback;
  const t = (key: string, fallback: string) => tarifsPlansS[key] || fallback;

  // Images
  const imgHeroBg = images["img_hero_bg"] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80";
  const imgPortrait = images["img_portrait_elodie"] || "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=80";
  const imgNutritionBg = images["img_home_nutrition_bg"] || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80";
  const imgNutritionPhil = images["img_nutrition_philosophy"] || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80";

  const serviceImages: Record<string, string> = {
    HOME: images["img_service_home"] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    OUTDOOR: images["img_service_outdoor"] || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
    GYM: images["img_service_gym"] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    ONLINE: images["img_service_online"] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"
  };

  // About
  const introText = aboutS["about_page_intro_text"] || "Mon parcours n'a pas commencé dans une salle de sport. Il a commencé à l'hôpital, auprès de personnes fragiles, en fin de vie ou en reprise d'autonomie. C'est là que j'ai appris à observer, écouter, respecter un corps.";
  const bioBody = extraS["about_bio_body"] || "<p>Infirmière diplômée d'État, j'ai passé huit années en milieu hospitalier et en EHPAD. La gériatrie et les soins palliatifs m'ont enseigné la rigueur, la patience et la lecture fine du corps humain.</p><p>J'ai choisi de déplacer mon action : plutôt que de réparer, accompagner en amont. Le sport et la nutrition sont devenus mon nouveau champ d'intervention.</p>";
  const credentials = (extraS["about_credentials"] || "Infirmière Diplômée d'État (IDE)\nCertification coach sportif\nSpécialisation nutrition sportive").split("\n").filter(Boolean);

  // Nutrition
  const philTitle = nutritionS["nutrition_philosophy_title"] || "Mange vrai. Mange juste.";
  const philBody = nutritionS["nutrition_philosophy_body"] || "Je n'impose ni régime strict ni liste d'interdits. Je crois en une alimentation vivante, plaisir, construite autour de ton mode de vie.";
  const nutritionBullets = (nutritionExtraS["nutrition_bullets"] || "Produits bruts et de saison en priorité\nPas d'interdits, pas de calculs obsessionnels\nAlliance coaching sport + nutrition").split("\n").filter(Boolean);

  // Services perks
  const perks: Record<string, string[]> = {
    HOME: (servicesS["services_perks_home"] || "Aucun déplacement\nMatériel adapté fourni\nHoraires flexibles\nSuivi personnalisé").split("\n").filter(Boolean),
    OUTDOOR: (servicesS["services_perks_outdoor"] || "Pleine nature\nVariété des environnements\nEffet énergisant\nCardio + renforcement").split("\n").filter(Boolean),
    GYM: (servicesS["services_perks_gym"] || "Accès équipement complet\nEncadrement technique\nProgressivité\nIdéal objectifs muscu").split("\n").filter(Boolean),
    ONLINE: (servicesS["services_perks_online"] || "Plan écrit détaillé\nVidéos d'exercices\nSuivi mensuel en visio\nLiberté totale").split("\n").filter(Boolean)
  };

  // Tarifs
  const plans = [
    {
      name: t("tarif_plan1_name", "Découverte"),
      price: t("tarif_plan1_price", "90 CHF"),
      unit: t("tarif_plan1_unit", "la séance"),
      features: (t("tarif_plan1_features", "Séance de 60 minutes\nBilan initial inclus\nÀ domicile, extérieur ou salle\nSans engagement")).split("\n").filter(Boolean),
      featured: false, tag: ""
    },
    {
      name: t("tarif_plan2_name", "Transformation"),
      price: t("tarif_plan2_price", "790 CHF"),
      unit: t("tarif_plan2_unit", "pack 10 séances"),
      features: (t("tarif_plan2_features", "10 séances de coaching\nBilan nutrition inclus\nPlan d'entraînement personnalisé\nSuivi WhatsApp\nValidité 4 mois")).split("\n").filter(Boolean),
      featured: true, tag: t("tarif_plan2_tag", "Le plus populaire")
    },
    {
      name: t("tarif_plan3_name", "Sur mesure"),
      price: t("tarif_plan3_price", "Sur devis"),
      unit: t("tarif_plan3_unit", ""),
      features: (t("tarif_plan3_features", "Format 100% adapté\nCoaching + nutrition\nPrésentiel + en ligne\nAccompagnement longue durée")).split("\n").filter(Boolean),
      featured: false, tag: ""
    }
  ];

  // FAQ
  const faqItems = [
    { q: faqSettings["faq_q1"] || "Combien de temps dure une séance ?", a: faqSettings["faq_a1"] || "Généralement 60 minutes. Les premiers bilans durent 75 à 90 minutes." },
    { q: faqSettings["faq_q2"] || "Je suis débutante, c'est adapté ?", a: faqSettings["faq_a2"] || "Absolument. Tout est construit en fonction de ton niveau et de ton rythme." },
    { q: faqSettings["faq_q3"] || "Quel est le délai pour annuler ?", a: faqSettings["faq_a3"] || "Merci de prévenir au moins 24h à l'avance. Au-delà, la séance est due." },
    { q: faqSettings["faq_q4"] || "Puis-je mixer plusieurs formats ?", a: faqSettings["faq_a4"] || "Oui, c'est même recommandé : un peu de salle, un peu d'extérieur, suivi en ligne." }
  ];

  return (
    <>
      {/* ═══════════════ HERO — parallax ═══════════════ */}
      <section className="relative min-h-screen flex items-center bg-brand-dark text-brand-ivory overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: `url('${imgHeroBg}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-transparent" aria-hidden />
        <div className="container-editorial relative py-24">
          <p className="eyebrow text-brand-roseLight">
            {heroS["home_hero_eyebrow"] || "Coach sportive & nutrition · Suisse"}
          </p>
          <h1 className="mt-5 font-serif font-bold text-display-lg md:text-display-xl leading-tight max-w-3xl">
            {heroS["home_hero_title"] || "Coach sportive & nutrition à ton rythme"}
          </h1>
          <p className="mt-6 max-w-lg text-brand-ivory/80 text-lg leading-relaxed">
            {heroS["home_hero_subtitle"] || "Coaching personnalisé à domicile, en extérieur, en salle et en ligne — depuis Poliez-Pittet."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/reservation" className="btn btn-primary">
              Réserver une séance <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn btn-ghost-light">
              Appel découverte offert
            </Link>
          </div>
          <p className="mt-8 text-xs uppercase tracking-wider text-brand-ivory/60">
            {s("home_credential", "Infirmière Diplômée d'État · Certifiée coach sportif")}
          </p>
        </div>
      </section>

      {/* ═══════════════ TRUST STRIP ═══════════════ */}
      <section className="bg-brand-nude">
        <div className="container-editorial py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Home, label: "À domicile" },
            { icon: Trees, label: "En extérieur" },
            { icon: Dumbbell, label: "En salle" },
            { icon: Laptop, label: "En ligne" }
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="text-brand-rose" size={26} />
              <span className="text-sm font-medium text-brand-dark">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ À PROPOS ═══════════════ */}
      <section id="about" className="container-editorial py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 border border-brand-roseLight/40">
          <Image src={imgPortrait} alt="Portrait d'Élodie" fill className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">À propos</p>
          <h2 className="section-title mt-3">{extraS["about_page_title"] || "De soignante à coach, au service de ton bien-être"}</h2>
          <p className="mt-5 text-brand-dark/85 leading-relaxed">{introText}</p>
          <div className="mt-5 space-y-3 text-brand-dark/90 leading-relaxed prose prose-p:my-3" dangerouslySetInnerHTML={{ __html: bioBody }} />

          {/* Valeurs */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Heart, title: "Écoute" },
              { icon: ShieldCheck, title: "Rigueur" },
              { icon: Sparkles, title: "Bienveillance" }
            ].map(({ icon: Icon, title }) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto text-brand-rose" size={22} />
                <span className="block mt-1 text-xs font-semibold uppercase tracking-wider text-brand-taupe">{title}</span>
              </div>
            ))}
          </div>

          {/* Diplômes */}
          <div className="mt-6 flex flex-wrap gap-2">
            {credentials.map((c) => (
              <span key={c} className="text-xs bg-brand-nude border border-brand-divider rounded-full px-3 py-1">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES — parallax ═══════════════ */}
      <section id="services" className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url('${serviceImages["OUTDOOR"]}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-ivory/95" aria-hidden />
        <div className="container-editorial relative py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow">Services</p>
            <h2 className="section-title mt-3">{tarifsS["services_page_title"] || "Un coaching qui s'adapte à ta vie"}</h2>
            <p className="mt-4 text-brand-taupe">{tarifsS["services_page_subtitle"] || "Quatre formats pour répondre à ta réalité."}</p>
          </div>
          <div className="space-y-20">
            {services.map((sv, i) => (
              <article
                key={sv.id}
                className={`grid gap-10 md:grid-cols-2 items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
              >
                <div className="relative aspect-[4/3] bg-brand-nude rounded-xl2 overflow-hidden shadow-card">
                  <Image
                    src={serviceImages[sv.location] || serviceImages["HOME"]}
                    alt={sv.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="eyebrow">{sv.priceLabel}</p>
                  <h3 className="mt-2 font-serif text-3xl font-bold">{sv.name}</h3>
                  <p className="mt-4 text-brand-dark/85 leading-relaxed">{sv.description}</p>
                  <ul className="mt-6 space-y-2">
                    {(perks[sv.location] ?? []).map((pk) => (
                      <li key={pk} className="flex items-start gap-2 text-sm">
                        <Check className="text-brand-rose mt-0.5" size={16} /> {pk}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/reservation?service=${sv.slug}`} className="mt-6 btn btn-primary inline-flex items-center gap-2">
                    Réserver <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NUTRITION — parallax ═══════════════ */}
      <section id="nutrition" className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url('${imgNutritionBg}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-dark/60" aria-hidden />
        <div className="container-editorial relative py-24 text-brand-ivory">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow text-brand-roseLight">Nutrition</p>
            <h2 className="mt-3 font-serif text-display-md md:text-display-lg font-bold">
              {nutritionS["nutrition_hero_title"] || "La nutrition, moitié du chemin"}
            </h2>
            <p className="mt-5 text-brand-ivory/80 leading-relaxed">
              {nutritionS["nutrition_hero_subtitle"] || "Une approche durable, concrète, sans régime ni culpabilité."}
            </p>
          </div>

          {/* Méthode */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {[
              { icon: ClipboardList, title: nutritionS["nutrition_method_step1"] || "1. Bilan nutritionnel", body: nutritionS["nutrition_method_step1_desc"] || "On analyse ton quotidien, tes contraintes, tes goûts et tes objectifs." },
              { icon: Salad, title: nutritionS["nutrition_method_step2"] || "2. Plan personnalisé", body: nutritionS["nutrition_method_step2_desc"] || "Un plan alimentaire clair, avec recettes simples et alternatives." },
              { icon: LineChart, title: nutritionS["nutrition_method_step3"] || "3. Suivi & ajustements", body: nutritionS["nutrition_method_step3_desc"] || "Points réguliers pour ajuster selon tes progrès et ta vie." }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm rounded-xl2 p-8 border border-white/10">
                <Icon className="text-brand-roseLight" size={28} />
                <h3 className="mt-4 font-serif text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-brand-ivory/70 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Philosophie */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden">
              <Image src={imgNutritionPhil} alt="Alimentation saine" fill className="object-cover" />
            </div>
            <div>
              <p className="eyebrow text-brand-roseLight">Ma philosophie</p>
              <h3 className="mt-3 font-serif text-3xl font-bold">{philTitle}</h3>
              <p className="mt-5 leading-relaxed text-brand-ivory/85">{philBody}</p>
              <ul className="mt-6 space-y-2 text-sm text-brand-ivory/80">
                {nutritionBullets.map((b) => (
                  <li key={b} className="flex items-start gap-2"><Check size={14} className="text-brand-roseLight mt-0.5" /> {b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TARIFS ═══════════════ */}
      <section id="tarifs" className="bg-brand-ivory">
        <div className="container-editorial py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow">Tarifs</p>
            <h2 className="section-title mt-3">{tarifsS["services_page_title"] || "Des formules claires, pas de surprise"}</h2>
          </div>
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
                <Link href="/reservation" className={`mt-8 btn ${pl.featured ? "btn-primary" : "btn-outline"}`}>
                  Réserver
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-brand-taupe">
            {t("tarif_footer_note", "Tarifs en francs suisses (CHF). Déplacement dans un rayon de 15 km autour de Poliez-Pittet inclus.")}
          </p>
        </div>
      </section>

      {/* ═══════════════ TÉMOIGNAGES ═══════════════ */}
      {testimonials.length > 0 && (
        <section id="temoignages" className="bg-brand-nude">
          <div className="container-editorial py-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow">Témoignages</p>
              <h2 className="section-title mt-3">{s("home_testimonials_title", "Leur expérience avec Élodie")}</h2>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {testimonials.map((tm) => (
                <figure key={tm.id} className="break-inside-avoid bg-white rounded-xl2 p-7 shadow-card">
                  <div className="flex gap-1 text-brand-rose mb-3">
                    {Array.from({ length: tm.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <blockquote className="font-serif italic text-brand-dark/90 leading-relaxed">
                    « {tm.quote} »
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">{tm.name}</span>
                    {tm.program && <span className="text-brand-taupe"> · {tm.program}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ COMMENT ÇA SE PASSE ═══════════════ */}
      <section className="container-editorial py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow">{s("home_steps_eyebrow", "Comment ça se passe")}</p>
          <h2 className="section-title mt-3">{s("home_steps_title", "Quatre étapes simples")}</h2>
        </div>
        <ol className="grid gap-8 md:grid-cols-4">
          {[
            { n: 1, title: s("home_step1_title", "Appel découverte"), body: s("home_step1_desc", "15 min offerts pour faire connaissance.") },
            { n: 2, title: s("home_step2_title", "Bilan & objectifs"), body: s("home_step2_desc", "On définit ensemble un cap clair.") },
            { n: 3, title: s("home_step3_title", "Programme sur mesure"), body: s("home_step3_desc", "Un plan adapté à ta vie.") },
            { n: 4, title: s("home_step4_title", "Suivi & résultats"), body: s("home_step4_desc", "On ajuste, on progresse, on célèbre.") }
          ].map((step) => (
            <li key={step.n} className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-brand-rose text-white flex items-center justify-center font-serif text-lg">
                {step.n}
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-brand-taupe leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="bg-brand-nude">
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

      {/* ═══════════════ BLOG TEASER ═══════════════ */}
      {latestPosts.length > 0 && (
        <section className="bg-brand-ivory">
          <div className="container-editorial py-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow">{s("home_blog_eyebrow", "Journal")}</p>
              <h2 className="section-title mt-3">{s("home_blog_title", "Conseils sport & nutrition")}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {latestPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group block bg-white rounded-xl2 overflow-hidden shadow-card">
                  {p.coverUrl && (
                    <div className="relative aspect-video">
                      <Image src={p.coverUrl} alt={p.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    {p.category && <span className="eyebrow">{p.category}</span>}
                    <h3 className="mt-2 font-serif text-lg font-semibold group-hover:text-brand-terracotta transition">{p.title}</h3>
                    <p className="mt-2 text-sm text-brand-taupe line-clamp-3">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/blog" className="text-brand-terracotta font-semibold inline-flex items-center gap-2">
                Voir tous les articles <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA FINAL — parallax ═══════════════ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url('${imgHeroBg}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-dark/70" aria-hidden />
        <div className="container-editorial relative py-24 text-brand-ivory text-center">
          <h2 className="font-serif text-display-md md:text-display-lg font-bold">
            {s("home_cta_title", "Prête à te lancer ?")}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/reservation" className="btn btn-primary">Réserver une séance</Link>
            <Link href="/contact" className="btn btn-ghost-light">Appel découverte offert</Link>
          </div>
        </div>
      </section>
    </>
  );
}
