'use client';

import { useState } from 'react';
import styles from '../../quiz/quiz.module.css'; // ✅ chemin corrigé

export default function DiagnosticPhotoPage() {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadBox}>
        <h1 className={styles.title}>Diagnostic par Photo</h1>
        <p className={styles.text}>Téléversez une photo de vos ongles pour recevoir une analyse personnalisée.</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />

        {fileName && (
          <div className={styles.resultBox}>
            📷 Fichier sélectionné : <strong>{fileName}</strong>
            <br />
            (Le diagnostic IA sera bientôt activé !)
          </div>
        )}
      </div>
    </div>
  );
}
