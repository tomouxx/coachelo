export const metadata = { title: "Mentions légales" };

export default function MentionsLegales() {
  return (
    <article className="container-editorial py-20 prose-editorial">
      <h1 className="font-serif text-4xl font-bold mb-8">Mentions légales</h1>

      <h2>Éditeur du site</h2>
      <p>
        Le présent site est édité par <strong>Élodie Duhayon</strong>, coach sportive et nutrition, indépendante.
        <br />Adresse : Poliez-Pittet, Suisse.
        <br />Email : contact@coachelo.ch
        <br />Téléphone : +41 00 000 00 00
      </p>

      <h2>Hébergement</h2>
      <p>
        Ce site est hébergé par <strong>Infomaniak Network SA</strong>, rue Eugène-Marziano 25,
        1227 Les Acacias, Genève, Suisse. Tél. +41 22 820 35 44.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus de ce site (textes, images, logo, graphismes) est la propriété
        exclusive d'Élodie Duhayon. Toute reproduction sans autorisation écrite préalable est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les informations présentées le sont à titre indicatif. Élodie Duhayon ne saurait être tenue
        responsable des éventuelles erreurs, omissions ou des résultats obtenus par l'usage de ces
        informations.
      </p>

      <h2>Droit applicable</h2>
      <p>Le présent site est soumis au droit suisse. Tribunal compétent : Lausanne.</p>
    </article>
  );
}
