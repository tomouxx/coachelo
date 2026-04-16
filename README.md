# Site Élodie Duhayon — Personal Trainer

Site web complet pour **Élodie Duhayon**, coach sportive & nutrition à Poliez-Pittet (Suisse).

**Stack** : Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · MySQL · NextAuth · Nodemailer · TipTap.

---

## 1. Prérequis

- Node.js 18.17+ (20 recommandé)
- npm 9+
- Un accès MySQL (en local ou sur Infomaniak)
- Un accès SMTP (boîte mail Infomaniak)

---

## 2. Installation locale

```bash
# 1. Se placer dans le dossier
cd site-web

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env
# puis éditer .env avec les vraies valeurs

# 4. Créer les tables et les données de base
npx prisma generate
npx prisma migrate dev --name init
npm run seed

# 5. Démarrer en dev
npm run dev
# → http://localhost:3000
# → admin : http://localhost:3000/admin/login
```

**Comptes créés par le seed** :

| Rôle  | Email (défini dans .env)    | Mot de passe          |
|-------|------------------------------|-----------------------|
| OWNER | `ADMIN_EMAIL_ELODIE`         | `ADMIN_PASSWORD_ELODIE` |
| ADMIN | `ADMIN_EMAIL_THOMAS`         | `ADMIN_PASSWORD_THOMAS` |

> Change ces mots de passe **avant** le premier déploiement.

---

## 3. Structure du projet

```
site-web/
├── prisma/
│   ├── schema.prisma        # Modèles BDD (User, Booking, Service, BlogPost…)
│   └── seed.ts              # Comptes + prestations + témoignages + horaires
├── public/
│   ├── logo.png
│   └── monogramme.png
├── src/
│   ├── app/
│   │   ├── (public)/        # Pages publiques du site
│   │   │   ├── page.tsx                 # Accueil
│   │   │   ├── a-propos/                # Portrait + reconversion
│   │   │   ├── services/                # Prestations
│   │   │   ├── nutrition/               # Expertise nutrition
│   │   │   ├── tarifs/                  # Tarifs
│   │   │   ├── temoignages/             # Avis
│   │   │   ├── blog/                    # Blog + [slug]
│   │   │   ├── contact/                 # Réservation + contact
│   │   │   ├── mentions-legales/
│   │   │   ├── confidentialite/
│   │   │   └── cgv/
│   │   ├── admin/           # Back-office
│   │   │   ├── login/
│   │   │   ├── reservations/            # Liste + actions confirmer/annuler
│   │   │   ├── disponibilites/          # Règles hebdo + exceptions
│   │   │   ├── services/                # CRUD prestations
│   │   │   ├── temoignages/             # CRUD avis
│   │   │   ├── blog/                    # CRUD articles avec TipTap
│   │   │   └── parametres/              # Compte + stats
│   │   └── api/             # Routes REST
│   ├── components/          # Header, Footer, BookingForm, Editor…
│   ├── lib/                 # prisma, auth, email, availability, utils
│   └── middleware.ts        # Protection des routes /admin
├── tailwind.config.ts       # Palette rose gold + Playfair/Inter
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## 4. Commandes utiles

```bash
npm run dev               # Dev server (hot reload)
npm run build             # Build production
npm run start             # Serveur production (port 3000)
npm run lint              # ESLint

npm run seed              # (re)injecter les données de base

npx prisma studio         # UI pour inspecter la BDD
npx prisma migrate dev    # Nouvelle migration (dev)
npx prisma migrate deploy # Appliquer les migrations (prod)
npx prisma generate       # Regénérer le client Prisma
```

---

## 5. Déploiement sur Infomaniak

Le site est pensé pour être déployé sur un **Hébergement Web Pro** Infomaniak avec support Node.js + base MySQL.

### 5.1 Préparer l'hébergement

1. **Commander l'hébergement** : Manager Infomaniak → Hébergement Web → *Hébergement Web Pro*.
2. **Associer le domaine** `elodieduhayon.ch` et activer le SSL Let's Encrypt.
3. **Créer une base MySQL** : Manager → Bases de données → Nouvelle base.
   Noter : hôte, nom de base, utilisateur, mot de passe.
4. **Créer une adresse email** : Manager → Mail → Nouvelle adresse `contact@elodieduhayon.ch`.
5. **Activer Node.js** : Manager → Sites → ton site → *Node.js* → activer (version 20 LTS).

### 5.2 Déployer le code

Deux options au choix :

#### Option A : Via Git (recommandé)

Infomaniak supporte le déploiement depuis un dépôt Git :

1. Pousser le projet sur GitHub / GitLab.
2. Manager → Sites → *Déploiement Git* → lier le dépôt et la branche `main`.
3. Configurer les commandes :
   - Install : `npm ci`
   - Build : `npm run build && npx prisma migrate deploy`
   - Start : `npm run start`

#### Option B : Via FTP/SSH

1. Se connecter en SSH à l'hébergement.
2. Cloner ou uploader le dossier `site-web/`.
3. Dans le dossier : `npm ci && npm run build && npx prisma migrate deploy`.
4. Lancer `npm run start` via le manager Node.js d'Infomaniak.

### 5.3 Variables d'environnement

Dans le manager Infomaniak, onglet **Node.js → Variables d'environnement**, recopier **toutes** les variables du `.env.example` (valeurs réelles). Les plus critiques :

- `DATABASE_URL`
- `NEXTAUTH_SECRET` (générer avec `openssl rand -base64 32`)
- `NEXTAUTH_URL` (= `https://www.elodieduhayon.ch`)
- `SMTP_*`
- `ADMIN_EMAILS`

### 5.4 Première initialisation (en SSH)

Une fois déployé, exécuter une seule fois :

```bash
npx prisma migrate deploy   # applique le schéma
npm run seed                # crée les comptes + données
```

Se connecter ensuite sur `https://www.elodieduhayon.ch/admin/login`, puis **changer les mots de passe**.

---

## 6. Envoi d'emails (Nodemailer + Infomaniak)

Les emails de confirmation client, notification admin, rappel et contact sont envoyés via SMTP Infomaniak :

```
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=465
SMTP_SECURE=true
```

Le fichier `src/lib/email.ts` contient les **4 templates HTML** (fond ivoire + accents rose gold) :

1. `bookingConfirmClient` — accusé de réception envoyé au client.
2. `bookingNotifyAdmin` — alerte reçue par Élodie (et Thomas si ajouté dans `ADMIN_EMAILS`).
3. `bookingReminderClient` — rappel J-1 (à brancher sur un cron — voir §8).
4. `contactNotifyAdmin` — nouveau message du formulaire contact.

---

## 7. Analytics (Plausible)

Le site inclut un script Plausible optionnel (respectueux RGPD, sans cookie).

- Créer un compte sur [plausible.io](https://plausible.io/).
- Ajouter le domaine `elodieduhayon.ch`.
- Remplir `PLAUSIBLE_DOMAIN` dans les variables d'environnement.

---

## 8. Améliorations possibles (roadmap)

- [ ] **Rappels J-1 automatiques** : cron Infomaniak qui appelle `/api/cron/reminders`.
- [ ] **Paiement en ligne** : intégrer Stripe ou TWINT (phase 2).
- [ ] **Galerie photos** : connecter à Instagram Graph API (`INSTAGRAM_ACCESS_TOKEN`).
- [ ] **Avis Google** : afficher les reviews via Google Places API.
- [ ] **Version anglaise** : next-intl déjà compatible.
- [ ] **Newsletter avancée** : brancher sur Brevo (clés `BREVO_*` déjà prévues).

---

## 9. Conformité LPD / RGPD

- Hébergement 100% suisse (Infomaniak, datacenters en Suisse).
- Pas de cookie publicitaire (bannière uniquement pour fonctionnel + analytics).
- Page `/confidentialite` conforme à la nouvelle LPD (septembre 2023) + RGPD.
- Page `/mentions-legales` + `/cgv` présentes.
- Données clients conservées 10 ans (obligation comptable).
- Droit d'accès / rectification / effacement par email.

---

## 10. Support technique

Pour toute question technique, Thomas (co-admin) reste le contact privilégié.

Bon vent Élodie ! 🌸
