// app/quiz/page.js
'use client'

import { useState, useEffect } from 'react'

export default function QuizIA() {
  const questions = [
    {
      key: 'general',
      text: "Q1. Comment décririez-vous l’état général de vos ongles ?",
      options: [
        { label: "A) Cassants / dédoublés", value: 'A' },
        { label: "B) Rougeurs / inflammations", value: 'B' },
        { label: "C) Jaunis / ternes", value: 'C' },
        { label: "D) Exposés à l’eau / produits", value: 'D' },
        { label: "E) Pâles / bleutés / taches", value: 'E' },
      ]
    },
    {
      key: 'pain',
      text: "Q2. Ressentez-vous douleurs, démangeaisons ou inflammations autour des ongles ?",
      options: [
        { label: "Oui", value: 'yes' },
        { label: "Non", value: 'no' }
      ]
    },
    {
      key: 'stries',
      text: "Q3. Avez-vous remarqué des stries, décolorations ou déformations ?",
      options: [
        { label: "Oui", value: 'yes' },
        { label: "Non", value: 'no' }
      ]
    },
    {
      key: 'aggressive',
      text: "Q4. Utilisez-vous souvent des produits agressifs (acétone, colle…) ?",
      options: [
        { label: "Oui", value: 'yes' },
        { label: "Non", value: 'no' }
      ]
    },
    {
      key: 'habits',
      text: "Q5. Avez-vous des habitudes (rongement, grattage) ?",
      options: [
        { label: "Oui", value: 'yes' },
        { label: "Non", value: 'no' }
      ]
    },
    {
      key: 'nutrition',
      text: "Q6. Voulez-vous un conseil global santé & nutrition ?",
      options: [
        { label: "Oui", value: 'yes' },
        { label: "Non", value: 'no' }
      ]
    }
  ]

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [now, setNow] = useState(null)

  useEffect(() => {
    setNow(Date.now())
  }, [])

  const handleAnswer = (value) => {
    const key = questions[step].key
    setAnswers(prev => ({ ...prev, [key]: value }))

    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      generateRecommendation({ ...answers, [key]: value })
    }
  }

  const generateRecommendation = async (allAnswers) => {
    const prompt = `
Tu es une experte beauté. Voici les réponses de la cliente :
${questions.map((q, i) => `Q${i + 1}: ${allAnswers[q.key] || 'Non répondu'}`).join('\n')}

En te basant sur ces réponses :
1) Donne un diagnostic de l’état des ongles.
2) Recommande 3 produits Leanail adaptés (nom + description).
3) Donne les conseils d’utilisation précis.
`
    console.log("Prompt envoyé à GPT :", prompt);
    setLoading(true)

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gpt-4-turbo' })
      })

      const { recommendation } = await res.json()
      setResult(recommendation)
    } catch (err) {
      console.error('Erreur API GPT :', err)
      setResult("Une erreur est survenue lors de la génération de la recommandation.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600, margin: 'auto' }}>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        Heure de diagnostic : {now}
      </p>
      {!result ? (
        <>
          <h2 style={{ color: '#FF69B4' }}>{questions[step].text}</h2>
          <div style={{ marginTop: 15 }}>
            {questions[step].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                style={{
                  display: 'block',
                  margin: '10px 0',
                  padding: '10px 15px',
                  borderRadius: 8,
                  border: '1px solid #FF69B4',
                  background: '#fff',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {loading && <p>Analyse en cours…</p>}
        </>
      ) : (
        <div>
          <h2 style={{ color: '#FF1493' }}>Votre recommandation personnalisée</h2>
          <div style={{ whiteSpace: 'pre-wrap', marginTop: 15 }}>{result}</div>
        </div>
      )}
    </div>
  )
}
