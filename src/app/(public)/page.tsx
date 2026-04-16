import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { ArrowRight, Home, Trees, Dumbbell, Laptop, Check } from "lucide-react";

export const revalidate = 60;

const locationIcon: Record<string, any> = {
  HOME: Home,
  OUTDOOR: Trees,
  GYM: Dumbbell,
  ONLINE: Laptop
};

export default async function HomePage() {
  const [services, testimonials, latestPosts, heroS, images, homeS] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, take: 3 }).catch(() => []),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }).catch(() => []),
    getSettings("hero").catch((): Record<string, string> => ({})),
    getSettings("images").catch((): Record<string, string> => ({})),
    getSettings("home_sections").catch((): Record<string, string> => ({}))
  ]);

  // Hero
  const heroEyebrow = heroS["home_hero_eyebrow"] || "Coach sportive & nutrition · Suisse";
  const heroTitle = heroS["home_hero_title"] || "Coach sportive & nutrition à ton rythme";
  const heroSubtitle = heroS["home_hero_subtitle"] || "Coaching personnalisé à domicile, en extérieur, en salle et en ligne — depuis Poliez-Pittet.";

  // Images
  const imgHeroBg = images["img_hero_bg"] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80";
  const imgPortrait = images["img_portrait_elodie"] || "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=80";
  const imgNutritionBg = images["img_home_nutrition_bg"] || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80";

  // Home sections
  const s = (key: string, fallback: string) => homeS[key] || fallback;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center bg-brand-dark text-brand-ivory overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: `url('${imgHeroBg}')`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-transparent" aria-hidden />

        <div className="container-editorial relative grid md:grid-cols-2 py-24 gap-12">
          <div>
            <p className="eyebrow text-brand-roseLight">{heroEyebrow}</p>
            <h1 className="mt-5 font-serif font-bold text-display-lg md:text-display-xl leading-tight">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-lg text-brand-ivory/80 text-lg leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Réserver une séance <ArrowRight size={16} />
              </Link>
              <Link href="/contact#decouverte" className="btn btn-ghost-light">
                Appel découverte 15 min offert
              </Link>
            </div>
            <p className="mt-8 text-xs uppercase tracking-wider text-brand-ivory/60">
              {s("home_credential", "Infirmière Diplômée d'État · Certifiée coach sportif")}
            </p>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
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

      {/* ABOUT TEASER */}
      <section className="container-editorial py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 border border-brand-roseLight/40">
          <Image src={imgPortrait} alt="Portrait d'Élodie" fill className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">{s("home_about_eyebrow", "À propos")}</p>
          <h2 className="section-title mt-3">{s("home_about_title", "De soignante à coach")}</h2>
          <p className="mt-5 text-brand-dark/85 leading-relaxed">
            {s("home_about_text", "Infirmière diplômée d'État avec plus de huit années d'expérience en gériatrie et soins palliatifs, j'ai choisi d'accompagner la santé en amont — par le mouvement et la nutrition. Mon regard de soignante change tout : j'écoute ton corps avant de pousser.")}
          </p>
          <Link href="/a-propos" className="mt-6 inline-flex items-center gap-2 text-brand-terracotta font-semibold">
            En savoir plus <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-brand-ivory">
        <div className="container-editorial py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow">{s("home_services_eyebrow", "Services")}</p>
            <h2 className="section-title mt-3">{s("home_services_title", "Accompagnements sur mesure")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((sv) => {
              const Icon = locationIcon[sv.location] ?? Home;
              return (
                <Link key={sv.id} href="/services" className="group bg-brand-nude rounded-xl2 p-8 hover:shadow-soft transition">
                  <Icon className="text-brand-rose" size={28} />
                  <h3 className="mt-5 font-serif text-xl font-semibold">{sv.name}</h3>
                  <p className="mt-3 text-sm text-brand-taupe leading-relaxed">{sv.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-terracotta">
                    Découvrir <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* NUTRITION HIGHLIGHT */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url('${imgNutritionBg}')`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-dark/55" aria-hidden />
        <div className="container-editorial relative py-24 text-brand-ivory text-center">
          <p className="eyebrow text-brand-roseLight">{s("home_nutrition_eyebrow", "Nutrition")}</p>
          <h2 className="mt-3 font-serif text-display-md md:text-display-lg font-bold">
            {s("home_nutrition_title", "La nutrition, pilier de ta transformation")}
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-brand-ivory/80 leading-relaxed">
            {s("home_nutrition_text", "Pas de régime, pas de culpabilité. Une approche durable, concrète, alignée avec ta vie.")}
          </p>
          <Link href="/nutrition" className="mt-8 btn btn-primary">Découvrir l&apos;approche</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-brand-nude">
        <div className="container-editorial py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow">{s("home_testimonials_eyebrow", "Témoignages")}</p>
            <h2 className="section-title mt-3">{s("home_testimonials_title", "Leur expérience avec Élodie")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="bg-white rounded-xl2 p-8 shadow-card">
                <div className="flex gap-1 text-brand-rose mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <blockquote className="font-serif italic text-brand-dark/90 leading-relaxed">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  {t.program && <span className="text-brand-taupe"> · {t.program}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-editorial py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow">{s("home_steps_eyebrow", "Comment ça se passe")}</p>
          <h2 className="section-title mt-3">{s("home_steps_title", "Quatre étapes simples")}</h2>
        </div>
        <ol className="grid gap-8 md:grid-cols-4 relative">
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

      {/* BLOG TEASER */}
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
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="bg-brand-dark text-brand-ivory">
        <div className="container-editorial py-20 text-center">
          <h2 className="font-serif text-display-md md:text-display-lg font-bold">
            {s("home_cta_title", "Prête à te lancer ?")}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Réserver une séance</Link>
            <Link href="/contact#decouverte" className="btn btn-ghost-light">Appel découverte offert</Link>
          </div>
        </div>
      </section>
    </>
  );
}
