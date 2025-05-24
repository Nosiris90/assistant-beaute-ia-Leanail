// app/layout.js
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

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
            <div>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
                {/* Affiche le prénom si l'utilisateur est connecté */}
                <UserDisplayName />
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

// Composant personnalisé pour afficher le prénom
function UserDisplayName() {
  const { user } = useUser()
  return user ? <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>{user.firstName}</span> : null
}
