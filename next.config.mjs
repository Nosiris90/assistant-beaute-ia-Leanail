/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pas de `env:` ici, pour ne rien exposer côté client
  // Les variables seront accessibles via `process.env` côté serveur uniquement
};

export default nextConfig;