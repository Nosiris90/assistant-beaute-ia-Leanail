import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json(
        { error: 'Aucune réponse reçue pour le diagnostic.' },
        { status: 400 }
      );
    }

    const prompt = `Tu es une experte en soins des ongles. Voici les réponses du client : ${JSON.stringify(
      answers
    )}. Donne-lui un diagnostic détaillé, les types de problèmes détectés, une routine beauté personnalisée, et les meilleurs produits Leanail à recommander.`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Tu es une assistante beauté IA spécialisée dans le soin des ongles pour Leanail. Sois bienveillante et claire.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const result = chat.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Erreur GPT:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur lors du diagnostic.' },
      { status: 500 }
    );
  }
}
