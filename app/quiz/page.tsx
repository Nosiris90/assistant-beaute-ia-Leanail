'use client';

import { useState } from 'react';
import styles from './quiz.module.css';
import { useRouter } from 'next/navigation';

export default function Quiz() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    // Redirection après sélection
    if (option === 'quiz') {
      router.push('/quiz/questions'); // adapt this to your actual quiz route
    } else if (option === 'photo') {
      router.push('/diagnostic/photo'); // adapt this to your actual diagnostic route
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.choiceBox}>
        <h1 className={styles.title}>Bienvenue dans votre assistant beauté intelligent</h1>
        <p className={styles.text}>Choisissez votre mode de diagnostic :</p>

        <button
          className={styles.button}
          onClick={() => handleOptionSelect('quiz')}
        >
          Faire le quiz intelligent
        </button>

        <button
          className={styles.button}
          onClick={() => handleOptionSelect('photo')}
        >
          Télécharger une photo pour un diagnostic IA
        </button>
      </div>
    </div>
  );
}
