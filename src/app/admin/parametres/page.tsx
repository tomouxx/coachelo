import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Parametres() {
  const session = await getServerSession(authOptions);
  const [subscribersCount, contactsCount, users] = await Promise.all([
    prisma.newsletterSubscriber.count({ where: { unsubscribed: false } }),
    prisma.contactMessage.count(),
    prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } })
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-brand-dark mb-2">Paramètres</h1>
      <p className="text-brand-taupe mb-8">Informations techniques et utilisatrices du site.</p>

      <section className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h2 className="font-serif text-xl mb-4">Ton compte</h2>
        <dl className="text-sm space-y-2">
          <div className="flex">
            <dt className="w-32 text-brand-taupe">Nom</dt>
            <dd>{session?.user?.name}</dd>
          </div>
          <div className="flex">
            <dt className="w-32 text-brand-taupe">Email</dt>
            <dd>{session?.user?.email}</dd>
          </div>
          <div className="flex">
            <dt className="w-32 text-brand-taupe">Rôle</dt>
            <dd>{(session?.user as any)?.role}</dd>
          </div>
        </dl>
      </section>

      <section className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h2 className="font-serif text-xl mb-4">Utilisatrices autorisées</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-brand-taupe border-b border-brand-divider">
            <tr>
              <th className="py-2">Nom</th>
              <th>Email</th>
              <th>Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-brand-divider/50">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="text-xs bg-brand-nude px-2 py-1 rounded-full">{u.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-brand-taupe mt-4">
          Pour ajouter ou modifier un compte, passe par le script <code>npm run seed</code>
          ou utilise Prisma Studio (<code>npx prisma studio</code>).
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="font-serif text-xl mb-4">Statistiques générales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-nude/30 rounded-lg p-4">
            <div className="text-3xl font-serif text-brand-rose">{subscribersCount}</div>
            <div className="text-xs text-brand-taupe">Abonnées newsletter</div>
          </div>
          <div className="bg-brand-nude/30 rounded-lg p-4">
            <div className="text-3xl font-serif text-brand-rose">{contactsCount}</div>
            <div className="text-xs text-brand-taupe">Messages de contact</div>
          </div>
        </div>
      </section>
    </div>
  );
}
