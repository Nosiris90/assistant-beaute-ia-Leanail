// ==============================
// ✅ /app/api/gpt/route.js
// ==============================

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req) {
  try {
    const { answers } = await req.json()

    const prompt = `Tu es une experte des ongles. Voici les réponses du client : ${JSON.stringify(
      answers
    )}. Donne-lui un diagnostic personnalisé et recommande-lui les meilleurs produits de soins des ongles.`

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Tu es une assistante beauté IA spécialisée dans le soin des ongles pour Leanail.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return NextResponse.json({ result: chat.choices[0].message.content })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}