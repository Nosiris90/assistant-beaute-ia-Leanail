// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  afterAuth(auth, req) {
    const { pathname } = req.nextUrl;

    // Rediriger vers /sign-in si non authentifié
    if (!auth.userId && !pathname.startsWith('/sign-in') && !pathname.startsWith('/api')) {
      const signInUrl = new URL('/sign-in', req.url);
      return Response.redirect(signInUrl);
    }

    return Response.next();
  },
});

export const config = {
  matcher: [
    // Protéger toutes les routes sauf les fichiers statiques, api publics, auth et sign-up/in
    '/((?!.*\\..*|_next|favicon.ico|sign-in|sign-up|api/public|api/(gpt|roboflow-detect|save-sheet|email)).*)',
  ],
};
