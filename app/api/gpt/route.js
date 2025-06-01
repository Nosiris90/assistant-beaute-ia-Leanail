import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Aucun prompt fourni.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'gpt-4-turbo',  // Utiliser gpt-4-turbo par défaut
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000  // Augmenter le nombre de tokens pour des réponses plus complètes
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const recommendation = data.choices[0].message.content;
      return NextResponse.json({ recommendation });
    } else {
      console.error('Réponse inattendue de l’API OpenAI :', data);
      return NextResponse.json({ error: 'Aucune recommandation générée.' }, { status: 500 });
    }
  } catch (err) {
    console.error('Erreur GPT :', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
