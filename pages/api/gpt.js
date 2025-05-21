// pages/api/gpt.js
export default async function handler(req, res) {
  const { prompt, model } = req.body
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Erreur API')
    const recommendation = data.choices[0].message.content
    res.status(200).json({ recommendation })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
