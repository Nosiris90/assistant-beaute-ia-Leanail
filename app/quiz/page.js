// app/quiz/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function QuizIA() {
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
        { label: "Non", value: 'non_structurel' },
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
        { label: "Ligne de Beau ou anomalie transversale", value: 'beau' },
        { label: "Non", value: 'non_infectieux' },
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
        { label: "Ongles trop courts ou rongés", value: 'ronges' },
        { label: "Déformés (cuillère, bombés…)", value: 'deformes' },
        { label: "Non", value: 'non_esthetique' },
      ]
    },
    {
      key: 'habitudes',
      text: "Q4. Vos habitudes ou votre environnement affectent-ils vos ongles ?",
      icon: "☠️",
      options: [
        { label: "Je ronge mes ongles (onychophagie)", value: 'rongement' },
        { label: "Je gratte / arrache mes cuticules", value: 'grattage' },
        { label: "Je suis souvent en contact avec l’eau ou des produits détergents", value: 'eau' },
        { label: "J’utilise beaucoup d’acétone ou produits abrasifs", value: 'acetone' },
        { label: "Je fais souvent des poses de faux ongles", value: 'faux_ongles' },
        { label: "Non", value: 'non_habitudes' },
      ]
    },
    {
      key: 'autres',
      text: "Q5. Avez-vous remarqué des signes inhabituels liés à votre santé ?",
      icon: "⚠️",
      options: [
        { label: "Ongles bleutés", value: 'bleutes' },
        { label: "Ongles très pâles", value: 'pales' },
        { label: "Présence de stries noires ou taches sombres", value: 'stries_noires' },
        { label: "Non", value: 'non_autres' },
      ]
    }
  ]

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

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
      setResult("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const restartQuiz = () => {
    setStep(0)
    setAnswers({})
    setResult('')
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', color: '#000' }}>
      <header style={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 1000, padding: '20px 0', borderBottom: '1px solid #eaeaea' }}>
        <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#FF69B4' }}>Leanail</div>
          <Link href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
          <Link href="/quiz" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Diagnostic</Link>
        </nav>
      </header>

      <main style={{ padding: 40 }}>
        {!result ? (
          <>
            <h2 style={{ color: '#000', fontSize: '1.8rem', marginBottom: 20 }}>
              <span>{questions[step].icon}</span> {questions[step].text}
            </h2>
            <div style={{ marginTop: 10 }}>
              {questions[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  style={{
                    display: 'block',
                    margin: '10px auto',
                    padding: '12px 20px',
                    borderRadius: 8,
                    border: '1px solid #FFC0CB',
                    background: '#FFC0CB',
                    color: '#000',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: 500,
                    fontSize: '1rem'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {loading && <p style={{ marginTop: 20 }}>Analyse en cours…</p>}
          </>
        ) : (
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <h2 style={{ color: '#000000', fontSize: '1.8rem' }}>Votre recommandation personnalisée</h2>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>{result}</div>
            <button
              onClick={restartQuiz}
              style={{
                marginTop: 30,
                padding: '10px 24px',
                backgroundColor: '#FFC0CB',
                color: '#000',
                border: '1px solid #FFC0CB',
                borderRadius: 8,
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Recommencer le diagnostic
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
