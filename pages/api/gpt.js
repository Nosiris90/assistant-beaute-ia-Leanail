export default async function handler(req, res) {
  const { prompt, model } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt manquant ou invalide.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
      console.error('OpenAI error:', data);
      throw new Error(data.error?.message || 'Erreur API');
    }

    res.status(200).json({ recommendation: data.choices[0].message.content });
  } catch (err) {
    console.error('Erreur serveur :', err.message);
    res.status(500).json({ error: err.message });
  }
}
