// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // Ajout d’une option pour rediriger vers la page de connexion si l'utilisateur non connecté tente d'accéder à des pages protégées
  afterAuth(auth, req, evt) {
    if (!auth.userId && !req.nextUrl.pathname.startsWith('/sign-in')) {
      return Response.redirect(new URL('/sign-in', req.url));
    }
    return Response.next();
  }
});

export const config = {
  // On protège toutes les routes sauf celles listées ci-dessous
  matcher: [
    '/((?!.*\\..*|_next|favicon.ico|sign-in|sign-up|api/public|api/.*|public).*)',
  ],
};
