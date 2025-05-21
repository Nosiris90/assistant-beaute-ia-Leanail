// app/layout.js
import './globals.css'

export const metadata = {
  title: 'Leanail - Assistant Beauté IA',
  description: 'Diagnostic intelligent et recommandations personnalisées pour vos ongles avec Leanail.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
