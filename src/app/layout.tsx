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
    default: "Élodie Duhayon · Coach sportive & nutrition en Suisse",
    template: "%s · Élodie Duhayon"
  },
  description:
    "Coaching sportif et nutrition personnalisés à Poliez-Pittet et en ligne. Ancienne infirmière diplômée d'État, je t'accompagne avec rigueur et bienveillance.",
  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: "Élodie Duhayon Personal Trainer"
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
