'use client';
import { useState } from 'react';

export default function ChatbotPage() {
  const questions = [
    "Quel est ton principal souci avec tes ongles ? (cassants, mous, dédoublés, secs, aucun)",
    "Quel est ton style préféré ? (naturel, brillant, coloré, glamour, nude)",
    "À quelle fréquence fais-tu ta manucure ? (1x/semaine, 2x/mois, 1x/mois, rarement)",
    "Quel est ton niveau d’expertise en manucure ? (débutante, intermédiaire, experte)",
    "Préféres-tu poser tes ongles seule ou aller en salon ?",
    "As-tu une préférence de texture ? (gel, semi-permanent, classique, soins uniquement)",
    "Souhaites-tu des conseils personnalisés ou une simple recommandation de produit ?"
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedAnswers = [...answers, input];
    setAnswers(updatedAnswers);
    setInput('');

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Fin du quiz – on appelle l'API OpenAI
      setLoading(true);
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: updatedAnswers })
      });

      const data = await res.json();
      setRecommendation(data.recommendation || "Une erreur est survenue.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Assistant Beauté Leanail</h1>

      {recommendation ? (
        <div>
          <h2>Recommandation beauté :</h2>
          <p>{recommendation}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>{questions[currentQuestion]}</p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ta réponse"
            required
            style={{ padding: 10, width: '100%', marginBottom: 10 }}
          />
          <button type="submit" style={{ padding: 10 }}>
            Envoyer
          </button>
        </form>
      )}

      {loading && <p>Analyse en cours...</p>}
    </div>
  );
}