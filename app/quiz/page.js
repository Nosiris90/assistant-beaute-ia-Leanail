'use client';
import { useState } from 'react';

export default function QuizPage() {
  const [answers, setAnswers] = useState({
    ongle: '',
    frequence: '',
    style: '',
    habilete: ''
  });
  const [recommendation, setRecommendation] = useState('');

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: Object.values(answers) })
    });
    const data = await res.json();
    setRecommendation(data.recommendation || 'Une erreur est survenue');
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#b4005a' }}>Diagnostic Beauté IA</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <label>Quel est votre type d'ongles ?</label>
        <select name="ongle" onChange={handleChange} required>
          <option value="">--Choisir--</option>
          <option value="Cassants">Cassants</option>
          <option value="Mous">Mous</option>
          <option value="Normaux">Normaux</option>
        </select>

        <label>À quelle fréquence faites-vous votre manucure ?</label>
        <select name="frequence" onChange={handleChange} required>
          <option value="">--Choisir--</option>
          <option value="Jamais">Jamais</option>
          <option value="1 fois/mois">1 fois/mois</option>
          <option value="Chaque semaine">Chaque semaine</option>
        </select>

        <label>Quel style d’ongles préférez-vous ?</label>
        <select name="style" onChange={handleChange} required>
          <option value="">--Choisir--</option>
          <option value="Naturel">Naturel</option>
          <option value="Glamour">Glamour</option>
          <option value="Tendance / Artistique">Tendance / Artistique</option>
        </select>

        <label>Quel est votre niveau d’habileté ?</label>
        <select name="habilete" onChange={handleChange} required>
          <option value="">--Choisir--</option>
          <option value="Débutante">Débutante</option>
          <option value="Je me débrouille">Je me débrouille</option>
          <option value="Pro/experte">Pro/experte</option>
        </select>

        <button type="submit" style={{
          marginTop: '1rem',
          padding: '1rem 2rem',
          backgroundColor: '#b4005a',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer'
        }}>
          Obtenir ma recommandation
        </button>
      </form>

      {recommendation && (
        <div style={{ marginTop: '2rem', background: '#fff0f5', padding: '1rem', borderRadius: '12px' }}>
          <h2>Recommandation beauté :</h2>
          <p>{recommendation}</p>
        </div>
      )}
    </main>
  );
}