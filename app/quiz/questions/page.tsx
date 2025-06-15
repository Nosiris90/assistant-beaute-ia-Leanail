'use client';

import { useState } from 'react';
import styles from '../quiz.module.css';

const questions = [
  {
    key: 'structurel',
    text: 'Problèmes structurels',
    icon: '🧱',
    options: [
      'Cassants',
      'Dédoublés',
      'Striés',
      'Secs',
      'Fins',
      'Aucun'
    ],
  },
  {
    key: 'infectieux',
    text: 'Problèmes infectieux ou inflammatoires',
    icon: '🦠',
    options: [
      'Mycose',
      'Bactérienne',
      'Rougeurs',
      'Inflammations',
      'Incarnés',
      'Aucun'
    ],
  },
  {
    key: 'esthetique',
    text: 'Problèmes esthétiques',
    icon: '🎨',
    options: [
      'Jaunis',
      'Ternes',
      'Tachés',
      'Déformés',
      'Courts/rongés',
      'Aucun'
    ],
  },
  {
    key: 'environnement',
    text: 'Facteurs environnementaux ou habitudes',
    icon: '🧪',
    options: [
      'Rongement',
      'Grattage',
      'Acétone fréquente',
      'Produits ménagers / eau',
      'Faux ongles',
      'Aucun'
    ],
  },
  {
    key: 'autres',
    text: 'Autres signes ou aspects inhabituels',
    icon: '⚠️',
    options: [
      'Pâles',
      'Bleutés',
      'Taches noires',
      'Stries longitudinales',
      'Aucun'
    ],
  },
];

export default function QuizDiagnosticPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;
  const selectedOptions = answers[currentQuestion.key] || [];

  const toggleOption = (option: string) => {
    setAnswers((prev) => {
      const existing = prev[currentQuestion.key] || [];
      const updated = existing.includes(option)
        ? existing.filter((o) => o !== option)
        : [...existing.filter((o) => o !== 'Aucun'), option];

      if (option === 'Aucun') return { ...prev, [currentQuestion.key]: ['Aucun'] };
      return { ...prev, [currentQuestion.key]: updated.filter((v) => v !== 'Aucun') };
    });
  };

  const next = () => {
    if (selectedOptions.length > 0 && !isLastStep) {
      setStep(step + 1);
    }
  };

  const previous = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const problems = Object.entries(answers).flatMap(([key, values]) =>
      Array.isArray(values)
        ? values.map((value) => `${questions.find((q) => q.key === key)?.text}: ${value}`)
        : []
    );

    const prompt = `Quiz diagnostic Leanail - Analyse IA\n\n${problems.map(p => `- ${p}`).join("\n")}\n\nFournis un diagnostic professionnel et des recommandations beauté personnalisées pour les soins des ongles.`;

    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model: 'gpt-4o' })
    });

    const data = await response.json();
    setResult(data.recommendation || 'Réponse non disponible');
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.quizBox}>
        {!result ? (
          <>
            <h2 className={styles.title}>
              {currentQuestion.icon} {currentQuestion.text}
            </h2>
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={styles.button}
                onClick={() => toggleOption(option)}
                style={{ backgroundColor: selectedOptions.includes(option) ? '#ffb6c1' : undefined }}
              >
                {option}
              </button>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              {step > 0 && (
                <button className={styles.button} onClick={previous}>← Précédent</button>
              )}
              {!isLastStep ? (
                <button
                  className={styles.button}
                  onClick={next}
                  disabled={selectedOptions.length === 0}
                  style={{ opacity: selectedOptions.length > 0 ? 1 : 0.5 }}
                >
                  Suivant →
                </button>
              ) : (
                <button
                  className={styles.button}
                  onClick={handleSubmit}
                  disabled={selectedOptions.length === 0 || loading}
                >
                  {loading ? 'Analyse en cours...' : 'Voir mon diagnostic 💅'}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className={styles.resultBox}>
            <h2 className={styles.title}>🎯 Résultat personnalisé</h2>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
            <button className={styles.button} onClick={() => { setStep(0); setAnswers({}); setResult(null); }}>Recommencer</button>
          </div>
        )}
      </div>
    </div>
  );
}
