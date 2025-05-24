/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  // Supprime experimental.serverActions si non utilisé, sinon garde cette section pour l’activer
  // experimental: {
  //   serverActions: { enabled: true },
  // },
}

export default nextConfig
