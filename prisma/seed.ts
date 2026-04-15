import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Charge manuellement .env (tsx ne le fait pas par défaut)
try {
  const envPath = resolve(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
} catch {
  // .env absent — on continuera avec les valeurs par défaut
}

const prisma = new PrismaClient();

async function main() {
  // --- Admin users ---
  const elodiePwd = process.env.ADMIN_PASSWORD_ELODIE || "ChangeMoi!2026";
  const thomasPwd = process.env.ADMIN_PASSWORD_THOMAS || "ChangeMoi!2026";

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL_ELODIE || "elodie@elodieduhayon.ch" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL_ELODIE || "elodie@elodieduhayon.ch",
      name: "Élodie Duhayon",
      passwordHash: await bcrypt.hash(elodiePwd, 10),
      role: "OWNER"
    }
  });

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL_THOMAS || "thomas@elodieduhayon.ch" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL_THOMAS || "thomas@elodieduhayon.ch",
      name: "Thomas Duhayon",
      passwordHash: await bcrypt.hash(thomasPwd, 10),
      role: "ADMIN"
    }
  });

  // --- Services ---
  const services = [
    {
      slug: "coaching-domicile",
      name: "Coaching à domicile",
      description:
        "Séances personnalisées chez toi. Programme sur mesure, matériel adapté, suivi régulier. L'option la plus confortable et la plus flexible.",
      priceLabel: "Dès 90 CHF / séance",
      durationMin: 60,
      location: "HOME",
      featured: true,
      sortOrder: 1
    },
    {
      slug: "coaching-exterieur",
      name: "Coaching en extérieur",
      description:
        "Entraînement en pleine nature autour de Poliez-Pittet : lac, forêt, parc. Idéal pour varier les environnements et profiter de la Suisse.",
      priceLabel: "Dès 80 CHF / séance",
      durationMin: 60,
      location: "OUTDOOR",
      sortOrder: 2
    },
    {
      slug: "coaching-salle",
      name: "Coaching en salle",
      description:
        "Séances encadrées en salle de sport, avec accès à tout l'équipement pour un travail progressif et technique.",
      priceLabel: "Dès 85 CHF / séance",
      durationMin: 60,
      location: "GYM",
      sortOrder: 3
    },
    {
      slug: "programme-personnalise",
      name: "Programme personnalisé",
      description:
        "Plan d'entraînement et nutrition 100% sur mesure à suivre en autonomie, avec bilan de lancement et suivi mensuel en visio.",
      priceLabel: "Dès 150 CHF / mois",
      durationMin: 30,
      location: "ONLINE",
      sortOrder: 4
    }
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s
    });
  }

  // --- Testimonials placeholders ---
  const testimonials = [
    {
      name: "Sophie M.",
      program: "Coaching à domicile · 3 mois",
      quote:
        "Le regard d'infirmière d'Élodie change tout : elle comprend mon corps, mes limites, et m'emmène juste au bon niveau. Résultats visibles et durables.",
      rating: 5,
      sortOrder: 1
    },
    {
      name: "Laure K.",
      program: "Programme personnalisé",
      quote:
        "J'ai enfin trouvé un équilibre sport + nutrition qui tient dans une vie de maman. Un vrai suivi, zéro jugement.",
      rating: 5,
      sortOrder: 2
    },
    {
      name: "Marc D.",
      program: "Coaching en extérieur",
      quote:
        "Des séances exigeantes mais toujours adaptées. Élodie pousse juste ce qu'il faut. Je ne retournerai plus jamais seul à la salle.",
      rating: 5,
      sortOrder: 3
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // --- Availability rules : lun-ven 8h-19h, sam 9h-13h ---
  const rules = [
    { weekday: 1, startMin: 8 * 60, endMin: 19 * 60 },
    { weekday: 2, startMin: 8 * 60, endMin: 19 * 60 },
    { weekday: 3, startMin: 8 * 60, endMin: 19 * 60 },
    { weekday: 4, startMin: 8 * 60, endMin: 19 * 60 },
    { weekday: 5, startMin: 8 * 60, endMin: 19 * 60 },
    { weekday: 6, startMin: 9 * 60, endMin: 13 * 60 }
  ];
  for (const r of rules) {
    await prisma.availabilityRule.create({ data: r });
  }

  // --- Contenu de pages par défaut ---
  const content = [
    { key: "home.hero.eyebrow", value: "Coach sportive & nutrition · Suisse" },
    { key: "home.hero.title", value: "Coach sportive & nutrition à ton rythme" },
    {
      key: "home.hero.subtitle",
      value:
        "Coaching personnalisé à domicile, en extérieur, en salle et en ligne — depuis Poliez-Pittet."
    },
    { key: "about.intro.title", value: "De soignante à coach" },
    {
      key: "about.intro.body",
      value:
        "Infirmière diplômée d'État avec plus de huit années d'expérience en gériatrie et soins palliatifs, j'ai fait le choix d'accompagner désormais la santé en amont, par le mouvement et la nutrition."
    }
  ];
  for (const c of content) {
    await prisma.pageContent.upsert({
      where: { key: c.key },
      update: { value: c.value },
      create: c
    });
  }

  console.log("Seed OK ✓");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
