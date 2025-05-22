// app/quiz/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function QuizIA() {
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
        { label: "Non", value: 'non_structurel' },
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
        { label: "Ligne de Beau ou anomalie transversale", value: 'beau' },
        { label: "Non", value: 'non_infectieux' },
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
        { label: "Ongles trop courts ou rongés", value: 'ronges' },
        { label: "Déformés (cuillère, bombés…)", value: 'deformes' },
        { label: "Non", value: 'non_esthetique' },
      ]
    },
    {
      key: 'habitudes',
      text: "Q4. Vos habitudes ou votre environnement affectent-ils vos ongles ?",
      icon: "☠️",
      options: [
        { label: "Je ronge mes ongles (onychophagie)", value: 'rongement' },
        { label: "Je gratte / arrache mes cuticules", value: 'grattage' },
        { label: "Je suis souvent en contact avec l’eau ou des produits détergents", value: 'eau' },
        { label: "J’utilise beaucoup d’acétone ou produits abrasifs", value: 'acetone' },
        { label: "Je fais souvent des poses de faux ongles", value: 'faux_ongles' },
        { label: "Non", value: 'non_habitudes' },
      ]
    },
    {
      key: 'autres',
      text: "Q5. Avez-vous remarqué des signes inhabituels liés à votre santé ?",
      icon: "⚠️",
      options: [
        { label: "Ongles bleutés", value: 'bleutes' },
        { label: "Ongles très pâles", value: 'pales' },
        { label: "Présence de stries noires ou taches sombres", value: 'stries_noires' },
        { label: "Non", value: 'non_autres' },
      ]
    }
  ];

  const [step, setStep] = useState(-1);
  const [userInfo, setUserInfo] = useState({ name: '', gender: '', email: '', phone: '', country: '', city: '', consent: false });
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleUserInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const startQuiz = () => {
    if (!userInfo.name || !userInfo.gender || !userInfo.email || !userInfo.phone) return alert("Veuillez remplir tous les champs requis : nom, genre, email et téléphone.");
    if (!userInfo.consent) return alert("Veuillez cocher la case pour enregistrer vos réponses.");
    setStep(0);
  };

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
    const prompt = `Tu es une experte beauté. Voici le profil de la cliente :
Nom : ${userInfo.name}
Genre : ${userInfo.gender}
Email : ${userInfo.email}
Téléphone : ${userInfo.phone}
Pays : ${userInfo.country}
Ville / Localisation : ${userInfo.city}

Voici ses réponses :
${questions.map((q, i) => `Q${i + 1}: ${allAnswers[q.key] || 'Non répondu'}`).join('\n')}

En te basant sur ces réponses :
1) Donne un diagnostic personnalisé.
2) Recommande 3 produits Leanail adaptés.
3) Donne les conseils d’utilisation.`;

    setLoading(true);

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gpt-4-turbo' })
      });

      const { recommendation } = await res.json();
      setResult(recommendation);
      alert('✅ Votre recommandation a été générée avec succès ! Elle vous a été envoyée par email et enregistrée.');

      if (userInfo.email) {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: userInfo.email,
            subject: 'Votre diagnostic Leanail',
            message: `Bonjour ${userInfo.name},\n\nVoici votre recommandation beauté :\n\n${recommendation}`
          })
        });
      }

      await fetch('/api/save-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo, answers: allAnswers, result: recommendation })
      });

      console.log("[SHOPIFY] Données prêtes à être envoyées à Shopify.");
    } catch (err) {
      console.error('Erreur API GPT ou enregistrement :', err);
      setResult("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setStep(-1);
    setAnswers({});
    setUserInfo({ name: '', gender: '', email: '', phone: '', country: '', city: '', consent: false });
    setResult('');
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem'
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    maxWidth: 500,
    margin: '10px auto',
    padding: '12px 20px',
    borderRadius: 8,
    border: '1px solid #FFC0CB',
    background: '#FFC0CB',
    color: '#000',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', color: '#000' }}>
      <header style={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 1000, padding: '20px 0', borderBottom: '1px solid #f0c5d9' }}>
        <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#FF69B4' }}>Leanail</div>
          <Link href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
          <Link href="/quiz" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Diagnostic</Link>
        </nav>
      </header>

      <main style={{ padding: 40 }}>
        {step === -1 && !result && (
          <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff5f9', borderRadius: 10, padding: 30, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 20, color: '#FF69B4' }}>📝 Formulaire de départ</h2>
            <input name="name" placeholder="Nom complet" value={userInfo.name} onChange={handleUserInfoChange} style={inputStyle} />
            <select name="gender" value={userInfo.gender} onChange={handleUserInfoChange} style={inputStyle}>
              <option value="">Genre</option>
              <option value="Femme">Femme</option>
              <option value="Homme">Homme</option>
              <option value="Autre">Autre</option>
            </select>
            <input name="email" placeholder="Email (obligatoire)" value={userInfo.email} onChange={handleUserInfoChange} style={inputStyle} />
            <input name="phone" placeholder="Téléphone (obligatoire)" value={userInfo.phone} onChange={handleUserInfoChange} style={inputStyle} />
            <input name="country" placeholder="Pays" value={userInfo.country} onChange={handleUserInfoChange} style={inputStyle} />
            <input name="city" placeholder="Ville ou localisation" value={userInfo.city} onChange={handleUserInfoChange} style={inputStyle} />
            <label style={{ display: 'block', margin: '12px 0', fontSize: '0.95rem' }}>
              <input type="checkbox" name="consent" checked={userInfo.consent} onChange={handleUserInfoChange} style={{ marginRight: 8 }} />
              J’accepte que mes réponses soient utilisées pour générer des recommandations personnalisées.
            </label>
            <button onClick={startQuiz} style={buttonStyle}>Commencer le diagnostic</button>
          </div>
        )}

        {step >= 0 && !result && (
          <>
            <h2 style={{ color: '#000', fontSize: '1.8rem', marginBottom: 20 }}>
              <span>{questions[step].icon}</span> {questions[step].text}
            </h2>
            <div style={{ marginTop: 10 }}>
              {questions[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  style={buttonStyle}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {loading && <p style={{ marginTop: 20 }}>Analyse en cours…</p>}
          </>
        )}

        {result && (
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <h2 style={{ color: '#000000', fontSize: '1.8rem' }}>Votre recommandation personnalisée</h2>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>{result}</div>
            <button
              onClick={restartQuiz}
              style={buttonStyle}
            >
              Recommencer le diagnostic
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
