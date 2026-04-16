import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = { title: "À propos" };

export default async function AboutPage() {
  const [settings, images] = await Promise.all([
    getSettings("about").catch((): Record<string, string> => ({})),
    getSettings("images").catch((): Record<string, string> => ({}))
  ]);

  const imgPortrait = images["img_portrait_elodie"] || "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=90";

  const introText = settings["about_page_intro_text"] || "Mon parcours n'a pas commencé dans une salle de sport. Il a commencé à l'hôpital, auprès de personnes fragiles, en fin de vie ou en reprise d'autonomie. C'est là que j'ai appris à observer, écouter, respecter un corps.";
  const listening = settings["about_values_listening"] || "Ton corps, ton histoire, ton rythme.";
  const rigor = settings["about_values_rigor"] || "Protocoles clairs, suivi précis, sécurité.";
  const kindness = settings["about_values_kindness"] || "Zéro jugement, zéro culpabilité.";

  return (
    <>
      <section className="container-editorial pt-20 pb-12">
        <p className="eyebrow">À propos</p>
        <h1 className="section-title mt-3 max-w-3xl">
          De soignante à coach, au service de ton bien-être
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-brand-dark/85 leading-relaxed">
          {introText}
        </p>
      </section>

      <section className="container-editorial grid md:grid-cols-2 gap-12 pb-24 items-start">
        <div className="relative aspect-[3/4] rounded-xl2 overflow-hidden">
          <Image
            src={imgPortrait}
            alt="Élodie"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-5 text-brand-dark/90 leading-relaxed">
          <p>
            Infirmière diplômée d'État, j'ai passé huit années en milieu hospitalier et en EHPAD,
            notamment à l'Hôpital Privé La Porte Verte (Versailles), au Centre Hospitalier
            Ambroise Paré (Mons, Belgique) et aux Logis Douaisiens. La gériatrie et les soins
            palliatifs m'ont enseigné la rigueur, la patience et la lecture fine du corps humain.
          </p>
          <p>
            J'ai choisi de déplacer mon action : plutôt que de réparer, accompagner en amont. Le
            sport et la nutrition sont devenus mon nouveau champ d'intervention pour aider chacun
            à vivre mieux, plus longtemps, et en confiance avec son corps.
          </p>
          <p>
            Aujourd'hui, je coache à domicile, en extérieur, en salle et en ligne depuis
            Poliez-Pittet. J'accompagne femmes et hommes de tous âges, tous niveaux, avec une
            seule promesse : un parcours personnalisé, exigeant et humain.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-brand-nude">
        <div className="container-editorial py-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="eyebrow">Valeurs</p>
            <h2 className="section-title mt-3">Trois piliers</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Heart, title: "Écoute", body: listening },
              { icon: ShieldCheck, title: "Rigueur", body: rigor },
              { icon: Sparkles, title: "Bienveillance", body: kindness }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-xl2 p-8 text-center shadow-card">
                <Icon className="mx-auto text-brand-rose" size={28} />
                <h3 className="mt-4 font-serif text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-brand-taupe">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="container-editorial py-24">
        <p className="eyebrow">Diplômes & certifications</p>
        <h2 className="section-title mt-3">Un bagage solide</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            "Infirmière Diplômée d'État (IDE) — 2012",
            "Qualification gériatrique — 2014",
            "Formation humanitaire — 2017",
            "AFGSU 2 — 2020",
            "Certification coach sportif",
            "Spécialisation nutrition sportive",
            "Français & Anglais (C2)"
          ].map((c) => (
            <li key={c} className="flex items-start gap-3 bg-brand-ivory border border-brand-divider rounded-xl2 p-5">
              <span className="mt-1 w-2 h-2 rounded-full bg-brand-rose" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-brand-dark text-brand-ivory">
        <div className="container-editorial py-20 text-center">
          <h2 className="font-serif text-display-md font-bold">On se rencontre ?</h2>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Réserver une séance</Link>
          </div>
        </div>
      </section>
    </>
  );
}
