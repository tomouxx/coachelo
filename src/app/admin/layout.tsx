import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export const metadata = { title: "Admin — Élodie Duhayon" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Si pas de session, on affiche le children tel quel (page login)
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-brand-ivory">
      <Sidebar userName={session.user.name ?? session.user.email ?? ""} />
      <main className="flex-1 p-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
