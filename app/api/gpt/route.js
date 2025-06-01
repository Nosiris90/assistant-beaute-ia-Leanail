// app/api/gpt/route.js
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { prompt, model } = await req.json()

    if (!prompt || !model) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800
      })
    })

    const data = await response.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    const recommendation = data.choices[0].message.content.trim()
    return NextResponse.json({ recommendation })
  } catch (err) {
    console.error('Erreur GPT:', err)
    return NextResponse.json({ error: 'Erreur interne GPT' }, { status: 500 })
  }
}
