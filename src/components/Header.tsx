"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/#services", label: "Services" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur border-b border-brand-divider">
      <div className="container-editorial flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3" aria-label="Accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/monogramme-transparent.png" alt="Logo Élodie Duhayon" width={40} height={40} className="rounded-full" />
          <span className="font-serif text-xl font-bold text-brand-terracotta">
            Élodie Duhayon
          </span>
          <span className="hidden md:inline-block text-[10px] uppercase tracking-[0.22em] text-brand-taupe">
            Personal Trainer
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm text-brand-dark/80">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brand-terracotta transition">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/reservation" className="btn btn-primary text-xs">
            Réserver
          </Link>
        </div>

        <button
          className="lg:hidden text-brand-dark"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-brand-divider bg-brand-ivory">
          <nav className="container-editorial flex flex-col py-6 gap-5 text-sm">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-brand-dark/80 hover:text-brand-terracotta"
              >
                {n.label}
              </Link>
            ))}
            <Link href="/reservation" onClick={() => setOpen(false)} className="btn btn-primary mt-2">
              Réserver une séance
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
