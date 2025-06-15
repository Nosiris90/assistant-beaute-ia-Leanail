// /app/quiz/page.tsx

'use client';

import { useAuth } from '@clerk/nextjs';
import { RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import styles from './quiz.module.css';

export default function QuizPage() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/quiz" />;

  return (
    <div className={styles.container}>
      <div className={styles.choiceBox}>
        <h2 className={styles.title}>Bienvenue sur le Diagnostic Beauté Leanail</h2>
        <p className={styles.text}>
          Choisissez votre mode de diagnostic intelligent :
        </p>
        <Link href="/quiz/questions">
          <button className={styles.button}>🔍 Lancer le Quiz</button>
        </Link>
        <Link href="/nail-detect">
          <button className={styles.button}>📸 Analyse par Photo</button>
        </Link>
      </div>
    </div>
  );
}
