'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs';
import styles from '../quiz/quiz.module.css';

type DiagnosticEntry = {
  id: string;
  userId: string;
  imageUrl: string;
  result: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [diagnostics, setDiagnostics] = useState<DiagnosticEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchDiagnostics = async () => {
      try {
        const res = await fetch('/api/diagnostics');
        const data = await res.json();
        setDiagnostics(data);
      } catch (err) {
        console.error("Erreur lors du chargement des diagnostics :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnostics();
  }, [isSignedIn]);

  if (!isLoaded) return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/admin" />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📊 Tableau de bord - Diagnostics IA</h2>
      {loading ? (
        <p>Chargement des données...</p>
      ) : diagnostics.length === 0 ? (
        <p>Aucun diagnostic enregistré.</p>
      ) : (
        <div style={{ width: '100%', maxWidth: '900px' }}>
          {diagnostics.map((entry) => (
            <div key={entry.id} className={styles.resultBox}>
              <p><strong>🧑‍⚕️ Utilisateur :</strong> {entry.userId}</p>
              <p><strong>🕓 Date :</strong> {new Date(entry.createdAt).toLocaleString()}</p>
              <p><strong>📷 Image :</strong></p>
              <img
                src={entry.imageUrl}
                alt="Image analysée"
                style={{ maxWidth: '100%', borderRadius: '8px', margin: '10px 0' }}
              />
              <p><strong>🧠 Résultat IA :</strong></p>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{entry.result}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}