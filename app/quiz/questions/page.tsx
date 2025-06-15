// /app/quiz/questions/page.tsx

'use client';

import { useState } from 'react';
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs';
import styles from '../quiz.module.css';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  {
    key: 'structurel',
    text: "Q1. Problèmes structurels ?",
    icon: "🧱",
    options: ["Cassants", "Mous", "Secs", "Dédoublés", "Striés", "Fins", "Non"]
  },
  {
    key: 'infectieux',
    text: "Q2. Problèmes infectieux ?",
    icon: "🦠",
    options: ["Mycose", "Bactérienne", "Incarnés", "Décollement", "Psoriasis", "Ligne de Beau", "Non"]
  },
  {
    key: 'esthetique',
    text: "Q3. Soucis esthétiques ?",
    icon: "🎨",
    options: ["Jaunis", "Taches blanches", "Coloration", "Courts", "Déformés", "Non"]
  },
  {
    key: 'habitudes',
    text: "Q4. Habitudes ?",
    icon: "☠️",
    options: ["Rongement", "Grattage", "Eau", "Acétone", "Faux ongles", "Non"]
  },
  {
    key: 'autres',
    text: "Q5. Signes inhabituels ?",
    icon: "⚠️",
    options: ["Bleutés", "Pâles", "Stries noires", "Non"]
  },
];

export default function QuizQuestionsPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoaded) return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/quiz/questions" />;

  const handleChange = (category: string, option: string) => {
    setAnswers(prev => {
      const currentOptions = prev[category] || [];
      const updated = currentOptions.includes(option)
        ? currentOptions.filter(o => o !== option)
        : [...currentOptions, option];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (data?.result) {
        setResult(data.result);
      } else {
        setResult("❌ Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      setResult("❌ Erreur réseau ou côté client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.quizBox}>
        <h2 className={styles.title}>Quiz Beauté des Ongles</h2>
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <p className={styles.text}>{q.icon} {q.text}</p>
            {q.options.map((option) => (
              <label key={option} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={answers[q.key]?.includes(option) || false}
                  onChange={() => handleChange(q.key, option)}
                />
                {" "} {option}
              </label>
            ))}
          </div>
        ))}
        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading}
          style={{ marginTop: '1rem' }}
        >
          {loading ? 'Analyse en cours...' : 'Analyser mes réponses'}
        </button>
        {result && (
          <div className={styles.resultBox}>
            <h3>🔍 Diagnostic personnalisé :</h3>
            <pre>{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
