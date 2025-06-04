import { authMiddleware } from "@clerk/nextjs";

// Routes publiques autorisées sans authentification
export default authMiddleware({
  publicRoutes: [
    '/',
    '/quiz',
    '/api/gpt',
    '/api/email',
    '/api/roboflow-detect',
  ],
})

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // exclut les fichiers statiques
    '/',                      // page d'accueil
    '/quiz',                  // diagnostic quiz/image
    '/api/:path*',            // APIs publiques autorisées
  ],
}
