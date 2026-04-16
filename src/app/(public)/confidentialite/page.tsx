export const metadata = { title: "Politique de confidentialité" };

export default function Confidentialite() {
  return (
    <article className="container-editorial py-20 prose-editorial">
      <h1 className="font-serif text-4xl font-bold mb-8">Politique de confidentialité</h1>
      <p className="text-sm text-brand-taupe">Conforme à la LPD suisse (nouvelle LPD 2023) et au RGPD.</p>

      <h2>1. Responsable du traitement</h2>
      <p>
        <strong>Élodie Duhayon</strong>, Poliez-Pittet, Suisse — contact@coachelo.ch
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons uniquement les données strictement nécessaires à la fourniture de nos services :</p>
      <ul>
        <li>Identité : prénom, nom</li>
        <li>Contact : email, téléphone</li>
        <li>Réservation : date, heure, prestation choisie, objectif, message</li>
        <li>Newsletter (optionnel) : email</li>
      </ul>

      <h2>3. Finalités</h2>
      <ul>
        <li>Gérer les réservations et les séances de coaching</li>
        <li>Communiquer par email ou téléphone</li>
        <li>Envoyer la newsletter (si inscription)</li>
        <li>Respecter nos obligations légales et comptables</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Consentement explicite (inscription, newsletter) ou exécution contractuelle (prestation coaching).
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>Données clients : 10 ans (obligation comptable)</li>
        <li>Données de contact sans suite : 3 ans</li>
        <li>Newsletter : jusqu'à désinscription</li>
      </ul>

      <h2>6. Destinataires</h2>
      <p>
        Les données sont traitées par Élodie Duhayon uniquement. Elles sont hébergées chez Infomaniak
        (Suisse) et ne sont jamais partagées ni vendues à des tiers.
      </p>

      <h2>7. Analytics</h2>
      <p>
        Nous utilisons <strong>Plausible Analytics</strong>, un outil respectueux de la vie privée qui
        ne dépose aucun cookie de suivi et n'utilise aucune donnée personnelle identifiable.
      </p>

      <h2>8. Tes droits</h2>
      <p>
        Conformément à la LPD et au RGPD, tu disposes d'un droit d'accès, de rectification,
        d'effacement, de limitation et de portabilité. Tu peux exercer ces droits par email à
        contact@coachelo.ch.
      </p>

      <h2>9. Sécurité</h2>
      <p>
        Les données sont stockées sur un serveur Infomaniak en Suisse, protégées par un accès
        authentifié et chiffré.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question relative à cette politique, écris-moi à contact@coachelo.ch.
      </p>
    </article>
  );
}
