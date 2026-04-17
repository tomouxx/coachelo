/**
 * ───────────────────────────────────────────────
 *  HOME — design system "Argile & Eucalyptus"
 *
 *  PHOTO MAPPING
 *  ─────────────
 *  Retenues (4/21) — contexte Hyrox/CrossFit, retouchées par overlays
 *                    pour adoucir le côté compétition :
 *
 *  • IMG_0004  → Hero portrait + témoignage bubble
 *    (sourire franc caméra, la seule photo chaleureuse, débardeur gris neutre)
 *  • IMG_0152  → About portrait principal
 *    (profil 3/4 sous verrière Grand Palais, lumière naturelle)
 *  • IMG_0142  → Service "Mouvement"
 *    (corde à sauter sous verrière, dynamique, ciel visible)
 *  • IMG_0075  → Section force/parcours
 *    (sourire sportif, traîneau — prouve l'aspect athlète)
 *
 *  Écartées (17) — expressions d'effort dures, arrière-plans saturés
 *  de sponsors (Puma, Gymshark, Concept2), contextes gym bruyants,
 *  incompatibles avec l'univers bien-être doux.
 *
 *  UNSPLASH — nutrition + lifestyle wellness (licence free commercial) :
 *  • hero lifestyle douceur : photo-1544367567-0f2fcb009e0b (yoga/wellness doux)
 *  • nutrition bowl matcha  : photo-1490645935967-10de6ba17061
 *  • nutrition flat lay     : photo-1505253758473-96b7015fcd40
 *  • nutrition fruits       : photo-1512621776951-a57141f2eefd
 *  • nutrition herbs/linen  : photo-1484723091739-30a097e8f929
 * ─────────────────────────────────────────────── */

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import {
  ArrowUpRight, Check, Quote, Heart, Leaf, Sparkles,
  Flower2, Wind, Sun
} from "lucide-react";

export const revalidate = 60;

/* ═══ PHOTOS ═══ */
const PHOTO = (n: string) => `/photo-elo/IMG_${n}.jpeg`;
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const photos = {
  // Real — Élodie
  heroPortrait: PHOTO("0004"),    // sourire caméra
  aboutPortrait: PHOTO("0152"),   // profil verrière
  serviceMovement: PHOTO("0142"), // corde à sauter verrière
  journeyPortrait: PHOTO("0075"), // sourire action
  // Unsplash — lifestyle + nutrition
  heroLifestyle: UNSPLASH("photo-1544367567-0f2fcb009e0b", 1600),
  nutritionHero: UNSPLASH("photo-1490645935967-10de6ba17061", 1400),
  nutritionFlatLay: UNSPLASH("photo-1505253758473-96b7015fcd40", 1200),
  nutritionFruits: UNSPLASH("photo-1512621776951-a57141f2eefd", 1000),
  nutritionHerbs: UNSPLASH("photo-1484723091739-30a097e8f929", 1000),
  ctaLifestyle: UNSPLASH("photo-1544367567-0f2fcb009e0b", 1800)
};

export default async function HomePage() {
  const [
    services, testimonials, latestPosts,
    heroS, homeS, aboutS, extraS,
    nutritionS, nutritionExtraS, tarifsS, tarifsPlansS,
    servicesS, faqSettings
  ] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, take: 4 }).catch(() => []),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }).catch(() => []),
    getSettings("hero").catch((): Record<string, string> => ({})),
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

  const s = (key: string, fallback: ReactNode) => (homeS[key] as ReactNode) || fallback;
  const t = (key: string, fallback: string) => tarifsPlansS[key] || fallback;

  const introText = aboutS["about_page_intro_text"] || "Mon parcours n'a pas commencé dans une salle de sport. Il a commencé à l'hôpital, auprès de corps fragiles, en reprise d'autonomie. C'est là que j'ai appris à observer, écouter, respecter.";
  const bioBody = extraS["about_bio_body"] || "<p>Infirmière diplômée d'État, huit années en milieu hospitalier et EHPAD. La gériatrie m'a enseigné la rigueur, la patience et la lecture fine du corps humain.</p><p>J'ai choisi de déplacer mon action : accompagner en amont plutôt que réparer. Le mouvement et la nutrition sont devenus mon nouveau champ de soin.</p>";
  // COPY CHANGE (v2) : "Spécialisation post-partum & nutrition" → "Spécialisation bien-être féminin & nutrition"
  const credentials = (extraS["about_credentials"] || "Infirmière Diplômée d'État\nCoach sportive certifiée\nSpécialisation bien-être féminin & nutrition").split("\n").filter(Boolean);

  const philTitle = nutritionS["nutrition_philosophy_title"] || "Nourrir, sans priver.";
  const philBody = nutritionS["nutrition_philosophy_body"] || "Pas de régime, pas d'interdit. Une alimentation vivante, plaisir, construite autour de toi — et de ton énergie du moment.";
  const nutritionBullets = (nutritionExtraS["nutrition_bullets"] || "Produits bruts et de saison\nPas d'interdits, pas de calculs\nCoaching sport + nutrition").split("\n").filter(Boolean);

  const perks: Record<string, string[]> = {
    HOME: (servicesS["services_perks_home"] || "Aucun déplacement\nMatériel fourni\nHoraires flexibles\nSuivi personnalisé").split("\n").filter(Boolean),
    OUTDOOR: (servicesS["services_perks_outdoor"] || "Pleine nature\nVariété des environnements\nEffet énergisant\nCardio doux").split("\n").filter(Boolean),
    GYM: (servicesS["services_perks_gym"] || "Équipement complet\nEncadrement technique\nProgressivité\nObjectifs clairs").split("\n").filter(Boolean),
    ONLINE: (servicesS["services_perks_online"] || "Plan détaillé\nVidéos d'exercices\nSuivi visio mensuel\nLiberté totale").split("\n").filter(Boolean)
  };

  const plans = [
    {
      name: t("tarif_plan1_name", "Découverte"),
      price: t("tarif_plan1_price", "90"),
      priceSuffix: "CHF",
      unit: t("tarif_plan1_unit", "la séance"),
      features: (t("tarif_plan1_features", "Séance de 60 minutes\nBilan initial\nÀ domicile ou extérieur\nSans engagement")).split("\n").filter(Boolean),
      featured: false, tag: ""
    },
    {
      name: t("tarif_plan2_name", "Reconnexion"),
      price: t("tarif_plan2_price", "790"),
      priceSuffix: "CHF",
      unit: t("tarif_plan2_unit", "pack 10 séances"),
      features: (t("tarif_plan2_features", "10 séances de coaching\nBilan nutrition\nPlan personnalisé\nSuivi WhatsApp\nValidité 4 mois")).split("\n").filter(Boolean),
      featured: true, tag: t("tarif_plan2_tag", "Le plus choisi")
    },
    {
      name: t("tarif_plan3_name", "Sur mesure"),
      price: t("tarif_plan3_price", "Sur"),
      priceSuffix: "devis",
      unit: t("tarif_plan3_unit", ""),
      features: (t("tarif_plan3_features", "Format 100% adapté\nCoaching + nutrition\nPrésentiel + en ligne\nAccompagnement longue durée")).split("\n").filter(Boolean),
      featured: false, tag: ""
    }
  ];

  const faqItems = [
    { q: faqSettings["faq_q1"] || "Combien de temps dure une séance ?", a: faqSettings["faq_a1"] || "Généralement 60 minutes. Les premiers bilans durent 75 à 90 minutes." },
    // COPY CHANGE (v2) : mention post-partum #1/2 conservée ici comme spécialité FAQ
    { q: faqSettings["faq_q2"] || "Je débute (reprise sportive, post-partum…), c'est adapté ?", a: faqSettings["faq_a2"] || "Absolument. Tout est construit en fonction de ton corps, ton rythme, ton énergie — et du moment de vie où tu es." },
    { q: faqSettings["faq_q3"] || "Quel est le délai pour annuler ?", a: faqSettings["faq_a3"] || "Merci de prévenir au moins 24h à l'avance. Au-delà, la séance est due." },
    { q: faqSettings["faq_q4"] || "Puis-je mixer plusieurs formats ?", a: faqSettings["faq_a4"] || "Oui, c'est même recommandé : un peu de salle, un peu d'extérieur, suivi en ligne." }
  ];

  const marqueeWords = ["Respirer", "Retrouver", "Renaître", "Douceur", "Présence", "Énergie", "Sororité", "Équilibre"];

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden pt-8 lg:pt-14 pb-24 lg:pb-32">
        {/* organic floating blobs */}
        <div className="pointer-events-none absolute top-0 -right-40 w-[560px] h-[560px] bg-brand-argileSoft blob-shape-1 opacity-70 blur-2xl animate-blob" aria-hidden />
        <div className="pointer-events-none absolute top-60 -left-52 w-[480px] h-[480px] bg-brand-eucalyptusSoft blob-shape-2 opacity-60 blur-2xl animate-blob" aria-hidden style={{ animationDelay: "-6s" }} />

        <div className="container-editorial relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* TEXT COLUMN */}
            <div className="lg:col-span-7 pt-8 lg:pt-12 reveal-stagger reveal">
              {/* COPY CHANGE (v2)
                  eyebrow : "Coach bien-être · Post-partum · Suisse romande"
                           → "Coach bien-être féminin · Suisse romande"
                  subtitle: "… pour jeunes mères et femmes en reconstruction…"
                           → "… pour les femmes actives, à chaque étape de leur vie…" */}
              <p className="eyebrow">
                {heroS["home_hero_eyebrow"] || "Coach bien-être féminin · Suisse romande"}
              </p>

              <h1 className="mt-8 font-display font-medium text-display-xl text-brand-chocolat">
                Revenir à toi,
                <br />
                <span className="display-italic text-brand-argileDeep">doucement</span>.
              </h1>

              <p className="mt-10 max-w-xl text-lg text-brand-chocolatSoft leading-[1.8]">
                {heroS["home_hero_subtitle"] || "Accompagnement mouvement & nutrition pour les femmes actives, à chaque étape de leur vie. Une approche infirmière, patiente, sans performance imposée — depuis Poliez-Pittet."}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/reservation" className="btn btn-primary">
                  Réserver une séance
                  <ArrowUpRight size={14} />
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Appel découverte · 15 min
                </Link>
              </div>

              {/* Trust row */}
              {/* COPY CHANGE (v2) : "Post-partum" → "Bien-être féminin" */}
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 text-[0.72rem] uppercase tracking-[0.2em] text-brand-fumee font-medium">
                <span className="flex items-center gap-2"><Flower2 size={14} className="text-brand-eucalyptusDeep" /> Bien-être féminin</span>
                <span className="w-1 h-1 rounded-full bg-brand-divider" />
                <span className="flex items-center gap-2"><Heart size={14} className="text-brand-argileDeep" /> Infirmière D.E.</span>
                <span className="w-1 h-1 rounded-full bg-brand-divider" />
                <span className="flex items-center gap-2"><Leaf size={14} className="text-brand-eucalyptusDeep" /> Nutrition douce</span>
              </div>
            </div>

            {/* IMAGE COLUMN — layered composition */}
            <div className="lg:col-span-5 relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative aspect-[4/5]">
                {/* Ambient blob backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-br from-brand-argileSoft via-brand-lin to-brand-eucalyptusSoft blob-shape-1 blur-sm" aria-hidden />

                {/* Main portrait — real photo with warm overlay */}
                <div className="img-frame img-overlay-warm relative h-full rounded-[3rem]">
                  <Image
                    src={photos.heroPortrait}
                    alt="Élodie — coach mouvement et nutrition"
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>

                {/* Floating testimonial bubble */}
                <div className="absolute -bottom-6 -left-6 lg:-left-14 max-w-[280px] surface p-5 shadow-soft rotate-[-3deg] animate-float">
                  <div className="flex gap-0.5 text-brand-argileDeep text-xs mb-2">★★★★★</div>
                  <p className="font-display italic text-brand-chocolat leading-snug text-[0.95rem]">
                    « Pour la première fois, j'ai senti que mon corps m'appartenait à nouveau. »
                  </p>
                  {/* COPY CHANGE (v2) : "3 mois post-partum" → "Après 10 séances" */}
                  <p className="mt-3 text-[0.65rem] uppercase tracking-[0.22em] text-brand-fumee font-medium">
                    Julie — Après 10 séances
                  </p>
                </div>

                {/* Floating chip */}
                <div className="absolute -top-3 -right-3 lg:right-4 chip chip-dark shadow-card rotate-[4deg]">
                  <Sparkles size={12} /> Bilan offert
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-20 lg:mt-28 grid grid-cols-3 gap-6 max-w-4xl mx-auto border-y border-brand-divider py-10 reveal-stagger reveal">
            {[
              { value: "+8", label: "années en soin" },
              { value: "100%", label: "sur mesure" },
              { value: "24/7", label: "accompagnement WhatsApp" }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-medium text-4xl lg:text-5xl text-brand-chocolat">{stat.value}</p>
                <p className="mt-3 text-[0.7rem] uppercase tracking-[0.22em] text-brand-fumee font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/*
          MARQUEE — boucle horizontale infinie
          • animation CSS pure : translateX(0) → translateX(-50%) sur 55s linear
          • contenu dupliqué exactement ×2 pour une boucle invisible
          • mask-image fade sur les bords (classe .marquee-wrap)
          • pause au hover
          • prefers-reduced-motion : animation désactivée, mots statiques
        */}
        <div className="mt-16 lg:mt-24 border-y border-brand-divider/70 bg-brand-linPale/60 py-6 marquee-wrap">
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center shrink-0 pr-12" aria-hidden={dup === 1}>
                {marqueeWords.map((w, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center gap-12 pl-12 font-display text-3xl lg:text-4xl text-brand-chocolat/80 whitespace-nowrap">
                    <span className={i % 2 ? "display-italic text-brand-argileDeep" : ""}>{w}</span>
                    <Flower2 size={18} className="text-brand-eucalyptusDeep/70 shrink-0" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section id="about" className="relative py-24 lg:py-36">
        <div className="container-editorial grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 relative reveal">
            <div className="img-frame img-overlay-warm relative aspect-[4/5] rounded-[2.5rem]">
              <Image
                src={photos.aboutPortrait}
                alt="Portrait Élodie — sous la lumière du Grand Palais"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            {/* soft blob backdrop */}
            <div className="pointer-events-none absolute -z-10 -inset-6 bg-brand-argileSoft blob-shape-2 opacity-60 blur-2xl" aria-hidden />

            {/* floating credential badge */}
            <div className="absolute -bottom-8 -right-4 lg:right-8 surface-argile p-6 rounded-[1.5rem] shadow-argile rotate-[4deg] max-w-[240px]">
              <p className="font-display italic font-medium text-3xl text-brand-chocolat leading-none">huit ans</p>
              <p className="mt-3 text-xs text-brand-chocolatSoft leading-relaxed">
                d'expérience en soin hospitalier — avant le mouvement, il y a eu l'écoute.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8 reveal-stagger reveal">
            <p className="eyebrow">L'histoire</p>
            <h2 className="section-title mt-6">
              De l'hôpital<br />
              au <em>mouvement</em>.
            </h2>
            <p className="mt-10 text-brand-chocolatSoft leading-[1.85] text-[1.05rem]">{introText}</p>
            <div
              className="mt-5 space-y-4 text-brand-chocolatSoft leading-[1.85] [&>p]:my-4"
              dangerouslySetInnerHTML={{ __html: bioBody }}
            />

            <div className="mt-10 flex flex-wrap gap-2">
              {credentials.map((c) => (
                <span key={c} className="chip">
                  <Leaf size={11} className="text-brand-eucalyptusDeep" />
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Heart, title: "Écoute", body: "du corps avant la performance" },
                { icon: Wind, title: "Patience", body: "chaque chemin a son rythme" },
                { icon: Sparkles, title: "Bienveillance", body: "sans jugement, jamais" }
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="surface p-5">
                  <span className="inline-flex w-10 h-10 rounded-full bg-brand-argileSoft text-brand-argileDeep items-center justify-center">
                    <Icon size={17} />
                  </span>
                  <p className="mt-4 font-display font-medium text-lg text-brand-chocolat">{title}</p>
                  <p className="text-[0.85rem] text-brand-chocolatSoft leading-relaxed mt-1">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section id="services" className="relative py-24 lg:py-36">
        <div className="container-editorial">
          <div className="surface-dark relative overflow-hidden p-10 lg:p-16 rounded-[2.5rem] lg:rounded-[3rem]">
            {/* glowing accent */}
            <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-argile/25 blur-3xl rounded-full" aria-hidden />
            <div className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-brand-eucalyptus/20 blur-3xl rounded-full" aria-hidden />

            <div className="relative grid lg:grid-cols-12 gap-8 mb-14 lg:mb-20 reveal">
              <div className="lg:col-span-7">
                <p className="eyebrow !text-brand-argileSoft">Le coaching</p>
                <h2 className="mt-6 font-display font-medium text-display-lg tracking-tight text-brand-ivoire">
                  Quatre lieux,<br />
                  <span className="display-italic text-brand-argile">une même attention</span>.
                </h2>
              </div>
              <div className="lg:col-span-5 lg:pt-6">
                <p className="text-brand-ivoire/75 leading-[1.85]">
                  {tarifsS["services_page_subtitle"] || "Un format pour chaque moment de ta vie. Le mouvement vient à toi — pas l'inverse. Même écoute, quatre cadres."}
                </p>
                {/* COPY CHANGE (v2) : mention post-partum #2/2 conservée ici comme liste d'expertises */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {["Reprise sportive", "Post-partum", "Transitions de vie", "Nutrition du quotidien"].map((e) => (
                    <span
                      key={e}
                      className="text-[0.64rem] font-medium uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-brand-ivoire/10 text-brand-ivoire/80 border border-brand-ivoire/15"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative grid md:grid-cols-2 gap-4 lg:gap-5 reveal-stagger reveal">
              {services.map((sv, i) => (
                <Link
                  key={sv.id}
                  href={`/reservation?service=${sv.slug}`}
                  className="group bg-brand-ivoire/[0.04] hover:bg-brand-ivoire/[0.08] border border-brand-ivoire/10 rounded-[2rem] p-7 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className="font-display italic font-medium text-2xl text-brand-argile">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.22em] text-brand-argile font-semibold">
                      {sv.priceLabel}
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-2xl lg:text-3xl text-brand-ivoire leading-tight tracking-tight">
                    {sv.name}
                  </h3>
                  <p className="mt-4 text-sm text-brand-ivoire/75 leading-[1.8]">{sv.description}</p>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {(perks[sv.location] ?? []).slice(0, 3).map((pk) => (
                      <span
                        key={pk}
                        className="text-[0.64rem] font-medium uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-brand-ivoire/8 text-brand-ivoire/85 border border-brand-ivoire/10"
                      >
                        {pk}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 pt-5 border-t border-brand-ivoire/10 flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-ivoire/70 group-hover:text-brand-argile transition">
                    <span>Réserver</span>
                    <span className="w-8 h-8 rounded-full bg-brand-ivoire/8 group-hover:bg-brand-argile group-hover:text-brand-chocolat flex items-center justify-center transition">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MOUVEMENT PHOTO — Élodie action douce ═══════════════ */}
      <section className="relative py-20 lg:py-28">
        <div className="container-editorial grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 reveal">
            <p className="eyebrow">Le mouvement</p>
            <h2 className="section-title mt-6">
              Retrouver <em>l'élan</em>,<br />
              à ton rythme.
            </h2>
            {/* COPY CHANGE (v2)
                "Le corps post-partum n'est pas un corps abîmé…"
                → généralisation bien-être, sans mention spécifique */}
            <p className="mt-10 text-brand-chocolatSoft leading-[1.85] text-[1.05rem]">
              Ton corps n'a rien à prouver. Le réveiller, l'accompagner, l'écouter passe par de petits mouvements — pas par la performance. Du souffle, du sol, de la conscience. Puis, petit à petit, l'élan revient.
            </p>

            <ul className="mt-10 space-y-5">
              {[
                // COPY CHANGE (v2) : "Respiration & plancher pelvien…" généralisé
                "Respiration & gainage profond en priorité",
                "Renforcement progressif, jamais isolé",
                "Mobilité articulaire comme rituel quotidien",
                "Aucune comparaison, aucun jugement"
              ].map((line, i) => (
                <li key={line} className="flex items-baseline gap-4 border-t border-brand-divider pt-5 text-brand-chocolatSoft">
                  <span className="font-display italic font-medium text-brand-argileDeep text-sm w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.98rem]">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 relative reveal">
            <div className="img-frame img-overlay-warm relative aspect-[3/4] rounded-[2.5rem]">
              <Image
                src={photos.serviceMovement}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute -z-10 -inset-6 bg-brand-eucalyptusSoft blob-shape-3 opacity-60 blur-2xl" aria-hidden />
          </div>
        </div>
      </section>

      {/* ═══════════════ NUTRITION ═══════════════ */}
      <section id="nutrition" className="relative py-24 lg:py-36 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-brand-argileSoft/40 to-transparent" aria-hidden />

        <div className="container-editorial relative">
          <div className="max-w-2xl mb-16 lg:mb-24 reveal">
            <p className="eyebrow">Nutrition</p>
            <h2 className="section-title mt-6">
              Nourrir,<br /><em>sans priver</em>.
            </h2>
            {/* COPY CHANGE (v2)
                "… Post-partum, allaitement, fatigue — on ajuste ensemble."
                → "… Transitions, fatigue, envie de changement — on ajuste ensemble." */}
            <p className="mt-10 text-brand-chocolatSoft leading-[1.85] text-[1.08rem]">
              {nutritionS["nutrition_hero_subtitle"] || "Pas de régime, pas de liste d'interdits. Une alimentation vivante, construite autour de toi, de ton énergie, de tes besoins du moment. Transitions, fatigue, envie de changement — on ajuste ensemble."}
            </p>
          </div>

          {/*
            BENTO GRID — nutrition
            ──────────────────────
            Objectif : aucune aspect-ratio qui casse le rythme. Les hauteurs
            sont pilotées par `grid-auto-rows` (fraction fixe), chaque cellule
            spannant 1 ou 2 lignes pour composer la grille. Toutes les images
            sont en `object-cover` et occupent 100% de leur cellule.

            Desktop (md+, 12 cols × 3 rows, hauteur de ligne = 220px lg:280px) :
              ┌─────────────────┬──────────────┐
              │                 │  FlatLay 5×1 │   row 1
              │  Hero  7 × 2    ├──────────────┤
              │                 │  Fruits 5×1  │   row 2
              ├─────────────────┴──────────────┤
              │        Herbs  12 × 1           │   row 3
              └────────────────────────────────┘

            Mobile : 1 colonne, 4 cellules empilées, gap = 1rem.
            Radius uniforme sur toutes les cellules (2rem).
          */}
          <div
            className="
              grid gap-4 lg:gap-5 mb-20 lg:mb-28 reveal-stagger reveal
              grid-cols-1 auto-rows-[220px]
              md:grid-cols-12 md:auto-rows-[220px] lg:auto-rows-[280px]
            "
          >
            {/* Cell 1 — Hero (large, 7 cols × 2 rows on md+) */}
            <div className="img-frame img-overlay-multiply rounded-[2rem] relative md:col-span-7 md:row-span-2">
              <Image
                src={photos.nutritionHero}
                alt="Bowl nutrition coloré"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 55vw, 100vw"
                loading="lazy"
              />
            </div>

            {/* Cell 2 — FlatLay (5 cols × 1 row) */}
            <div className="img-frame img-overlay-warm rounded-[2rem] relative md:col-span-5">
              <Image
                src={photos.nutritionFlatLay}
                alt="Flat lay ingrédients naturels"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                loading="lazy"
              />
            </div>

            {/* Cell 3 — Fruits (5 cols × 1 row) */}
            <div className="img-frame rounded-[2rem] relative md:col-span-5">
              <Image
                src={photos.nutritionFruits}
                alt="Fruits de saison"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                loading="lazy"
              />
            </div>

            {/* Cell 4 — Herbs wide banner (12 cols × 1 row) */}
            <div className="img-frame img-overlay-multiply rounded-[2rem] relative md:col-span-12">
              <Image
                src={photos.nutritionHerbs}
                alt="Herbes fraîches sur lin"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 100vw, 100vw"
                loading="lazy"
              />
            </div>
          </div>

          {/* Method — elegant numbered */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-10 mb-20 lg:mb-28">
            {[
              { icon: Flower2, title: nutritionS["nutrition_method_step1"] || "Bilan", body: nutritionS["nutrition_method_step1_desc"] || "On part de toi : ton quotidien, tes contraintes, tes envies, tes aversions. Zéro jugement." },
              { icon: Sun, title: nutritionS["nutrition_method_step2"] || "Plan doux", body: nutritionS["nutrition_method_step2_desc"] || "Un cadre alimentaire souple, avec recettes simples et alternatives pour les jours sans." },
              { icon: Leaf, title: nutritionS["nutrition_method_step3"] || "Suivi & ajustement", body: nutritionS["nutrition_method_step3_desc"] || "Points réguliers pour ajuster selon tes progrès, ton énergie, ta réalité." }
            ].map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="surface-euca p-8 lg:p-10 rounded-[2rem] reveal">
                <span className="inline-flex w-12 h-12 rounded-full bg-brand-ivoire/80 text-brand-eucalyptusDeep items-center justify-center shadow-card">
                  <Icon size={20} />
                </span>
                <p className="mt-5 font-display italic text-sm text-brand-eucalyptusDeep">
                  {String(i + 1).padStart(2, "0")}.
                </p>
                <h3 className="mt-1 font-display font-medium text-2xl text-brand-chocolat tracking-tight">{title}</h3>
                <p className="mt-3 text-[0.95rem] text-brand-chocolatSoft leading-[1.8]">{body}</p>
              </div>
            ))}
          </div>

          {/* Philosophy quote block */}
          <div className="relative surface-argile p-10 lg:p-16 rounded-[2.5rem] max-w-5xl mx-auto reveal">
            <Quote size={36} strokeWidth={1.3} className="text-brand-argileDeep mb-6" />
            <h3 className="font-display italic font-medium text-3xl lg:text-4xl text-brand-chocolat leading-[1.2] max-w-3xl">
              {philTitle}
            </h3>
            <p className="mt-8 text-brand-chocolatSoft leading-[1.9] text-[1.05rem] max-w-2xl">{philBody}</p>
            <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-3xl">
              {nutritionBullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[0.95rem] text-brand-chocolat">
                  <Check size={17} className="text-brand-argileDeep mt-0.5 shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════ PARCOURS — Élodie athlete proof ═══════════════ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="container-editorial grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1 reveal">
            <div className="img-frame img-overlay-warm relative aspect-[3/4] rounded-[2.5rem]">
              <Image
                src={photos.journeyPortrait}
                alt="Élodie en action"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute -z-10 -inset-5 bg-brand-argileSoft blob-shape-1 opacity-70 blur-2xl" aria-hidden />
          </div>

          <div className="lg:col-span-7 lg:pl-8 order-1 lg:order-2 reveal">
            <p className="eyebrow">Mon parcours</p>
            <h2 className="section-title mt-6">
              Pratiquante <em>avant</em><br />
              d'être <em>coach</em>.
            </h2>
            <p className="mt-10 text-brand-chocolatSoft leading-[1.85] text-[1.05rem] max-w-2xl">
              J'ai couru, transpiré, échoué, recommencé. Compétition Hyrox, marathons, séances hivernales
              à 6h du matin — je connais de l'intérieur ce que c'est de pousser un corps, et surtout
              de l'écouter. Ce vécu, je le mets au service de femmes qui repartent de plus loin.
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Hyrox", value: "Finisher" },
                { label: "Marathon", value: "×2" },
                { label: "Formations", value: "Continue" }
              ].map((m) => (
                <div key={m.label} className="surface p-5 rounded-[1.5rem]">
                  <p className="font-display italic text-3xl text-brand-argileDeep">{m.value}</p>
                  <p className="mt-2 text-[0.7rem] uppercase tracking-[0.22em] text-brand-fumee font-medium">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TARIFS ═══════════════ */}
      <section id="tarifs" className="relative py-24 lg:py-36 bg-brand-linPale/50 border-y border-brand-divider/60">
        <div className="container-editorial">
          <div className="max-w-2xl mb-14 lg:mb-20 reveal">
            <p className="eyebrow">Tarifs</p>
            <h2 className="section-title mt-6">
              Des formules <em>claires</em>,<br />sans surprise.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 reveal-stagger reveal">
            {plans.map((pl) => (
              <div
                key={pl.name}
                className={`relative rounded-[2rem] lg:rounded-[2.5rem] p-8 lg:p-10 flex flex-col transition-all hover:-translate-y-1 ${
                  pl.featured
                    ? "surface-argile shadow-argile lg:scale-[1.03] lg:my-[-8px]"
                    : "surface hover:shadow-card"
                }`}
              >
                {pl.tag && (
                  <span className="self-start chip-dark mb-5">
                    <Sparkles size={12} /> {pl.tag}
                  </span>
                )}
                <h3 className="font-display font-medium text-2xl lg:text-3xl text-brand-chocolat tracking-tight">
                  {pl.name}
                </h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display font-medium text-5xl lg:text-6xl leading-none text-brand-chocolat">
                    {pl.price}
                  </span>
                  <span className="text-sm font-medium uppercase tracking-[0.22em] text-brand-fumee">
                    {pl.priceSuffix}
                  </span>
                </div>
                {pl.unit && <p className="mt-1 text-sm text-brand-fumee">{pl.unit}</p>}

                <ul className="mt-8 space-y-3 text-sm flex-1 text-brand-chocolatSoft">
                  {pl.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 leading-relaxed">
                      <Check size={16} className="text-brand-argileDeep mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/reservation"
                  className={`mt-8 btn ${pl.featured ? "btn-primary" : "btn-outline"}`}
                >
                  Réserver
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-brand-fumee max-w-xl">
            {t("tarif_footer_note", "Tarifs en francs suisses (CHF). Déplacement dans un rayon de 15 km autour de Poliez-Pittet inclus.")}
          </p>
        </div>
      </section>

      {/* ═══════════════ TÉMOIGNAGES ═══════════════ */}
      {testimonials.length > 0 && (
        <section id="temoignages" className="relative py-24 lg:py-36">
          <div className="container-editorial">
            <div className="max-w-2xl mb-14 lg:mb-20 reveal">
              <p className="eyebrow">Elles racontent</p>
              <h2 className="section-title mt-6">
                Leurs mots,<br /><em>nos chemins</em>.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5 lg:gap-6 reveal-stagger reveal">
              {testimonials.slice(0, 4).map((tm, i) => (
                <figure
                  key={tm.id}
                  className={`rounded-[2rem] p-8 lg:p-10 ${
                    i === 0 ? "surface-argile shadow-argile" : i === 3 ? "surface-euca" : "surface"
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-0.5 text-brand-argileDeep">
                      {Array.from({ length: tm.rating }).map((_, i) => (<span key={i}>★</span>))}
                    </div>
                    <Quote size={22} strokeWidth={1.5} className="text-brand-argileDeep/50" />
                  </div>
                  <blockquote className="font-display italic font-medium text-xl lg:text-2xl text-brand-chocolat leading-[1.4]">
                    « {tm.quote} »
                  </blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-brand-chocolat/10 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-brand-chocolat text-brand-argile font-display italic flex items-center justify-center">
                      {tm.name?.[0] || "·"}
                    </span>
                    <div>
                      <p className="font-medium text-brand-chocolat text-sm">{tm.name}</p>
                      {tm.program && <p className="text-xs text-brand-chocolatSoft">{tm.program}</p>}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ STEPS ═══════════════ */}
      <section className="relative py-24 lg:py-32 bg-brand-linPale/50 border-y border-brand-divider/60">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-8 mb-14 reveal">
            <div className="lg:col-span-6">
              <p className="eyebrow">{s("home_steps_eyebrow", "Le chemin")}</p>
              <h2 className="section-title mt-6">
                Quatre étapes,<br /><em>une rencontre</em>.
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 reveal-stagger reveal">
            {[
              { n: 1, title: s("home_step1_title", "Appel découverte"), body: s("home_step1_desc", "15 minutes offertes pour faire connaissance, sans pression.") },
              { n: 2, title: s("home_step2_title", "Bilan & écoute"), body: s("home_step2_desc", "On définit un cap ensemble, réaliste et doux.") },
              { n: 3, title: s("home_step3_title", "Programme personnalisé"), body: s("home_step3_desc", "Un plan adapté à ton rythme — pas l'inverse.") },
              { n: 4, title: s("home_step4_title", "Suivi continu"), body: s("home_step4_desc", "On ajuste, on progresse, on célèbre chaque étape.") }
            ].map((step) => (
              <div key={step.n} className="surface p-8 relative">
                <span className="font-display italic font-medium text-5xl text-brand-argileDeep block leading-none">
                  {String(step.n).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display font-medium text-xl text-brand-chocolat tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-brand-chocolatSoft leading-[1.75]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="relative py-24 lg:py-36">
        <div className="container-editorial grid lg:grid-cols-12 gap-12 lg:gap-16 reveal">
          <div className="lg:col-span-5">
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title mt-6">
              Questions<br /><em>fréquentes</em>.
            </h2>
            <p className="mt-8 text-brand-chocolatSoft leading-[1.85] max-w-sm">
              Une question sans réponse ici ?{" "}
              <Link href="/contact" className="text-brand-argileDeep font-medium underline underline-offset-4 decoration-1.5">
                Écris-moi
              </Link>
              , je te réponds personnellement.
            </p>
          </div>
          <div className="lg:col-span-7 space-y-3">
            {faqItems.map((f) => (
              <details key={f.q} className="group surface overflow-hidden transition">
                <summary className="cursor-pointer font-display font-medium text-lg lg:text-xl text-brand-chocolat p-6 lg:p-7 flex items-start justify-between gap-6 list-none tracking-tight">
                  <span>{f.q}</span>
                  <span className="w-8 h-8 shrink-0 rounded-full bg-brand-argile text-brand-chocolat flex items-center justify-center text-lg leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-6 lg:px-7 pb-6 lg:pb-7 text-[0.95rem] text-brand-chocolatSoft leading-[1.85]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BLOG ═══════════════ */}
      {latestPosts.length > 0 && (
        <section className="relative py-24 lg:py-36 bg-brand-linPale/50 border-y border-brand-divider/60">
          <div className="container-editorial">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-14 reveal">
              <div>
                <p className="eyebrow">{s("home_blog_eyebrow", "Journal")}</p>
                <h2 className="section-title mt-6">
                  Sport <em>&</em><br />nutrition.
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 bg-brand-chocolat text-brand-ivoire rounded-full pl-4 pr-1.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] hover:bg-brand-argileDeep transition group"
              >
                Tous les articles
                <span className="w-7 h-7 rounded-full bg-brand-argile text-brand-chocolat flex items-center justify-center">
                  <ArrowUpRight size={13} />
                </span>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3 reveal-stagger reveal">
              {latestPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                  {p.coverUrl && (
                    <div className="img-frame img-overlay-warm relative aspect-[4/5] rounded-[2rem] mb-5 shadow-card">
                      <Image src={p.coverUrl} alt={p.title} fill className="object-cover" loading="lazy" />
                    </div>
                  )}
                  <div>
                    {p.category && <span className="chip">{p.category}</span>}
                    <h3 className="mt-4 font-display font-medium text-xl text-brand-chocolat leading-tight tracking-tight group-hover:text-brand-argileDeep transition">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-brand-chocolatSoft leading-[1.75] line-clamp-3">
                      {p.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-20 lg:py-28">
        <div className="container-editorial">
          <div className="relative rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-brand-chocolat text-brand-ivoire p-10 lg:p-20 text-center shadow-soft reveal">
            <div className="absolute inset-0 opacity-25">
              <Image src={photos.ctaLifestyle} alt="" fill className="object-cover" loading="lazy" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-chocolat/90 via-brand-chocolat/80 to-brand-argileDeep/70" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-brand-argile/30 blur-3xl rounded-full" aria-hidden />
            <div className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] bg-brand-eucalyptus/20 blur-3xl rounded-full" aria-hidden />

            <div className="relative">
              <div className="inline-flex mb-8 chip-accent">
                <Sparkles size={12} /> Premier pas
              </div>
              <h2 className="font-display font-medium text-display-xl tracking-tight">
                Prête à <span className="display-italic text-brand-argile">revenir à toi</span> ?
              </h2>
              <p className="mt-8 max-w-xl mx-auto text-brand-ivoire/85 leading-[1.85]">
                On commence par un appel, pour comprendre ton histoire et ton moment.
                Sans engagement, sans formule. Juste un échange.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link href="/reservation" className="btn btn-accent">
                  Réserver une séance
                  <ArrowUpRight size={14} />
                </Link>
                <Link href="/contact" className="btn btn-ghost-light">
                  Appel découverte offert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
