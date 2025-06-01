'use client'

import { useState } from 'react'
import { useUser, useAuth, RedirectToSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Lato } from 'next/font/google'
import questions from '../questions' // ✅ Import corrigé

const lato = Lato({ subsets: ['latin'], weight: '400' })

export default function QuizPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()

  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isLoaded) return <p>Chargement...</p>
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/quiz" />
  if (user && user.emailAddresses[0]?.verification?.status !== 'verified') {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', padding: 20 }}>
        <p style={{ fontSize: '1.2rem', color: '#FF69B4' }}>🔒 Veuillez vérifier votre adresse email pour accéder au diagnostic.</p>
      </div>
    )
  }

  const handleAnswer = (value) => {
    const key = questions[step].key
    setAnswers(prev => ({ ...prev, [key]: value }))
    if (step + 1 < questions.length) setStep(step + 1)
    else generateRecommendation({ ...answers, [key]: value })
  }

  const generateRecommendation = async (allAnswers) => {
    setLoading(true)
    try {
      const prompt = `Diagnostic Leanail pour ${user.fullName || user.username} (${user.emailAddresses[0]?.emailAddress}):
${questions.map((q,i)=>`Q${i+1}: ${allAnswers[q.key] || 'Non répondu'}`).join('\n')}
Fournis un diagnostic personnalisé et 3 recommandations.`

      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gpt-4-turbo' })
      })
      const { recommendation } = await res.json()
      setResult(recommendation)
    } catch (err) {
      console.error(err)
      setResult("Erreur lors de la génération.")
    } finally {
      setLoading(false)
    }
  }

  const restart = () => { setStep(-1); setAnswers({}); setResult('') }

  return (
    <div className={lato.className} style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', padding: 20 }}>
      <header style={{ textAlign: 'center', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
        <Link href="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.5rem', color: '#FF69B4' }}>Leanail</Link>
      </header>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 20 }}>
        {!result && step === -1 && (
          <button onClick={() => setStep(0)} style={{ padding: '12px 24px', background: '#FFC0CB', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>Commencer le diagnostic</button>
        )}
        {!result && step >= 0 && (
          <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
            <h2>{questions[step].icon} {questions[step].text}</h2>
            {questions[step].options.map(opt => (
              <button key={opt.value} onClick={() => handleAnswer(opt.value)} style={{ display: 'block', width: '100%', margin: '5px 0', padding: '10px', background: '#FFC0CB', border: 'none', borderRadius: '6px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>{opt.label}</button>
            ))}
            {loading && <p>Analyse en cours...</p>}
          </div>
        )}
        {result && (
          <div style={{ maxWidth: 600, width: '100%', textAlign: 'center', marginTop: 20 }}>
            <h2>Votre recommandation personnalisée</h2>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#fff5f9', padding: 20, borderRadius: 8 }}>{result}</pre>
            <button onClick={restart} style={{ padding: '10px 20px', background: '#FFC0CB', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', marginTop: 20 }}>Recommencer</button>
          </div>
        )}
      </main>
    </div>
  )
}
