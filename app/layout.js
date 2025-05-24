import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import UserDisplayName from '../components/UserDisplayName'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Leanail',
  description: 'Diagnostic beauté intelligent et personnalisé pour vos ongles',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#FF69B4' }}>Leanail</div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
              <Link href="/quiz" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Diagnostic</Link>
              <SignedIn>
                <UserDisplayName />
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{ background: '#FFC0CB', color: '#000', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
                    Connexion
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
