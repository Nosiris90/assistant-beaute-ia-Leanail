// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

// Active sur toutes les routes sauf assets
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
