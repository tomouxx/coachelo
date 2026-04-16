import { getSettings } from "@/lib/settings";
import { Mail, Phone, MapPin, Clock, Instagram } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const [contactS, pageS] = await Promise.all([
    getSettings("contact_info").catch((): Record<string, string> => ({})),
    getSettings("contact_page").catch((): Record<string, string> => ({}))
  ]);

  const c = (key: string, fallback: string) => contactS[key] || fallback;
  const pg = (key: string, fallback: string) => pageS[key] || fallback;
  const instagram = c("contact_instagram", "https://instagram.com");
  const igHandle = instagram.includes("instagram.com/") ? "@" + instagram.split("instagram.com/")[1].replace(/\/$/, "") : "@elodieduhayon";

  return (
    <>
      <section className="container-editorial pt-20 pb-12 text-center">
        <p className="eyebrow">Contact</p>
        <h1 className="section-title mt-3">Parlons de tes objectifs</h1>
        <p className="mt-5 max-w-xl mx-auto text-brand-taupe">
          Une question, un message, ou juste envie de discuter ? Écris-moi, je te réponds rapidement.
        </p>
      </section>

      <section className="container-editorial pb-24 grid gap-10 lg:grid-cols-2">
        {/* Formulaire de contact */}
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-6">Envoie-moi un message</h2>
          <form action="/api/contact" method="post" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-brand-taupe">Prénom*</span>
                <input name="firstName" required minLength={2} className="mt-1 w-full px-3 py-2 bg-brand-ivory border border-brand-divider rounded-md focus:border-brand-rose outline-none" />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-brand-taupe">Nom</span>
                <input name="lastName" className="mt-1 w-full px-3 py-2 bg-brand-ivory border border-brand-divider rounded-md focus:border-brand-rose outline-none" />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-brand-taupe">Email*</span>
                <input name="email" type="email" required className="mt-1 w-full px-3 py-2 bg-brand-ivory border border-brand-divider rounded-md focus:border-brand-rose outline-none" />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-brand-taupe">Téléphone</span>
                <input name="phone" className="mt-1 w-full px-3 py-2 bg-brand-ivory border border-brand-divider rounded-md focus:border-brand-rose outline-none" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-brand-taupe">Message*</span>
              <textarea name="message" required minLength={5} rows={5} className="mt-1 w-full px-3 py-2 bg-brand-ivory border border-brand-divider rounded-md focus:border-brand-rose outline-none" />
            </label>
            {/* Honeypot anti-spam */}
            <input name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
            <label className="flex items-start gap-2 text-xs text-brand-taupe">
              <input type="checkbox" name="consent" required className="mt-0.5" />
              J&apos;accepte que mes données soient utilisées pour traiter ma demande
              (voir <Link href="/confidentialite" className="text-brand-terracotta underline">politique de confidentialité</Link>).
            </label>
            <button type="submit" className="btn btn-primary w-full md:w-auto">
              Envoyer mon message
            </button>
          </form>
        </div>

        {/* Coordonnées */}
        <aside className="space-y-8">
          <div id="decouverte" className="bg-brand-dark text-brand-ivory rounded-xl2 p-8">
            <h3 className="font-serif text-xl font-semibold text-brand-roseLight">
              {pg("contact_discovery_title", "Appel découverte 15 min")}
            </h3>
            <p className="mt-3 text-sm text-brand-ivory/80">
              {pg("contact_discovery_text", "On fait connaissance, on parle de tes objectifs, on voit si on est faites pour travailler ensemble. Sans engagement.")}
            </p>
            <a href={`tel:${c("contact_phone", "+41000000000").replace(/\s/g, "")}`} className="mt-5 btn btn-primary w-full">
              {pg("contact_discovery_cta", "Planifier mon appel")}
            </a>
          </div>

          <div className="bg-brand-nude rounded-xl2 p-8 space-y-3 text-sm">
            <h3 className="font-serif text-xl font-semibold">Mes coordonnées</h3>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand-rose" /> {c("contact_address", "Poliez-Pittet, Suisse")}</p>
            <p className="flex items-center gap-2"><Mail size={16} className="text-brand-rose" /> {c("contact_email", "contact@coachelo.ch")}</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-brand-rose" /> {c("contact_phone", "+41 00 000 00 00")}</p>
            <p className="flex items-center gap-2"><Clock size={16} className="text-brand-rose" /> {pg("contact_hours", "Lun-Ven 8h-19h · Sam 9h-13h")}</p>
            <p className="flex items-center gap-2"><Instagram size={16} className="text-brand-rose" /> <a href={instagram} target="_blank" rel="noopener" className="hover:text-brand-terracotta">{igHandle}</a></p>
          </div>

          <div className="rounded-xl2 overflow-hidden border border-brand-divider">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=6.6%2C46.6%2C6.7%2C46.7&layer=mapnik"
              className="w-full aspect-video"
              loading="lazy"
              title="Carte Poliez-Pittet"
            />
          </div>
        </aside>
      </section>
    </>
  );
}
