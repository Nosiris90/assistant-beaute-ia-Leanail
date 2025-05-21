// app/page.js
export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#000000' }}>Bienvenue chez Leanail</h1>
      <p style={{ marginTop: 20, fontSize: '1.2rem', color: '#000000' }}>
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
    </div>
  )
}
