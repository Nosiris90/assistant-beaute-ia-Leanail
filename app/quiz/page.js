// ==============================
// ✅ /app/quiz/page.js
// ==============================

'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import questions from '../questions'
import styles from './quiz.module.css'

export default function QuizPage() {
  const { user } = useUser()
  const [step, setStep] = useState('choice')
  const [answers, setAnswers] = useState([])
  const [imageUrl, setImageUrl] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleQuizSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    })
    const data = await res.json()
    setResult(data.result)
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

    setLoading(true)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    setImageUrl(data.secure_url)

    const diagnosis = await fetch('/api/roboflow-detect', {
      method: 'POST',
      body: JSON.stringify({ imageUrl: data.secure_url }),
    })
    const diagResult = await diagnosis.json()
    setResult(JSON.stringify(diagResult.result, null, 2))
    setLoading(false)
  }

  return (
    <main className={styles.container}>
      {step === 'choice' && (
        <div className={styles.choiceBox}>
          <h2>Choisissez votre méthode de diagnostic</h2>
          <button onClick={() => setStep('quiz')}>Faire le quiz</button>
          <button onClick={() => setStep('image')}>Analyser une photo</button>
        </div>
      )}

      {step === 'quiz' && (
        <div className={styles.quizBox}>
          {questions.map((q, index) => (
            <div key={index} className={styles.question}>
              <p>{q.label}</p>
              <select
                onChange={(e) => {
                  const newAnswers = [...answers]
                  newAnswers[index] = { question: q.label, answer: e.target.value }
                  setAnswers(newAnswers)
                }}>
                <option value="">-- Choisir --</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
          <button onClick={handleQuizSubmit} disabled={loading}>Valider</button>
        </div>
      )}

      {step === 'image' && (
        <div className={styles.uploadBox}>
          <p>Upload votre photo pour analyse</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imageUrl && <Image src={imageUrl} alt="Upload" width={200} height={200} />}
        </div>
      )}

      {loading && <p>Analyse en cours...</p>}
      {result && (
        <div className={styles.resultBox}>
          <h3>Résultat du diagnostic :</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{result}</p>
        </div>
      )}
    </main>
  )
}
