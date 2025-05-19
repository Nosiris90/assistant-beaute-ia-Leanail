// app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffe6f0, #fce4ec)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', color: '#b4005a' }}>Bienvenue chez Leanail</h1>
      <p style={{ maxWidth: '500px', marginTop: '1rem', fontSize: '1.2rem' }}>
        Découvrez notre assistant beauté intelligent qui vous recommande les meilleurs soins et vernis selon votre profil.
      </p>
      <Link href="/quiz">
        <button style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          backgroundColor: '#b4005a',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          Lancer mon diagnostic
        </button>
      </Link>
    </main>
  );
}