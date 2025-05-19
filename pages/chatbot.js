import { useState } from 'react';

export default function Chatbot() {
  const [answers, setAnswers] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setResponse(data.recommendation);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Assistant Beauté IA</h1>
      <form onSubmit={handleSubmit}>
        <label>Décris ton profil ongulaire :</label><br />
        <textarea
          rows={5}
          style={{ width: '100%', marginTop: '0.5rem' }}
          value={answers[0]}
          onChange={(e) => setAnswers([e.target.value])}
          placeholder="Exemple : J’ai les ongles cassants, je fais ma manucure 1x/mois et je veux un rendu naturel..."
        /><br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyse en cours...' : 'Obtenir une recommandation'}
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '2rem', background: '#f8f8f8', padding: '1rem' }}>
          <strong>Recommandation beauté :</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}