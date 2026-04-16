import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.coachelo.ch"),
  title: {
    default: "Élodie Duhayon · Coach sportive & nutrition à Poliez-Pittet",
    template: "%s · Élodie Duhayon"
  },
  description:
    "Coaching sportif et nutrition personnalisés à domicile, en extérieur, en salle et en ligne. Ancienne infirmière diplômée, Élodie t'accompagne avec rigueur et bienveillance depuis Poliez-Pittet, Suisse.",
  keywords: [
    "coach sportif", "personal trainer", "nutrition", "Poliez-Pittet",
    "Lausanne", "Suisse", "coaching personnalisé", "coach femme",
    "fitness", "remise en forme", "perte de poids", "renforcement musculaire"
  ],
  authors: [{ name: "Élodie Duhayon" }],
  creator: "Élodie Duhayon",
  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: "Élodie Duhayon — Personal Trainer",
    title: "Élodie Duhayon · Coach sportive & nutrition à Poliez-Pittet",
    description: "Coaching sportif et nutrition personnalisés à domicile, en extérieur, en salle et en ligne depuis Poliez-Pittet.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Élodie Duhayon — Personal Trainer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Élodie Duhayon · Coach sportive & nutrition",
    description: "Coaching sportif et nutrition personnalisés depuis Poliez-Pittet, Suisse.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {process.env.PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
