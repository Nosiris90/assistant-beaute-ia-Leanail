'use client'

import { useState } from 'react'
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Poppins } from 'next/font/google'
import questions from '../questions'

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

export default function QuizIA() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()

  const [choice, setChoice] = useState(null)
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [imageResult, setImageResult] = useState('')
  const [error, setError] = useState('')

  if (!isLoaded) return <p>Chargement...</p>
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/quiz" />
  if (user && user.emailAddresses[0]?.verification?.status !== 'verified') {
    return <p style={{ textAlign: 'center', color: '#FF69B4', marginTop: 50 }}>🔒 Vérifiez votre email pour accéder au diagnostic.</p>
  }

  const handleAnswer = (value) => {
    const key = questions[step].key
    setAnswers(prev => ({ ...prev, [key]: value }))
    if (step + 1 < questions.length) setStep(step + 1)
    else generateRecommendation({ ...answers, [key]: value })
  }

  const generateRecommendation = async (allAnswers) => {
    setLoading(true)
    setError('')
    const prompt = `Diagnostic Leanail pour ${user.fullName || user.username} (${user.emailAddresses[0]?.emailAddress}):
${questions.map((q, i) => `Q${i + 1}: ${allAnswers[q.key] || 'Non répondu'}`).join('\n')}
Diagnostic personnalisé et recommandations.`

    try {
      const res = await fetch('/api/gpt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, model: 'gpt-4-turbo' }) })
      const { recommendation } = await res.json()
      setResult(recommendation)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du diagnostic')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setImageResult('')
    const file = e.target.file.files[0]
    if (!file) {
      setError("Aucune image sélectionnée")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'leanail_preset')

    try {
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/dzmzsgpus/image/upload`, { method: 'POST', body: formData })
      const cloudData = await cloudRes.json()
      if (cloudData.secure_url) {
        const roboflowRes = await fetch('/api/roboflow-detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: cloudData.secure_url })
        })
        const roboflowData = await roboflowRes.json()
        if (roboflowData.predictions) {
          setImageResult(`Résultat : ${JSON.stringify(roboflowData.predictions[0])}`)
        } else {
          setError('Erreur de détection')
        }
      } else {
        setError('Erreur lors de l’upload Cloudinary')
      }
    } catch (err) {
      console.error(err)
      setError('Erreur lors du diagnostic image')
    } finally {
      setLoading(false)
    }
  }

  const restart = () => {
    setStep(-1)
    setAnswers({})
    setResult('')
    setImageResult('')
    setChoice(null)
    setError('')
  }

  return (
    <div className={poppins.className} style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: 20 }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '1.5rem', fontWeight: 'bold' }}>Leanail</Link>
      </header>

      {!choice && (
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2>Choisissez votre méthode</h2>
          <button onClick={() => setChoice('quiz')} style={{ margin: 10, padding: 10, background: '#FFC0CB', border: 'none', borderRadius: 8 }}>Quiz</button>
          <button onClick={() => setChoice('image')} style={{ margin: 10, padding: 10, background: '#FFC0CB', border: 'none', borderRadius: 8 }}>Détection Image</button>
        </div>
      )}

      {choice === 'quiz' && (
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          {step === -1 && !result && <button onClick={() => setStep(0)} style={{ padding: '10px 20px', background: '#FFC0CB', border: 'none', borderRadius: 8 }}>Démarrer le Quiz</button>}
          {step >= 0 && !result && (
            <>
              <h3>{questions[step].icon} {questions[step].text}</h3>
              {questions[step].options.map(opt => (
                <button key={opt.value} onClick={() => handleAnswer(opt.value)} style={{ display: 'block', margin: '5px auto', padding: 10, background: '#FFC0CB', border: 'none', borderRadius: 6 }}>{opt.label}</button>
              ))}
            </>
          )}
          {loading && <p>Analyse en cours...</p>}
          {result && <div><h4>Résultat</h4><pre>{result}</pre><button onClick={restart} style={{ marginTop: 10 }}>Recommencer</button></div>}
        </div>
      )}

      {choice === 'image' && (
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', background: '#fff5f9', padding: 20, borderRadius: 10 }}>
          <h3>Diagnostic par Image</h3>
          <form onSubmit={handleImageUpload}>
            <input type="file" name="file" accept="image/*" required style={{ margin: '10px 0' }} />
            <button type="submit" style={{ background: '#FFC0CB', border: 'none', padding: 10, borderRadius: 8 }}>Envoyer</button>
          </form>
          {loading && <p>Analyse image en cours...</p>}
          {imageResult && <p>{imageResult}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={restart} style={{ marginTop: 10 }}>Recommencer</button>
        </div>
      )}
    </div>
  )
}
