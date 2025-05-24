'use client'

import Link from 'next/link'
import UserDisplayName from '../components/UserDisplayName'

export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '100vh', color: '#000' }}>
      <main style={{ padding: 40 }}>
        <h1 style={{ fontSize: '2.5rem', color: '#000' }}>Bienvenue chez Leanail</h1>
        <p><UserDisplayName /></p>
        <p style={{ marginTop: 20, fontSize: '1.2rem' }}>
          Découvrez notre assistant beauté IA pour un diagnostic personnalisé de vos ongles.
        </p>
        <Link
          href="/quiz"
          style={{
            display: 'inline-block',
            marginTop: 30,
            padding: '12px 24px',
            backgroundColor: '#FFC0CB',
            color: '#000000',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 'bold'
          }}
        >
          Lancer le diagnostic
        </Link>
      </main>
    </div>
  )
}





