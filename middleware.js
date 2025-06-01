import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  afterAuth(auth, req) {
    if (!auth.userId && !req.nextUrl.pathname.startsWith('/sign-in')) {
      return Response.redirect(new URL('/sign-in', req.url));
    }
    return Response.next();
  },
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next|favicon.ico|sign-in|sign-up|api/public|api/.*|public).*)',
  ],
};
