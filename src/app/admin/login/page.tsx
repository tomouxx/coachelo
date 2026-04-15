"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false
    });
    setLoading(false);
    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      setError("Identifiants incorrects");
    }
  }

  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-soft">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl text-brand-rose">Élodie Duhayon</div>
          <div className="text-xs text-brand-taupe uppercase tracking-wider mt-1">Administration</div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-brand-taupe mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-divider focus:border-brand-rose focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-brand-taupe mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-divider focus:border-brand-rose focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-brand-rose text-white hover:bg-brand-terracotta transition disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
