'use client';

import { useState } from 'react';
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function QuizIA() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const questions = [
    {
      key: 'structurel',
      text: "Q1. Rencontrez-vous des problèmes structurels ou de fragilité des ongles ?",
      icon: "🧱",
      options: [
        { label: "Cassants", value: 'cassants' },
        { label: "Mous / flexibles", value: 'mous' },
        { label: "Secs / déshydratés", value: 'secs' },
        { label: "Dédoublés", value: 'dedoubles' },
        { label: "Striés verticalement", value: 'stries' },
        { label: "Ongles fins / qui poussent lentement", value: 'fins' },
        { label: "Non", value: 'non_structurel' }
      ]
    },
    {
      key: 'infectieux',
      text: "Q2. Avez-vous remarqué un problème de type infectieux ou pathologique ?",
      icon: "🦠",
      options: [
        { label: "Mycose / champignons", value: 'mycose' },
        { label: "Ongles verdâtres (infection bactérienne)", value: 'bacterie' },
        { label: "Ongles incarnés", value: 'incarnes' },
        { label: "Décollement de l’ongle", value: 'decollement' },
        { label: "Psoriasis unguéal ou eczéma", value: 'psoriasis' },
        { label: "Ligne de Beau", value: 'beau' },
        { label: "Non", value: 'non_infectieux' }
      ]
    },
    {
      key: 'esthetique',
      text: "Q3. Vos ongles présentent-ils un souci esthétique ?",
      icon: "🎨",
      options: [
        { label: "Jaunis / ternes", value: 'jaunis' },
        { label: "Taches blanches", value: 'blanches' },
        { label: "Coloration inégale", value: 'taches' },
        { label: "Ongles courts / rongés", value: 'ronges' },
        { label: "Déformés (cuillère, bombés…)", value: 'deformes' },
        { label: "Non", value: 'non_esthetique' }
      ]
    },
    {
      key: 'habitudes',
      text: "Q4. Vos habitudes ou votre environnement affectent-ils vos ongles ?",
      icon: "☠️",
      options: [
        { label: "Rongement (onychophagie)", value: 'rongement' },
        { label: "Grattage / arrachement cuticules", value: 'grattage' },
        { label: "Contact excessif avec l’eau/détergents", value: 'eau' },
        { label: "Utilisation excessive d’acétone", value: 'acetone' },
        { label: "Poses fréquentes de faux ongles", value: 'faux_ongles' },
        { label: "Non", value: 'non_habitudes' }
      ]
    },
    {
      key: 'autres',
      text: "Q5. Avez-vous remarqué des signes inhabituels liés à votre santé ?",
      icon: "⚠️",
      options: [
        { label: "Ongles bleutés", value: 'bleutes' },
        { label: "Ongles pâles", value: 'pales' },
        { label: "Stries noires ou taches sombres", value: 'stries_noires' },
        { label: "Non", value: 'non_autres' }
      ]
    }
  ];

  if (!isLoaded) return <p>Chargement...</p>;
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/quiz" />;
  if (user && user.emailAddresses[0]?.verification?.status !== 'verified') {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <p style={{ fontSize: '1.2rem', color: 'red' }}>🔒 Veuillez vérifier votre adresse email avant de continuer.</p>
        <p>Un email de confirmation vous a été envoyé. Vérifiez votre boîte.</p>
      </div>
    );
  }

  const handleAnswer = (value) => {
    const key = questions[step].key;
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      generateRecommendation({ ...answers, [key]: value });
    }
  };

  const generateRecommendation = async (allAnswers) => {
    setLoading(true);
    const userEmail = user.emailAddresses[0]?.emailAddress;
    const userName = user.fullName || user.username;
    const prompt = `Diagnostic Leanail pour ${userName} (${userEmail}):
${questions.map((q,i)=>`Q${i+1}: ${allAnswers[q.key] || 'Non répondu'}`).join('\n')}
Fournis un diagnostic détaillé, recommande 3 produits Leanail et donne des conseils personnalisés.`;

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gpt-4-turbo' })
      });
      const { recommendation } = await res.json();
      setResult(recommendation);

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: userEmail, subject: 'Votre diagnostic Leanail', message: recommendation })
      });

      await fetch('/api/save-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo: { name: userName, email: userEmail }, answers: allAnswers, result: recommendation })
      });

    } catch (err) {
      console.error('Erreur GPT / Email / Enregistrement:', err);
      setResult("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => { setStep(-1); setAnswers({}); setResult(''); };

  const buttonStyle = {
    display: 'block', width: '100%', maxWidth: 500, margin: '10px auto',
    padding: '12px 20px', borderRadius: 8, border: '1px solid #FFC0CB',
    background: '#FFC0CB', color: '#000', cursor: 'pointer',
    fontSize: '1rem', fontWeight: 'bold'
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', color: '#000' }}>
      <header style={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 1000, padding: '20px', borderBottom: '1px solid #f0c5d9' }}>
        <nav style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#FF69B4' }}>Leanail</div>
          <Link href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
          <Link href="/quiz" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Diagnostic</Link>
        </nav>
      </header>

      <main style={{ padding: 40 }}>
        {step === -1 && !result && <button onClick={() => setStep(0)} style={buttonStyle}>Lancer le diagnostic</button>}
        {step >= 0 && !result && (
          <>
            <h3>{questions[step].icon} {questions[step].text}</h3>
            {questions[step].options.map(opt => (
              <button key={opt.value} onClick={() => handleAnswer(opt.value)} style={buttonStyle}>{opt.label}</button>
            ))}
            {loading && <p>Analyse en cours...</p>}
          </>
        )}
        {result && (
          <div>
            <h2>Résultat</h2>
            <pre>{result}</pre>
            <button onClick={restartQuiz} style={buttonStyle}>Recommencer</button>
          </div>
        )}
      </main>
    </div>
  );
}
