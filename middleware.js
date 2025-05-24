// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Protéger toutes les routes sauf les statiques, APIs publiques et routes ouvertes
    "/((?!.*\\..*|_next|favicon.ico|sign-in|sign-up|api/public).*)",
  ],
}
