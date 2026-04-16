import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <div className="text-center max-w-md">
        <Image src="/monogramme.png" alt="Logo" width={64} height={64} className="mx-auto mb-4 opacity-60" />
        <p className="text-8xl font-bold text-rose-300 font-heading">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Page introuvable
        </h1>
        <p className="mt-3 text-gray-600">
          Désolé, la page que tu cherches n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-full font-medium hover:bg-rose-700 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-rose-300 text-rose-700 rounded-full font-medium hover:bg-rose-50 transition-colors"
          >
            Me contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
