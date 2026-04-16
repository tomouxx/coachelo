import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/settings";

export default async function Footer() {
  const [contactS, footerS] = await Promise.all([
    getSettings("contact_info").catch((): Record<string, string> => ({})),
    getSettings("footer").catch((): Record<string, string> => ({}))
  ]);

  const address = contactS["contact_address"] || "Poliez-Pittet, Suisse";
  const email = contactS["contact_email"] || "contact@elodieduhayon.ch";
  const phone = contactS["contact_phone"] || "+41 00 000 00 00";
  const instagram = contactS["contact_instagram"] || "https://instagram.com";
  const igHandle = instagram.includes("instagram.com/") ? "@" + instagram.split("instagram.com/")[1].replace(/\/$/, "") : "@elodieduhayon";

  const tagline = footerS["footer_tagline"] || "Coach sportive & nutrition à Poliez-Pittet et en ligne. Infirmière Diplômée d'État.";
  const newsletterText = footerS["footer_newsletter_text"] || "Reçois mes conseils sport & nutrition.";

  return (
    <footer className="bg-brand-dark text-brand-ivory mt-20">
      <div className="container-editorial py-16 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-brand-roseLight">Élodie Duhayon</h3>
          <p className="mt-3 text-sm text-brand-ivory/70 leading-relaxed">{tagline}</p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-wider text-brand-roseLight mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-brand-ivory/80">
            <li><Link href="/a-propos">À propos</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/nutrition">Nutrition</Link></li>
            <li><Link href="/tarifs">Tarifs</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-wider text-brand-roseLight mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-brand-ivory/80">
            <li className="flex items-center gap-2"><MapPin size={14} /> {address}</li>
            <li className="flex items-center gap-2"><Mail size={14} /> {email}</li>
            <li className="flex items-center gap-2"><Phone size={14} /> {phone}</li>
            <li className="flex items-center gap-2"><Instagram size={14} /> {igHandle}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-wider text-brand-roseLight mb-4">Newsletter</h4>
          <p className="text-sm text-brand-ivory/70 mb-3">{newsletterText}</p>
          <form action="/api/newsletter" method="post" className="flex">
            <input
              name="email"
              type="email"
              required
              placeholder="Ton email"
              className="flex-1 bg-brand-ivory/10 border border-brand-ivory/20 text-sm px-3 py-2 rounded-l-md placeholder:text-brand-ivory/40"
            />
            <button type="submit" className="bg-brand-rose px-4 rounded-r-md text-sm font-semibold">OK</button>
          </form>
        </div>
      </div>

      <div className="border-t border-brand-ivory/10">
        <div className="container-editorial flex flex-col md:flex-row items-center justify-between py-6 gap-4 text-xs text-brand-ivory/60">
          <p>© {new Date().getFullYear()} Élodie Duhayon. Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/cgv">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
