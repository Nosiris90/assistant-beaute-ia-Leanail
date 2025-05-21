export default async function handler(req, res) {
  const { prompt, model } = req.body;

  // Vérification de la clé API
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ Clé OpenAI manquante dans les variables d'environnement.");
    return res.status(500).json({ error: "Clé OpenAI non définie." });
  }

  // Vérification du prompt
  if (!prompt || typeof prompt !== 'string') {
    console.warn("❌ Prompt invalide :", prompt);
    return res.status(400).json({ error: 'Prompt manquant ou invalide.' });
  }

  console.log("🧠 Prompt reçu :", prompt.slice(0, 200) + '...');
  console.log("🔐 Utilisation de modèle :", model || 'gpt-4-turbo');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.choices?.[0]?.message?.content) {
      console.error('❌ Erreur API OpenAI :', data);
      return res.status(500).json({ error: data.error?.message || 'Erreur API OpenAI' });
    }

    const recommendation = data.choices[0].message.content;
    console.log("✅ Recommandation générée");
    res.status(200).json({ recommendation });

  } catch (err) {
    console.error('❌ Erreur serveur GPT :', err.message);
    res.status(500).json({ error: err.message });
  }
}
