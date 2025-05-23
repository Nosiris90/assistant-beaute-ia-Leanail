
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_cHJlY2lzZS1tb29zZS05OC5jbGVyay5hY2NvdW50cy5kZXYk",
    CLERK_SECRET_KEY: "tk_test_F3AKUYapImNZxHI8j1uGUCEk9BfAunVlBaj7v6Ox6t",
    CLERK_FRONTEND_API: "https://precise-moose-98.clerk.accounts.dev"
  }
};

export default nextConfig;

