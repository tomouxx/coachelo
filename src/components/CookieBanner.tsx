"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("edh_cookie_consent")) setVisible(true);
  }, []);

  function decide(value: "accept" | "refuse") {
    localStorage.setItem("edh_cookie_consent", value);
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md z-50 bg-white border border-brand-divider rounded-xl2 shadow-soft p-5">
      <p className="text-sm text-brand-dark/90 leading-relaxed">
        Ce site utilise Plausible Analytics, un outil respectueux de la vie privée qui ne
        dépose aucun cookie de suivi. Voir notre{" "}
        <a href="/confidentialite" className="text-brand-terracotta underline">
          politique de confidentialité
        </a>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => decide("accept")}
          className="flex-1 btn btn-primary text-xs py-2"
        >
          J'ai compris
        </button>
        <button
          onClick={() => decide("refuse")}
          className="flex-1 btn btn-outline text-xs py-2"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
