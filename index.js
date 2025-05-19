import { useState } from 'react';

export default function Home() {
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [result, setResult] = useState("");

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setResult(data.recommendation || "Une erreur est survenue.");
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Diagnostic Beauté Ongles</h1>
      <div>
        <label>1. Type d'ongles :</label>
        <select onChange={(e) => handleChange(0, e.target.value)}>
          <option value="">--Choisir--</option>
          <option value="Cassants">Cassants</option>
          <option value="Mous">Mous</option>
          <option value="Normaux">Normaux</option>
        </select>
      </div>
      <div>
        <label>2. Fréquence manucure :</label>
        <select onChange={(e) => handleChange(1, e.target.value)}>
          <option value="">--Choisir--</option>
          <option value="1 fois par semaine">1 fois/semaine</option>
          <option value="1 fois par mois">1 fois/mois</option>
        </select>
      </div>
      <div>
        <label>3. Expérience :</label>
        <select onChange={(e) => handleChange(2, e.target.value)}>
          <option value="">--Choisir--</option>
          <option value="Débutante">Débutante</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Avancée">Avancée</option>
        </select>
      </div>
      <div>
        <label>4. Look souhaité :</label>
        <select onChange={(e) => handleChange(3, e.target.value)}>
          <option value="">--Choisir--</option>
          <option value="Naturel">Naturel</option>
          <option value="Glamour">Glamour</option>
          <option value="Créatif">Créatif</option>
        </select>
      </div>
      <button onClick={handleSubmit} style={{ marginTop: 20 }}>Obtenir ma recommandation</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Recommandation beauté :</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}