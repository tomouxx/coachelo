"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  MessageSquareQuote,
  Package,
  Settings,
  Edit3,
  LogOut,
  ExternalLink
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Réservations", icon: Calendar },
  { href: "/admin/disponibilites", label: "Disponibilités", icon: Clock },
  { href: "/admin/services", label: "Prestations", icon: Package },
  { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquareQuote },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/contenu", label: "Contenu du site", icon: Edit3 },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings }
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-brand-dark text-brand-ivory min-h-screen p-6 flex flex-col">
      <div className="mb-10">
        <div className="font-serif text-2xl text-brand-rose">Élodie Duhayon</div>
        <div className="text-xs text-brand-beige uppercase tracking-wider mt-1">Administration</div>
      </div>

      <nav className="flex-1 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                active
                  ? "bg-brand-rose text-white"
                  : "text-brand-ivory/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-4 mt-6 space-y-3">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 text-sm text-brand-roseLight hover:text-white transition"
        >
          <ExternalLink className="w-4 h-4" /> Voir le site
        </a>
        <div className="text-xs text-brand-beige mb-1">Connectée</div>
        <div className="text-sm mb-3">{userName}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-sm text-brand-ivory/70 hover:text-white transition"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
