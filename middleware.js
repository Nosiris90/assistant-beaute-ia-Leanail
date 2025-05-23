// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server'

console.log("✅ Middleware Clerk exécuté")

export default clerkMiddleware()

export const config = {
  matcher: [
    // Applique Clerk à toutes les pages sauf :
    // fichiers statiques, sign-in, sign-up, APIs publiques, favicon
    "/((?!.*\\..*|_next|sign-in|sign-up|api/public|favicon.ico).*)",
  ],
}
