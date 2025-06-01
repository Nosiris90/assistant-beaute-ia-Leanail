'use client'

import { useState } from 'react'
import { useUser, useAuth, RedirectToSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Lato } from 'next/font/google'

const lato = Lato({ subsets: ['latin'], weight: '400' })

export default function QuizIA() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [showChoice, setShowChoice] = useState(true)

  const questions = [
    { key: 'structurel', text: "Q1. Problèmes structurels ?", icon: "🧱", options: [ { label: "Cassants", value: 'cassants' }, { label: "Mous", value: 'mous' }, { label: "Secs", value: 'secs' }, { label: "Dédoublés", value: 'dedoubles' }, { label: "Striés", value: 'stries' }, { label: "Fins", value: 'fins' }, { label: "Non", value: 'non_structurel' } ] },
    { key: 'infectieux', text: "Q2. Problèmes infectieux ?", icon: "🦠", options: [ { label: "Mycose", value: 'mycose' }, { label: "Bactérienne", value: 'bacterie' }, { label: "Incarnés", value: 'incarnes' }, { label: "Décollement", value: 'decollement' }, { label: "Psoriasis", value: 'psoriasis' }, { label: "Ligne de Beau", value: 'beau' }, { label: "Non", value: 'non_infectieux' } ] },
    { key: 'esthetique', text: "Q3. Soucis esthétiques ?", icon: "🎨", options: [ { label: "Jaunis", value: 'jaunis' }, { label: "Taches blanches", value: 'blanches' }, { label: "Coloration", value: 'taches' }, { label: "Courts", value: 'courts' }, { label: "Déformés", value: 'deformes' }, { label: "Non", value: 'non_esthetique' } ] },
    { key: 'habitudes', text: "Q4. Habitudes nocives ?", icon: "☠️", options: [ { label: "Rongement", value: 'rongement' }, { label: "Grattage", value: 'grattage' }, { label: "Eau", value: 'eau' }, { label: "Acétone", value: 'acetone' }, { label: "Faux ongles", value: 'faux_ongles' }, { label: "Non", value: 'non_habitudes' } ] },
    { key: 'autres', text: "Q5. Autres signes ?", icon: "⚠️", options: [ { label: "Bleutés", value: 'bleutes' }, { label: "Pâles", value: 'pales' }, { label: "Stries noires", value: 'stries_noires' }, { label: "Non", value: 'non_autres' } ] },
  ]

  if (!isLoaded) return <p>Chargement...</p>
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/quiz" />
  if (user?.emailAddresses[0]?.verification?.status !== 'verified') {
    return <p style={{ textAlign: 'center', color: '#FF69B4' }}>🔒 Vérifiez votre email pour accéder au diagnostic.</p>
  }

  const handleAnswer = (val) => {
    const key = questions[step].key
    setAnswers(prev => ({ ...prev, [key]: val }))
    if (step + 1 < questions.length) setStep(step + 1)
    else generateResult({ ...answers, [key]: val })
  }

  const generateResult = async (data) => {
    setLoading(true)
    const prompt = `Diagnostic pour ${user.fullName}: ${JSON.stringify(data)}`
    try {
      const res = await fetch('/api/gpt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })
      const { recommendation } = await res.json()
      setResult(recommendation || "Aucune recommandation générée.")
    } catch (err) {
      setResult("Erreur lors du diagnostic.")
    } finally {
      setLoading(false)
    }
  }

  const restart = () => { setStep(-1); setAnswers({}); setResult(''); setShowChoice(true) }

  return (
    <div className={lato.className} style={{ background: '#fff', color: '#000', minHeight: '100vh', padding: '1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Link href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>🌸 Leanail 🌸</Link>
      </header>

      {showChoice && (
        <div style={{ textAlign: 'center' }}>
          <h2>Choisissez votre méthode</h2>
          <button onClick={() => setShowChoice(false)} style={btnStyle}>📋 Quiz</button>
          <form action="/api/roboflow-detect" method="POST" encType="multipart/form-data" style={{ marginTop: 10 }}>
            <input type="file" name="file" required style={{ marginBottom: 8 }} />
            <button type="submit" style={btnStyle}>📸 Détection Image</button>
          </form>
        </div>
      )}

      {!showChoice && (
        <main style={{ maxWidth: 500, margin: '0 auto' }}>
          {step === -1 && !result && <button onClick={() => setStep(0)} style={btnStyle}>Démarrer le Quiz</button>}
          {step >= 0 && !result && (
            <>
              <h3>{questions[step].icon} {questions[step].text}</h3>
              {questions[step].options.map(opt => (
                <button key={opt.value} onClick={() => handleAnswer(opt.value)} style={btnStyle}>{opt.label}</button>
              ))}
              {loading && <p>Analyse en cours...</p>}
            </>
          )}
          {result && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <h3 style={{ color: '#FF69B4' }}>🌸 Résultat 🌸</h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'left', background: '#fff5f9', padding: '1rem', borderRadius: 8 }}>{result}</pre>
              <button onClick={restart} style={btnStyle}>Recommencer</button>
            </div>
          )}
        </main>
      )}
    </div>
  )
}

const btnStyle = {
  display: 'block',
  width: '100%',
  padding: '12px 20px',
  margin: '10px 0',
  background: '#FFC0CB',
  border: 'none',
  borderRadius: '8px',
  color: '#000',
  fontWeight: 'bold',
  cursor: 'pointer'
}
