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

  // Supprime les anciens témoignages avant de recréer (évite les doublons)
  await prisma.testimonial.deleteMany();
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

  // --- Site Settings (editable from admin panel) ---
  const siteSettings = [
    // HERO / Homepage
    {
      key: "home_hero_eyebrow",
      category: "hero",
      label: "Eyebrow (Sous-titre en petit)",
      type: "text",
      value: "Coach sportive & nutrition · Suisse",
      sortOrder: 1
    },
    {
      key: "home_hero_title",
      category: "hero",
      label: "Titre principal",
      type: "text",
      value: "Coach sportive & nutrition à ton rythme",
      sortOrder: 2
    },
    {
      key: "home_hero_subtitle",
      category: "hero",
      label: "Sous-titre",
      type: "textarea",
      value: "Coaching personnalisé à domicile, en extérieur, en salle et en ligne — depuis Poliez-Pittet.",
      sortOrder: 3
    },
    // ABOUT PAGE
    {
      key: "about_page_intro_text",
      category: "about",
      label: "Texte introduction page À propos",
      type: "textarea",
      value: "Mon parcours n'a pas commencé dans une salle de sport. Il a commencé à l'hôpital, auprès de personnes fragiles, en fin de vie ou en reprise d'autonomie. C'est là que j'ai appris à observer, écouter, respecter un corps.",
      sortOrder: 1
    },
    {
      key: "about_page_body",
      category: "about",
      label: "Corps de la page À propos",
      type: "richtext",
      value: "<p>Infirmière diplômée d'État, j'ai passé huit années en milieu hospitalier et en EHPAD, notamment à l'Hôpital Privé La Porte Verte (Versailles), au Centre Hospitalier Ambroise Paré (Mons, Belgique) et aux Logis Douaisiens. La gériatrie et les soins palliatifs m'ont enseigné la rigueur, la patience et la lecture fine du corps humain.</p><p>J'ai choisi de déplacer mon action : plutôt que de réparer, accompagner en amont. Le sport et la nutrition sont devenus mon nouveau champ d'intervention pour aider chacun à vivre mieux, plus longtemps, et en confiance avec son corps.</p><p>Aujourd'hui, je coache à domicile, en extérieur, en salle et en ligne depuis Poliez-Pittet. J'accompagne femmes et hommes de tous âges, tous niveaux, avec une seule promesse : un parcours personnalisé, exigeant et humain.</p>",
      sortOrder: 2
    },
    {
      key: "about_values_listening",
      category: "about",
      label: "Valeur 1: Écoute",
      type: "text",
      value: "Ton corps, ton histoire, ton rythme.",
      sortOrder: 3
    },
    {
      key: "about_values_rigor",
      category: "about",
      label: "Valeur 2: Rigueur",
      type: "text",
      value: "Protocoles clairs, suivi précis, sécurité.",
      sortOrder: 4
    },
    {
      key: "about_values_kindness",
      category: "about",
      label: "Valeur 3: Bienveillance",
      type: "text",
      value: "Zéro jugement, zéro culpabilité.",
      sortOrder: 5
    },
    // NUTRITION PAGE
    {
      key: "nutrition_hero_title",
      category: "nutrition",
      label: "Titre principal",
      type: "text",
      value: "La nutrition, moitié du chemin",
      sortOrder: 1
    },
    {
      key: "nutrition_hero_subtitle",
      category: "nutrition",
      label: "Sous-titre",
      type: "text",
      value: "Une approche durable, concrète, sans régime ni culpabilité.",
      sortOrder: 2
    },
    {
      key: "nutrition_method_step1",
      category: "nutrition",
      label: "Étape 1: Titre",
      type: "text",
      value: "1. Bilan nutritionnel",
      sortOrder: 3
    },
    {
      key: "nutrition_method_step1_desc",
      category: "nutrition",
      label: "Étape 1: Description",
      type: "text",
      value: "On analyse ton quotidien, tes contraintes, tes goûts et tes objectifs.",
      sortOrder: 4
    },
    {
      key: "nutrition_method_step2",
      category: "nutrition",
      label: "Étape 2: Titre",
      type: "text",
      value: "2. Plan personnalisé",
      sortOrder: 5
    },
    {
      key: "nutrition_method_step2_desc",
      category: "nutrition",
      label: "Étape 2: Description",
      type: "text",
      value: "Un plan alimentaire clair, avec recettes simples et alternatives.",
      sortOrder: 6
    },
    {
      key: "nutrition_method_step3",
      category: "nutrition",
      label: "Étape 3: Titre",
      type: "text",
      value: "3. Suivi & ajustements",
      sortOrder: 7
    },
    {
      key: "nutrition_method_step3_desc",
      category: "nutrition",
      label: "Étape 3: Description",
      type: "text",
      value: "Points réguliers pour ajuster selon tes progrès et ta vie.",
      sortOrder: 8
    },
    {
      key: "nutrition_philosophy_title",
      category: "nutrition",
      label: "Philosophie: Titre",
      type: "text",
      value: "Mange vrai. Mange juste.",
      sortOrder: 9
    },
    {
      key: "nutrition_philosophy_body",
      category: "nutrition",
      label: "Philosophie: Corps du texte",
      type: "textarea",
      value: "Je n'impose ni régime strict ni liste d'interdits. Je crois en une alimentation vivante, plaisir, construite autour de ton mode de vie. L'objectif : un rapport apaisé à la nourriture, et des résultats qui durent.",
      sortOrder: 10
    },
    // TARIFS / SERVICES PAGE
    {
      key: "services_page_title",
      category: "tarifs",
      label: "Titre de la page",
      type: "text",
      value: "Un coaching qui s'adapte à ta vie",
      sortOrder: 1
    },
    {
      key: "services_page_subtitle",
      category: "tarifs",
      label: "Sous-titre",
      type: "text",
      value: "Quatre formats pour répondre à ta réalité. Toujours la même exigence, toujours le même cap.",
      sortOrder: 2
    },
    // SERVICES FAQ
    {
      key: "faq_q1",
      category: "services_faq",
      label: "Question 1",
      type: "text",
      value: "Combien de temps dure une séance ?",
      sortOrder: 1
    },
    {
      key: "faq_a1",
      category: "services_faq",
      label: "Réponse 1",
      type: "text",
      value: "Généralement 60 minutes. Les premiers bilans durent 75 à 90 minutes.",
      sortOrder: 2
    },
    {
      key: "faq_q2",
      category: "services_faq",
      label: "Question 2",
      type: "text",
      value: "Je suis débutante, c'est adapté ?",
      sortOrder: 3
    },
    {
      key: "faq_a2",
      category: "services_faq",
      label: "Réponse 2",
      type: "text",
      value: "Absolument. Tout est construit en fonction de ton niveau et de ton rythme.",
      sortOrder: 4
    },
    {
      key: "faq_q3",
      category: "services_faq",
      label: "Question 3",
      type: "text",
      value: "Quel est le délai pour annuler ?",
      sortOrder: 5
    },
    {
      key: "faq_a3",
      category: "services_faq",
      label: "Réponse 3",
      type: "text",
      value: "Merci de prévenir au moins 24h à l'avance. Au-delà, la séance est due.",
      sortOrder: 6
    },
    {
      key: "faq_q4",
      category: "services_faq",
      label: "Question 4",
      type: "text",
      value: "Puis-je mixer plusieurs formats ?",
      sortOrder: 7
    },
    {
      key: "faq_a4",
      category: "services_faq",
      label: "Réponse 4",
      type: "text",
      value: "Oui, c'est même recommandé : un peu de salle, un peu d'extérieur, suivi en ligne.",
      sortOrder: 8
    },
    // CONTACT INFO
    {
      key: "contact_address",
      category: "contact_info",
      label: "Adresse",
      type: "text",
      value: "Poliez-Pittet, Suisse",
      sortOrder: 1
    },
    {
      key: "contact_phone",
      category: "contact_info",
      label: "Téléphone",
      type: "text",
      value: "+41 00 000 00 00",
      sortOrder: 2
    },
    {
      key: "contact_email",
      category: "contact_info",
      label: "Email",
      type: "text",
      value: "contact@elodieduhayon.ch",
      sortOrder: 3
    },
    {
      key: "contact_instagram",
      category: "contact_info",
      label: "Instagram (URL)",
      type: "text",
      value: "https://instagram.com",
      sortOrder: 4
    },
    // IMAGES
    {
      key: "img_hero_bg",
      category: "images",
      label: "Image de fond Hero (Accueil)",
      type: "image",
      value: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80",
      sortOrder: 1
    },
    {
      key: "img_portrait_elodie",
      category: "images",
      label: "Portrait d'Élodie (Accueil + À propos)",
      type: "image",
      value: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=80",
      sortOrder: 2
    },
    {
      key: "img_nutrition_hero",
      category: "images",
      label: "Image de fond Hero Nutrition",
      type: "image",
      value: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80",
      sortOrder: 3
    },
    {
      key: "img_nutrition_philosophy",
      category: "images",
      label: "Image Philosophie Nutrition",
      type: "image",
      value: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
      sortOrder: 4
    },
    {
      key: "img_home_nutrition_bg",
      category: "images",
      label: "Image fond section Nutrition (Accueil)",
      type: "image",
      value: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80",
      sortOrder: 5
    },
    {
      key: "img_service_home",
      category: "images",
      label: "Photo service — À domicile",
      type: "image",
      value: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      sortOrder: 6
    },
    {
      key: "img_service_outdoor",
      category: "images",
      label: "Photo service — Extérieur",
      type: "image",
      value: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
      sortOrder: 7
    },
    {
      key: "img_service_gym",
      category: "images",
      label: "Photo service — Salle de sport",
      type: "image",
      value: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      sortOrder: 8
    },
    {
      key: "img_service_online",
      category: "images",
      label: "Photo service — En ligne",
      type: "image",
      value: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
      sortOrder: 9
    },
    {
      key: "img_logo",
      category: "images",
      label: "Logo principal (Footer)",
      type: "image",
      value: "/logo.png",
      sortOrder: 10
    },
    {
      key: "img_monogramme",
      category: "images",
      label: "Monogramme (Header)",
      type: "image",
      value: "/monogramme.png",
      sortOrder: 11
    },
    // HOME SECTIONS (all non-hero homepage content)
    {
      key: "home_about_eyebrow",
      category: "home_sections",
      label: "Section À propos - Eyebrow",
      type: "text",
      value: "À propos",
      sortOrder: 1
    },
    {
      key: "home_about_title",
      category: "home_sections",
      label: "Section À propos - Titre",
      type: "text",
      value: "De soignante à coach",
      sortOrder: 2
    },
    {
      key: "home_about_text",
      category: "home_sections",
      label: "Section À propos - Texte",
      type: "textarea",
      value: "Infirmière diplômée d'État avec plus de huit années d'expérience en gériatrie et soins palliatifs, j'ai choisi d'accompagner la santé en amont — par le mouvement et la nutrition. Mon regard de soignante change tout : j'écoute ton corps avant de pousser.",
      sortOrder: 3
    },
    {
      key: "home_credential",
      category: "home_sections",
      label: "Section À propos - Crédentiel",
      type: "text",
      value: "Infirmière Diplômée d'État · Certifiée coach sportif",
      sortOrder: 4
    },
    {
      key: "home_services_eyebrow",
      category: "home_sections",
      label: "Section Services - Eyebrow",
      type: "text",
      value: "Services",
      sortOrder: 5
    },
    {
      key: "home_services_title",
      category: "home_sections",
      label: "Section Services - Titre",
      type: "text",
      value: "Accompagnements sur mesure",
      sortOrder: 6
    },
    {
      key: "home_nutrition_eyebrow",
      category: "home_sections",
      label: "Section Nutrition - Eyebrow",
      type: "text",
      value: "Nutrition",
      sortOrder: 7
    },
    {
      key: "home_nutrition_title",
      category: "home_sections",
      label: "Section Nutrition - Titre",
      type: "text",
      value: "La nutrition, pilier de ta transformation",
      sortOrder: 8
    },
    {
      key: "home_nutrition_text",
      category: "home_sections",
      label: "Section Nutrition - Texte",
      type: "textarea",
      value: "Pas de régime, pas de culpabilité. Une approche durable, concrète, alignée avec ta vie.",
      sortOrder: 9
    },
    {
      key: "home_testimonials_eyebrow",
      category: "home_sections",
      label: "Section Témoignages - Eyebrow",
      type: "text",
      value: "Témoignages",
      sortOrder: 10
    },
    {
      key: "home_testimonials_title",
      category: "home_sections",
      label: "Section Témoignages - Titre",
      type: "text",
      value: "Leur expérience avec Élodie",
      sortOrder: 11
    },
    {
      key: "home_steps_eyebrow",
      category: "home_sections",
      label: "Section Étapes - Eyebrow",
      type: "text",
      value: "Comment ça se passe",
      sortOrder: 12
    },
    {
      key: "home_steps_title",
      category: "home_sections",
      label: "Section Étapes - Titre",
      type: "text",
      value: "Quatre étapes simples",
      sortOrder: 13
    },
    {
      key: "home_step1_title",
      category: "home_sections",
      label: "Étape 1 - Titre",
      type: "text",
      value: "Appel découverte",
      sortOrder: 14
    },
    {
      key: "home_step1_desc",
      category: "home_sections",
      label: "Étape 1 - Description",
      type: "text",
      value: "15 min offerts pour faire connaissance.",
      sortOrder: 15
    },
    {
      key: "home_step2_title",
      category: "home_sections",
      label: "Étape 2 - Titre",
      type: "text",
      value: "Bilan & objectifs",
      sortOrder: 16
    },
    {
      key: "home_step2_desc",
      category: "home_sections",
      label: "Étape 2 - Description",
      type: "text",
      value: "On définit ensemble un cap clair.",
      sortOrder: 17
    },
    {
      key: "home_step3_title",
      category: "home_sections",
      label: "Étape 3 - Titre",
      type: "text",
      value: "Programme sur mesure",
      sortOrder: 18
    },
    {
      key: "home_step3_desc",
      category: "home_sections",
      label: "Étape 3 - Description",
      type: "text",
      value: "Un plan adapté à ta vie.",
      sortOrder: 19
    },
    {
      key: "home_step4_title",
      category: "home_sections",
      label: "Étape 4 - Titre",
      type: "text",
      value: "Suivi & résultats",
      sortOrder: 20
    },
    {
      key: "home_step4_desc",
      category: "home_sections",
      label: "Étape 4 - Description",
      type: "text",
      value: "On ajuste, on progresse, on célèbre.",
      sortOrder: 21
    },
    {
      key: "home_blog_eyebrow",
      category: "home_sections",
      label: "Section Blog - Eyebrow",
      type: "text",
      value: "Journal",
      sortOrder: 22
    },
    {
      key: "home_blog_title",
      category: "home_sections",
      label: "Section Blog - Titre",
      type: "text",
      value: "Conseils sport & nutrition",
      sortOrder: 23
    },
    {
      key: "home_cta_title",
      category: "home_sections",
      label: "Section CTA - Titre",
      type: "text",
      value: "Prête à te lancer ?",
      sortOrder: 24
    },
    // ABOUT EXTRA (about page remaining hardcoded content)
    {
      key: "about_page_title",
      category: "about_extra",
      label: "Titre de la page À propos",
      type: "text",
      value: "De soignante à coach, au service de ton bien-être",
      sortOrder: 1
    },
    {
      key: "about_bio_body",
      category: "about_extra",
      label: "Biographie - Corps du texte",
      type: "richtext",
      value: "<p>Infirmière diplômée d'État, j'ai passé huit années en milieu hospitalier et en EHPAD, notamment à l'Hôpital Privé La Porte Verte (Versailles), au Centre Hospitalier Ambroise Paré (Mons, Belgique) et aux Logis Douaisiens. La gériatrie et les soins palliatifs m'ont enseigné la rigueur, la patience et la lecture fine du corps humain.</p><p>J'ai choisi de déplacer mon action : plutôt que de réparer, accompagner en amont. Le sport et la nutrition sont devenus mon nouveau champ d'intervention pour aider chacun à vivre mieux, plus longtemps, et en confiance avec son corps.</p><p>Aujourd'hui, je coache à domicile, en extérieur, en salle et en ligne depuis Poliez-Pittet. J'accompagne femmes et hommes de tous âges, tous niveaux, avec une seule promesse : un parcours personnalisé, exigeant et humain.</p>",
      sortOrder: 2
    },
    {
      key: "about_credentials",
      category: "about_extra",
      label: "Crédentiels",
      type: "textarea",
      value: "Infirmière Diplômée d'État (IDE) — 2012\nQualification gériatrique — 2014\nFormation humanitaire — 2017\nAFGSU 2 — 2020\nCertification coach sportif\nSpécialisation nutrition sportive\nFrançais & Anglais (C2)",
      sortOrder: 3
    },
    {
      key: "about_cta_title",
      category: "about_extra",
      label: "CTA - Titre",
      type: "text",
      value: "On se rencontre ?",
      sortOrder: 4
    },
    // NUTRITION EXTRA (nutrition page remaining hardcoded content)
    {
      key: "nutrition_bullets",
      category: "nutrition_extra",
      label: "Points clés",
      type: "textarea",
      value: "Produits bruts et de saison en priorité\nPas d'interdits, pas de calculs obsessionnels\nPrise en compte des habitudes familiales\nAlliance coaching sport + nutrition pour maximiser les résultats",
      sortOrder: 1
    },
    {
      key: "nutrition_cta_title",
      category: "nutrition_extra",
      label: "CTA - Titre",
      type: "text",
      value: "Envie d'essayer ?",
      sortOrder: 2
    },
    // TARIFS PLANS (ALL pricing plan data)
    {
      key: "tarif_plan1_name",
      category: "tarifs_plans",
      label: "Plan 1 - Nom",
      type: "text",
      value: "Découverte",
      sortOrder: 1
    },
    {
      key: "tarif_plan1_price",
      category: "tarifs_plans",
      label: "Plan 1 - Prix",
      type: "text",
      value: "90 CHF",
      sortOrder: 2
    },
    {
      key: "tarif_plan1_unit",
      category: "tarifs_plans",
      label: "Plan 1 - Unité",
      type: "text",
      value: "la séance",
      sortOrder: 3
    },
    {
      key: "tarif_plan1_features",
      category: "tarifs_plans",
      label: "Plan 1 - Caractéristiques",
      type: "textarea",
      value: "Séance de 60 minutes\nBilan initial inclus\nÀ domicile, extérieur ou salle\nSans engagement",
      sortOrder: 4
    },
    {
      key: "tarif_plan1_cta",
      category: "tarifs_plans",
      label: "Plan 1 - CTA",
      type: "text",
      value: "Réserver",
      sortOrder: 5
    },
    {
      key: "tarif_plan2_name",
      category: "tarifs_plans",
      label: "Plan 2 - Nom",
      type: "text",
      value: "Transformation",
      sortOrder: 6
    },
    {
      key: "tarif_plan2_price",
      category: "tarifs_plans",
      label: "Plan 2 - Prix",
      type: "text",
      value: "790 CHF",
      sortOrder: 7
    },
    {
      key: "tarif_plan2_unit",
      category: "tarifs_plans",
      label: "Plan 2 - Unité",
      type: "text",
      value: "pack 10 séances",
      sortOrder: 8
    },
    {
      key: "tarif_plan2_features",
      category: "tarifs_plans",
      label: "Plan 2 - Caractéristiques",
      type: "textarea",
      value: "10 séances de coaching\nBilan nutrition inclus\nPlan d'entraînement personnalisé\nSuivi WhatsApp\nValidité 4 mois",
      sortOrder: 9
    },
    {
      key: "tarif_plan2_cta",
      category: "tarifs_plans",
      label: "Plan 2 - CTA",
      type: "text",
      value: "Choisir ce pack",
      sortOrder: 10
    },
    {
      key: "tarif_plan2_tag",
      category: "tarifs_plans",
      label: "Plan 2 - Tag",
      type: "text",
      value: "Le plus populaire",
      sortOrder: 11
    },
    {
      key: "tarif_plan3_name",
      category: "tarifs_plans",
      label: "Plan 3 - Nom",
      type: "text",
      value: "Sur mesure",
      sortOrder: 12
    },
    {
      key: "tarif_plan3_price",
      category: "tarifs_plans",
      label: "Plan 3 - Prix",
      type: "text",
      value: "Sur devis",
      sortOrder: 13
    },
    {
      key: "tarif_plan3_unit",
      category: "tarifs_plans",
      label: "Plan 3 - Unité",
      type: "text",
      value: "",
      sortOrder: 14
    },
    {
      key: "tarif_plan3_features",
      category: "tarifs_plans",
      label: "Plan 3 - Caractéristiques",
      type: "textarea",
      value: "Format 100% adapté\nCoaching + nutrition\nPrésentiel + en ligne\nAccompagnement longue durée",
      sortOrder: 15
    },
    {
      key: "tarif_plan3_cta",
      category: "tarifs_plans",
      label: "Plan 3 - CTA",
      type: "text",
      value: "Demander un devis",
      sortOrder: 16
    },
    {
      key: "tarif_footer_note",
      category: "tarifs_plans",
      label: "Note de bas de page",
      type: "text",
      value: "Tarifs en francs suisses (CHF). Déplacement dans un rayon de 15 km autour de Poliez-Pittet inclus.",
      sortOrder: 17
    },
    {
      key: "tarif_page_description",
      category: "tarifs_plans",
      label: "Description de la page",
      type: "textarea",
      value: "Première séance découverte offerte. Paiement par virement, TWINT ou facture. Échelonnement possible pour le pack Transformation.",
      sortOrder: 18
    },
    // CONTACT PAGE (contact page specific text)
    {
      key: "contact_page_eyebrow",
      category: "contact_page",
      label: "Eyebrow",
      type: "text",
      value: "Contact",
      sortOrder: 1
    },
    {
      key: "contact_page_title",
      category: "contact_page",
      label: "Titre",
      type: "text",
      value: "Réservons ta première séance",
      sortOrder: 2
    },
    {
      key: "contact_page_description",
      category: "contact_page",
      label: "Description",
      type: "textarea",
      value: "Trois chemins possibles : réserver un créneau, m'envoyer un message, ou planifier un appel découverte offert.",
      sortOrder: 3
    },
    {
      key: "contact_discovery_title",
      category: "contact_page",
      label: "Titre appel découverte",
      type: "text",
      value: "Appel découverte 15 min",
      sortOrder: 4
    },
    {
      key: "contact_discovery_text",
      category: "contact_page",
      label: "Texte appel découverte",
      type: "textarea",
      value: "On fait connaissance, on parle de tes objectifs, on voit si on est faites pour travailler ensemble. Sans engagement.",
      sortOrder: 5
    },
    {
      key: "contact_discovery_cta",
      category: "contact_page",
      label: "CTA appel découverte",
      type: "text",
      value: "Planifier mon appel",
      sortOrder: 6
    },
    {
      key: "contact_hours",
      category: "contact_page",
      label: "Horaires",
      type: "text",
      value: "Lun-Ven 8h-19h · Sam 9h-13h",
      sortOrder: 7
    },
    // FOOTER (footer content)
    {
      key: "footer_tagline",
      category: "footer",
      label: "Tagline",
      type: "text",
      value: "Coach sportive & nutrition à Poliez-Pittet et en ligne. Infirmière Diplômée d'État.",
      sortOrder: 1
    },
    {
      key: "footer_newsletter_text",
      category: "footer",
      label: "Texte newsletter",
      type: "text",
      value: "Reçois mes conseils sport & nutrition.",
      sortOrder: 2
    },
    // SERVICES PAGE (services page specific)
    {
      key: "services_perks_home",
      category: "services_page",
      label: "Avantages - Domicile",
      type: "textarea",
      value: "Aucun déplacement\nMatériel adapté fourni\nHoraires flexibles\nSuivi personnalisé",
      sortOrder: 1
    },
    {
      key: "services_perks_outdoor",
      category: "services_page",
      label: "Avantages - Extérieur",
      type: "textarea",
      value: "Pleine nature\nVariété des environnements\nEffet énergisant\nCardio + renforcement",
      sortOrder: 2
    },
    {
      key: "services_perks_gym",
      category: "services_page",
      label: "Avantages - Salle",
      type: "textarea",
      value: "Accès équipement complet\nEncadrement technique\nProgressivité\nIdéal objectifs muscu",
      sortOrder: 3
    },
    {
      key: "services_perks_online",
      category: "services_page",
      label: "Avantages - En ligne",
      type: "textarea",
      value: "Plan écrit détaillé\nVidéos d'exercices\nSuivi mensuel en visio\nLiberté totale",
      sortOrder: 4
    },
    {
      key: "services_cta_title",
      category: "services_page",
      label: "CTA - Titre",
      type: "text",
      value: "On commence ?",
      sortOrder: 5
    },
    // TEMOIGNAGES PAGE
    {
      key: "temoignages_page_title",
      category: "temoignages_page",
      label: "Titre de la page",
      type: "text",
      value: "Leurs transformations",
      sortOrder: 1
    },
    {
      key: "temoignages_page_description",
      category: "temoignages_page",
      label: "Description",
      type: "text",
      value: "Ils m'ont fait confiance. Voici leurs mots.",
      sortOrder: 2
    },
    // BLOG PAGE
    {
      key: "blog_page_title",
      category: "blog_page",
      label: "Titre de la page",
      type: "text",
      value: "Conseils sport & nutrition",
      sortOrder: 1
    },
    {
      key: "blog_empty_text",
      category: "blog_page",
      label: "Texte si aucun article",
      type: "text",
      value: "Les premiers articles arrivent bientôt. Reviens vite !",
      sortOrder: 2
    },
    // SEO
    {
      key: "seo_home_title",
      category: "seo",
      label: "Homepage - Meta Title",
      type: "text",
      value: "Coach Sportive & Nutrition à Poliez-Pittet",
      sortOrder: 1
    },
    {
      key: "seo_home_description",
      category: "seo",
      label: "Homepage - Meta Description",
      type: "textarea",
      value: "Coaching personnalisé à domicile, en extérieur, en salle et en ligne. Élodie Duhayon, infirmière et coach sportive.",
      sortOrder: 2
    },
    {
      key: "seo_about_title",
      category: "seo",
      label: "À propos - Meta Title",
      type: "text",
      value: "À propos d'Élodie Duhayon",
      sortOrder: 3
    },
    {
      key: "seo_about_description",
      category: "seo",
      label: "À propos - Meta Description",
      type: "textarea",
      value: "Infirmière diplômée d'État, coach sportive et nutritionniste à Poliez-Pittet.",
      sortOrder: 4
    },
    {
      key: "seo_nutrition_title",
      category: "seo",
      label: "Nutrition - Meta Title",
      type: "text",
      value: "Nutrition & Alimentation - Coach Élodie",
      sortOrder: 5
    },
    {
      key: "seo_nutrition_description",
      category: "seo",
      label: "Nutrition - Meta Description",
      type: "textarea",
      value: "Approche durable et personnalisée pour transformer ton rapport à la nourriture.",
      sortOrder: 6
    },
    {
      key: "seo_services_title",
      category: "seo",
      label: "Services - Meta Title",
      type: "text",
      value: "Coaching Sportif & Services",
      sortOrder: 7
    },
    {
      key: "seo_services_description",
      category: "seo",
      label: "Services - Meta Description",
      type: "textarea",
      value: "À domicile, en extérieur, en salle ou en ligne. Trouve le format qui te convient.",
      sortOrder: 8
    }
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, label: setting.label, category: setting.category, type: setting.type, sortOrder: setting.sortOrder },
      create: setting
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
