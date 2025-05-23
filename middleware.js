// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    /*
     * Applique Clerk à toutes les pages sauf :
     * - fichiers statiques
     * - APIs publiques
     * - page racine
    */
    "/((?!.*\\..*|_next|sign-in|sign-up|api/public|favicon.ico|$).*)",
  ],
}
