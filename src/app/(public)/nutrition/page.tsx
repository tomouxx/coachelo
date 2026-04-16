import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { ClipboardList, Salad, LineChart } from "lucide-react";

export const metadata = { title: "Nutrition" };

export default async function NutritionPage() {
  const settings = await getSettings("nutrition").catch((): Record<string, string> => ({}));

  const heroTitle = settings["nutrition_hero_title"] || "La nutrition, moitié du chemin";
  const heroSubtitle = settings["nutrition_hero_subtitle"] || "Une approche durable, concrète, sans régime ni culpabilité.";
  const step1Title = settings["nutrition_method_step1"] || "1. Bilan nutritionnel";
  const step1Desc = settings["nutrition_method_step1_desc"] || "On analyse ton quotidien, tes contraintes, tes goûts et tes objectifs.";
  const step2Title = settings["nutrition_method_step2"] || "2. Plan personnalisé";
  const step2Desc = settings["nutrition_method_step2_desc"] || "Un plan alimentaire clair, avec recettes simples et alternatives.";
  const step3Title = settings["nutrition_method_step3"] || "3. Suivi & ajustements";
  const step3Desc = settings["nutrition_method_step3_desc"] || "Points réguliers pour ajuster selon tes progrès et ta vie.";
  const philTitle = settings["nutrition_philosophy_title"] || "Mange vrai. Mange juste.";
  const philBody = settings["nutrition_philosophy_body"] || "Je n'impose ni régime strict ni liste d'interdits. Je crois en une alimentation vivante, plaisir, construite autour de ton mode de vie. L'objectif : un rapport apaisé à la nourriture, et des résultats qui durent.";
  return (
    <>
      <section className="relative min-h-[60vh] flex items-center text-brand-ivory overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-dark/55" aria-hidden />
        <div className="container-editorial relative py-24">
          <p className="eyebrow text-brand-roseLight">Nutrition</p>
          <h1 className="mt-3 font-serif text-display-lg font-bold max-w-3xl">
            {heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-brand-ivory/80 text-lg">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* 3 étapes */}
      <section className="container-editorial py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="eyebrow">Ma méthode</p>
          <h2 className="section-title mt-3">Trois étapes</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ClipboardList, title: step1Title, body: step1Desc },
            { icon: Salad, title: step2Title, body: step2Desc },
            { icon: LineChart, title: step3Title, body: step3Desc }
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-brand-nude rounded-xl2 p-8">
              <Icon className="text-brand-rose" size={28} />
              <h3 className="mt-4 font-serif text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-brand-taupe leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophie */}
      <section className="bg-brand-nude">
        <div className="container-editorial py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
              alt="Bol healthy"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Ma philosophie</p>
            <h2 className="section-title mt-3">{philTitle}</h2>
            <p className="mt-5 leading-relaxed text-brand-dark/90">
              {philBody}
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>• Produits bruts et de saison en priorité</li>
              <li>• Pas d'interdits, pas de calculs obsessionnels</li>
              <li>• Prise en compte des habitudes familiales</li>
              <li>• Alliance coaching sport + nutrition pour maximiser les résultats</li>
            </ul>
            <Link href="/contact" className="mt-8 btn btn-primary inline-block">
              Prendre un bilan nutrition
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-dark text-brand-ivory">
        <div className="container-editorial py-20 text-center">
          <h2 className="font-serif text-display-md font-bold">Envie d'essayer ?</h2>
          <Link href="/contact" className="mt-6 btn btn-primary inline-block">Appel découverte offert</Link>
        </div>
      </section>
    </>
  );
}
