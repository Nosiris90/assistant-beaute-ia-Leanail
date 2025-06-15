// /app/nail-detect/page.tsx

'use client';

import { useState } from 'react';
import styles from '../quiz/quiz.module.css';

export default function NailDetectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/roboflow', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data?.suggestions) {
        setResult(data.suggestions);
      } else {
        setResult('❌ Aucun résultat reçu.');
      }
    } catch (error) {
      setResult('❌ Une erreur est survenue lors de l’analyse.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadBox}>
        <h2 className={styles.title}>📷 Téléverser une photo de votre ongle</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Aperçu de l’image"
            style={{ maxWidth: '100%', marginTop: '1rem', borderRadius: '12px' }}
          />
        )}

        <button onClick={handleUpload} className={styles.button}>
          🔍 Analyser l’image
        </button>
      </div>

      {result && (
        <div className={styles.resultBox}>
          <h3 className={styles.title}>🩺 Résultat du diagnostic</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
