/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hébergement mutualisé Infomaniak : on limite les ressources utilisées au build
  // pour éviter "OS can't spawn worker thread: Resource temporarily unavailable".
  experimental: {
    cpus: 1,
    workerThreads: false
  },
  // Désactive la génération statique parallèle (évite jest-worker qui sature le nb de threads)
  staticPageGenerationTimeout: 120,
  images: {
    // Infomaniak mutualisé : le proxy /_next/image ne peut pas optimiser
    // les images externes (sharp absent / ressources limitées).
    // On désactive l'optimisation pour que les images s'affichent directement.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" }
    ]
  }
};

export default nextConfig;
