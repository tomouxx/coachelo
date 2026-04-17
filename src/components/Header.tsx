"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const nav = [
  { href: "/#about", label: "Histoire" },
  { href: "/#services", label: "Coaching" },
  { href: "/#nutrition", label: "Nutrition" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div
        className={`container-editorial transition-all duration-500 ${
          scrolled ? "pt-3 pb-3" : "pt-5 pb-5"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? "bg-brand-ivoire/92 backdrop-blur-xl border border-brand-divider/70 rounded-full px-4 lg:px-5 py-2.5 shadow-card"
              : "px-2 py-1"
          }`}
        >
          <Link href="/" className="flex items-baseline gap-3 group" aria-label="Accueil">
            <span className="font-display font-medium text-[1.15rem] lg:text-[1.25rem] text-brand-chocolat tracking-tight">
              Élodie Duhayon
            </span>
            <span className="hidden sm:inline-block text-[9.5px] uppercase tracking-[0.28em] text-brand-fumee font-medium">
              Coach · Mouvement & Nutrition
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-[0.78rem] font-medium text-brand-chocolatSoft">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3.5 py-2 rounded-full hover:bg-brand-argileSoft hover:text-brand-argileDeep transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <Link
              href="/reservation"
              className="inline-flex items-center gap-1.5 bg-brand-chocolat text-brand-ivoire rounded-full pl-4 pr-1.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] hover:bg-brand-argileDeep transition-colors group"
            >
              Réserver
              <span className="w-7 h-7 rounded-full bg-brand-argile text-brand-chocolat flex items-center justify-center group-hover:bg-brand-ivoire transition-colors">
                <ArrowUpRight size={13} />
              </span>
            </Link>
          </div>

          <button
            className="lg:hidden text-brand-chocolat p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden mx-6 mb-4 bg-brand-linPale border border-brand-divider/70 rounded-[2rem] shadow-card">
          <nav className="flex flex-col py-6 px-6 gap-1 text-sm font-medium">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-brand-chocolatSoft hover:text-brand-argileDeep px-3 py-3 rounded-xl hover:bg-brand-argileSoft/60"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/reservation"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-4"
            >
              Réserver une séance
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
