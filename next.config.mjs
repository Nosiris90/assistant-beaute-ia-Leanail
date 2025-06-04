/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ne pas exposer les variables sensibles côté client
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
