// app/page.js
'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '100vh', color: '#000' }}>
      {/* HEADER NAVIGATION STICKY */}
      <header style={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 1000, padding: '20px 0', borderBottom: '1px solid #eaeaea' }}>
        <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#FF69B4' }}>Leanail</div>
          <Link href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
          <Link href="/quiz" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Diagnostic</Link>
        </nav>
      </header>

      <main style={{ padding: 40 }}>
        <h1 style={{ fontSize: '2.5rem', color: '#000' }}>Bienvenue chez Leanail</h1>
        <p style={{ marginTop: 20, fontSize: '1.2rem' }}>
          Découvrez notre assistant beauté IA pour un diagnostic personnalisé de vos ongles.
        </p>
        <a
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
        </a>
      </main>
    </div>
  )
}
