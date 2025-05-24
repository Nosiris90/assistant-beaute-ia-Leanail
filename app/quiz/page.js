'use client'

import { useState } from 'react'
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function QuizIA() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()

  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

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
        { label: "Mycose / champignons", value: 'mycose' },
        { label: "Ongles verdâtres (infection bactérienne)", value: 'bacterie' },
        { label: "Ongles incarnés", value: 'incarnes' },
        { label: "Décollement de l’ongle", value: 'decollement' },
        { label: "Psoriasis unguéal ou eczéma", value: 'psoriasis' },
        { label: "Ligne de Beau", value: 'beau' },
        { label: "Non", value: 'non_infectieux' }
      ]
    },
    {
      key: 'esthetique',
      text: "Q3. Vos ongles présentent-ils un souci esthétique ?",
      icon: "🎨",
      options: [
        { label: "Jaunis / ternes", value: 'jaunis' },
        { label: "Taches blanches", value: 'blanches' },
        { label: "Coloration inégale", value: 'taches' },
        { label: "Ongles courts / rongés", value: 'ronges' },
        { label: "Déformés (cuillère, bombés…)", value: 'deformes' },
        { label: "Non", value: 'non_esthetique' }
      ]
    },
    {
      key: 'habitudes',
      text: "Q4. Vos habitudes ou votre environnement affectent-ils vos ongles ?",
      icon: "☠️",
      options: [
        { label: "Rongement (onychophagie)", value: 'rongement' },
        { label: "Grattage / arrachement cuticules", value: 'grattage' },
        { label: "Contact excessif avec l’eau/détergents", value: 'eau' },
        { label: "Utilisation excessive d’acétone", value: 'acetone' },
        { label: "Poses fréquentes de faux ongles", value: 'faux_ongles' },
        { label: "Non", value: 'non_habitudes' }
      ]
    },
    {
      key: 'autres',
      text: "Q5. Avez-vous remarqué des signes inhabituels liés à votre santé ?",
      icon: "⚠️",
      options: [
        { label: "Ongles bleutés", value: 'bleutes' },
        { label: "Ongles pâles", value: 'pales' },
        { label: "Stries noires ou taches sombres", value: 'stries_noires' },
        { label: "Non", value: 'non_autres' }
      ]
    }
  ]

  if (!isLoaded) return <p>Chargement...</p>
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/quiz" />
  if (user && user.emailAddresses[0]?.verification?.status !== 'verified') {
    return <p style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>🔒 Veuillez vérifier votre email pour accéder au diagnostic.</p>
  }

  const handleAnswer = (value) => {
    const key = questions[step].key
    setAnswers(prev => ({ ...prev, [key]: value }))
    if (step + 1 < questions.length) setStep(step + 1)
    else generateRecommendation({ ...answers, [key]: value })
  }

  const generateRecommendation = async (allAnswers) => {
    setLoading(true)
    const prompt = `Diagnostic Leanail pour ${user.fullName || user.username} (${user.emailAddresses[0]?.emailAddress}):
${questions.map((q,i)=>`Q${i+1}: ${allAnswers[q.key] || 'Non répondu'}`).join('\n')}
Fournis un diagnostic personnalisé et 3 produits recommandés.`

    try {
      const res = await fetch('/api/gpt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, model: 'gpt-4-turbo' }) })
      const { recommendation } = await res.json()
      setResult(recommendation)
      await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: user.emailAddresses[0]?.emailAddress, subject: 'Diagnostic Leanail', message: recommendation }) })
      await fetch('/api/save-sheet', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userInfo: { name: user.fullName || user.username, email: user.emailAddresses[0]?.emailAddress }, answers: allAnswers, result: recommendation }) })
    } catch (err) {
      console.error(err)
      setResult("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const restart = () => { setStep(-1); setAnswers({}); setResult('') }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', background: '#fff5f9', minHeight: '100vh' }}>
      <Link href="/">🏠 Accueil</Link>
      <h1 style={{ color: '#FF69B4' }}>Diagnostic Leanail</h1>
      {step === -1 && !result && <button onClick={() => setStep(0)} style={{ padding: '12px 24px', background: '#FFC0CB', borderRadius: 8, border: 'none', fontWeight: 'bold' }}>Commencer</button>}
      {step >= 0 && !result && (
        <>
          <h3>{questions[step].icon} {questions[step].text}</h3>
          {questions[step].options.map(opt => (
            <button key={opt.value} onClick={() => handleAnswer(opt.value)} style={{ display: 'block', margin: '10px 0', padding: '10px', background: '#FF69B4', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 'bold' }}>{opt.label}</button>
          ))}
          {loading && <p>Analyse en cours...</p>}
        </>
      )}
      {result && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 10, marginTop: 20 }}>
          <h2 style={{ color: '#FF69B4' }}>Votre diagnostic</h2>
          <pre>{result}</pre>
          <button onClick={restart} style={{ padding: '10px 20px', background: '#FFC0CB', border: 'none', borderRadius: 8, fontWeight: 'bold' }}>Recommencer</button>
        </div>
      )}
    </div>
  )
}
