// /app/nail-detect/page.tsx

'use client';

import { useState } from 'react';
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs';
import styles from '../quiz/quiz.module.css';

export default function NailDetectPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!isLoaded) return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/nail-detect" />;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult('');
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/roboflow', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Réponse Roboflow:', JSON.stringify(data, null, 2));

      if (data?.suggestions) {
        setResult(data.suggestions);
      } else if (data?.message) {
        setResult(`ℹ️ ${data.message}`);
      } else if (data?.error) {
        setResult(`❌ Erreur côté serveur : ${data.error}`);
      } else {
        setResult("⚠️ Le diagnostic IA est en attente de résultat. Aucun retour n'a été généré.");
      }
    } catch (err) {
      console.error('Erreur fetch:', err);
      setResult("❌ Erreur réseau ou côté client lors de l'analyse de l'image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadBox}>
        <h2 className={styles.title}>Diagnostic par Photo</h2>
        <p className={styles.text}>
          Téléversez une photo de vos ongles pour recevoir une analyse personnalisée.
        </p>
        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
        {file && (
          <div className={styles.resultBox}>
            <p>📸 Fichier sélectionné : <strong>{file.name}</strong></p>
            <button
              className={styles.button}
              onClick={handleSubmit}
              disabled={loading}
              style={{ display: 'inline-block', opacity: 1, marginTop: '1rem', visibility: 'visible' }}
            >
              {loading ? (
                <>
                  <span className="loader" style={{ marginRight: '8px' }}></span>
                  Analyse en cours...
                </>
              ) : (
                "Analyser l'image"
              )}
            </button>
          </div>
        )}
        {previewUrl && (
          <div style={{ marginTop: '1rem' }}>
            <img
              src={previewUrl}
              alt="Aperçu de l'image téléversée"
              style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
            />
          </div>
        )}
        {result && (
          <div className={styles.resultBox}>
            <h3>🔍 Résultat :</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
