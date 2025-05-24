# 🩷 Leanail — Diagnostic Beauté Intelligent (Next.js + Clerk + Vercel)

Ce projet est un assistant beauté intelligent développé avec **Next.js App Router**, **Clerk** pour l'authentification (Google, Facebook, TikTok…), et déployé sur **Vercel**.

---

## 🚀 Lancer le projet en local

```bash
npm install
npm run dev
```

Puis ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## 📦 Fonctionnalités clés

- 🧠 Quiz intelligent avec recommandations IA (GPT-4 Turbo)
- 🔐 Authentification Clerk (email + réseaux sociaux)
- 📧 Envoi d'emails (bientôt via Resend ou SendGrid)
- 🗂️ Enregistrement des données (Google Sheets ou Shopify)

---

## 🔐 Intégration Clerk + Middleware

### ✅ Middleware Clerk (`middleware.js` à la racine) :
```js
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: ["/((?!.*\\..*|_next|sign-in|sign-up|favicon.ico|api/public).*)"],
}
```

### ✅ Variables d'environnement (à définir sur Vercel et en local dans `.env.local`) :
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_FRONTEND_API=clerk.ton-projet.clerk.accounts.dev
```

⚠️ Supprimer tous les `console.log()` dans `middleware.js` pour éviter les erreurs 500 sur Vercel.

---

## 🌐 Déploiement sur Vercel

1. Push sur GitHub
2. Connecte le projet à Vercel
3. Configure les variables d'environnement dans **Project > Settings > Environment Variables** (Production et Preview)
4. Déploie 🚀

---

## ✨ Ressources utiles
- [Documentation Clerk](https://clerk.com/docs)
- [Docs Next.js](https://nextjs.org/docs)
- [Déploiement Next.js sur Vercel](https://nextjs.org/docs/app/building-your-application/deploying)

---

💅 **Leanail** — la beauté intelligente au bout des doigts ✨
