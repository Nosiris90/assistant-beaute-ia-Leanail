'use client'

import { useState } from 'react'
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

export default function QuizIA() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()

  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [imageResult, setImageResult] = useState(null)

  const questions = [
    {
      key: 'structurel',
      text: "Q1. Rencontrez-vous des problèmes structurels ou de fragilité des ongles ?",
      icon: "🧱",
      options: [
        { label: "Cassants", value: 'cassants' },
        { label: "Mous / flexibles", value: 'mous' },
        { label: "Secs / déshydratés", value: 'secs' },
        { label: "Dédoublés", value: 'dedoubles' },
        { label: "Striés verticalement", value: 'stries' },
        { label: "Ongles fins / qui poussent lentement", value: 'fins' },
        { label: "Non", value: 'non_structurel' }
      ]
    },
    {
      key: 'infectieux',
      text: "Q2. Avez-vous remarqué un problème de type infectieux ou pathologique ?",
      icon: "🦠",
      options: [
        { label: "Mycose", value: 'mycose' },
        { label: "Bactérienne", value: 'bacterie' },
        { label: "Incarnés", value: 'incarnes' },
        { label: "Décollement", value: 'decollement' },
        { label: "Psoriasis", value: 'psoriasis' },
        { label: "Ligne de Beau", value: 'beau' },
        { label: "Non", value: 'non_infectieux' }
      ]
    },
    {
      key: 'esthetique',
      text: "Q3. Vos ongles présentent-ils un souci esthétique ?",
      icon: "🎨",
      options: [
        { label: "Jaunis", value: 'jaunis' },
        { label: "Taches blanches", value: 'blanches' },
        { label: "Coloration", value: 'taches' },
        { label: "Courts / rongés", value: 'ronges' },
        { label: "Déformés", value: 'deformes' },
        { label: "Non", value: 'non_esthetique' }
      ]
    },
    {
      key: 'habitudes',
      text: "Q4. Vos habitudes ou votre environnement affectent-ils vos ongles ?",
      icon: "☠️",
      options: [
        { label: "Rongement", value: 'rongement' },
        { label: "Grattage", value: 'grattage' },
        { label: "Contact eau/détergents", value: 'eau' },
        { label: "Acétone", value: 'acetone' },
        { label: "Faux ongles", value: 'faux_ongles' },
        { label: "Non", value: 'non_habitudes' }
      ]
    },
    {
      key: 'autres',
      text: "Q5. Avez-vous remarqué des signes inhabituels ?",
      icon: "⚠️",
      options: [
        { label: "Bleutés", value: 'bleutes' },
        { label: "Pâles", value: 'pales' },
        { label: "Stries noires", value: 'stries_noires' },
        { label: "Non", value: 'non_autres' }
      ]
    }
  ]

  if (!isLoaded) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Chargement...</p>
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/quiz" />
  if (user && user.emailAddresses[0]?.verification?.status !== 'verified') {
    return <p style={{ textAlign: 'center', marginTop: '50px', color: '#FF69B4' }}>🔒 Veuillez vérifier votre email pour accéder au diagnostic.</p>
  }

  const handleAnswer = (value) => {
    const key = questions[step].key
    setAnswers(prev => ({ ...prev, [key]: value }))
    if (step + 1 < questions.length) setStep(step + 1)
    else generateRecommendation({ ...answers, [key]: value })
  }

  const generateRecommendation = async (allAnswers) => {
    setLoading(true)
    const prompt = `Diagnostic Leanail pour ${user.fullName || user.username} (${user.emailAddresses[0]?.emailAddress}):\n${questions.map((q,i)=>`Q${i+1}: ${allAnswers[q.key] || 'Non répondu'}`).join('\n')}\nDiagnostic personnalisé et recommandations.`
    try {
      const res = await fetch('/api/gpt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, model: 'gpt-4-turbo' }) })
      const { recommendation } = await res.json()
      setResult(recommendation)
    } catch (err) {
      console.error(err)
      setResult("Erreur lors de la génération")
    } finally {
      setLoading(false)
    }
  }

  const restart = () => { setStep(-1); setAnswers({}); setResult(''); setImageResult(null) }

  const handleImageSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    try {
      const res = await fetch('/api/roboflow-detect', { method: 'POST', body: formData })
      const data = await res.json()
      setImageResult(data)
    } catch (err) {
      console.error(err)
      setImageResult({ error: 'Erreur lors de la détection' })
    }
  }

  return (
    <div className={poppins.className} style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #eee', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#000', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>Leanail</Link>
      </header>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ maxWidth: 500, width: '100%', background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 0 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h1 style={{ marginBottom: 20 }}>Diagnostic Leanail</h1>

          {/* 📸 Diagnostic par Image */}
          <div style={{ marginBottom: 30 }}>
            <h2 style={{ color: '#FF69B4', fontSize: '1.2rem', marginBottom: 10 }}>📸 Analyse Image</h2>
            <form onSubmit={handleImageSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="file" name="file" accept="image/*" required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ backgroundColor: '#FFC0CB', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>📤 Envoyer</button>
            </form>
            {imageResult && (
              <div style={{ marginTop: 10, textAlign: 'left' }}>
                <h4>Résultat Image :</h4>
                <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 6 }}>{JSON.stringify(imageResult, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* 📝 Quiz IA */}
          {step === -1 && !result && <button onClick={() => setStep(0)} style={{ background: '#FFC0CB', padding: '12px 24px', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>Lancer le Quiz</button>}
          {step >= 0 && !result && (
            <>
              <h3>{questions[step].icon} {questions[step].text}</h3>
              {questions[step].options.map(opt => (
                <button key={opt.value} onClick={() => handleAnswer(opt.value)} style={{ display: 'block', width: '100%', margin: '5px 0', padding: '10px', background: '#FFC0CB', border: 'none', borderRadius: '6px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>{opt.label}</button>
              ))}
              {loading && <p>Analyse en cours...</p>}
            </>
          )}
          {result && (
            <div>
              <h2>Résultat Quiz</h2>
              <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 10, borderRadius: 6 }}>{result}</pre>
              <button onClick={restart} style={{ marginTop: 20, background: '#FFC0CB', padding: '12px 24px', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>Recommencer</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
