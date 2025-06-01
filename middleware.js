// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // Option : Redirige vers /sign-in si utilisateur non connecté
  afterAuth(auth, req) {
    if (!auth.userId && !req.nextUrl.pathname.startsWith('/sign-in')) {
      return Response.redirect(new URL('/sign-in', req.url));
    }
    return Response.next();
  },
});

export const config = {
  matcher: [
    // Protège toutes les routes sauf celles listées
    '/((?!.*\\..*|_next|favicon.ico|sign-in|sign-up|api/public|api/.*|public).*)',
  ],
};
