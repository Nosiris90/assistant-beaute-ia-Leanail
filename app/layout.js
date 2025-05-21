// app/layout.js
export const metadata = {
  title: 'Leanail',
  description: 'Diagnostic Beauté Des Ongles Leanail avec notre Coach Lea',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
