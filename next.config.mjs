/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: false, // Ajoute cette ligne si tu rencontres un warning Next.js
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'https://api.clerk.com/:path*',
    },
  ],
  env: {
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
}

export default nextConfig
