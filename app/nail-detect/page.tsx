'use client';

import { useState } from 'react';
import styles from '../quiz/quiz.module.css';

export default function NailDetectPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);

    const response = await fetch('/api/diagnostic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image })
    });

    const data = await response.json();
    setResult(data.result || 'Aucune réponse');
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadBox}>
        <h2 className={styles.title}>🖼️ Analyse photo des ongles</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />
        {image && <img src={image} alt="Aperçu" className={styles.previewImage} />}
        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={!image || loading}
        >
          {loading ? 'Analyse en cours...' : 'Lancer le diagnostic'}
        </button>
      </div>
      {result && (
        <div className={styles.resultBox}>
          <h2 className={styles.title}>🎯 Résultat IA</h2>
          <pre>{result}</pre>
          <button className={styles.button} onClick={() => { setImage(null); setResult(null); }}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
