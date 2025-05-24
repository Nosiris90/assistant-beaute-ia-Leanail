/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Si tu n’utilises pas serverActions, supprime ou laisse sans experimental
  // experimental: {
  //   serverActions: { enabled: true },  // Optionnel selon ton besoin
  // },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
}

export default nextConfig
