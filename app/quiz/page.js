// app/quiz/page.js
'use client'

import { useState } from 'react'

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

  const handleAnswer = (value) => {
    const key = questions[step].key
    setAnswers({ ...answers, [key]: value })
    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      // dernier step -> appeler l'API OpenAI
      generateRecommendation({ ...answers, [key]: value })
    }
  }

  const generateRecommendation = async (allAnswers) => {
    setLoading(true)
    const prompt = `
Tu es une experte beauté. Voici les réponses de la cliente :
${questions.map((q,i) => `Q${i+1} (${q.key}): ${allAnswers[q.key]}`).join('\n')}

En te basant sur ces réponses, donne :
1) Un diagnostic synthétique de l’état des ongles.
2) Une liste de 3 produits Leanail recommandés (nom + brève description).
3) Des conseils d’utilisation précis.
`
    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gpt-4-turbo' })
      })
      const { recommendation } = await res.json()
      setResult(recommendation)
    } catch (e) {
      setResult("Une erreur est survenue, merci de réessayer plus tard.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600, margin: 'auto' }}>
      {!result ? (
        <>
          <h2 style={{ color: '#FFC0CB' }}>{questions[step].text}</h2>
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
