export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { answers } = req.body;

// Log temporaire pour verifier la clé API
console.log('Clé API utilisée :', process.env.OPENAI_API_KEY);

  const prompt = `Tu es une experte beauté. Voici les réponses d'une cliente :\n\n${answers.map((a, i) => `Q${i + 1}: ${a}`).join('\n')}\n\nDonne une recommandation personnalisée de soins ou vernis pour ses ongles, en expliquant brièvement pourquoi.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'Tu es une experte en soins des ongles et beauté.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur GPT :', data);
      return res.status(500).json({ recommendation: 'Erreur GPT : ' + (data?.error?.message || 'Réponse invalide') });
    }

    const recommendation = data.choices?.[0]?.message?.content || 'Une erreur est survenue.';
    res.status(200).json({ recommendation });

  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ recommendation: 'Erreur serveur : ' + error.message });
  }
}