import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt, answers } = await req.json();

    if (!prompt && !answers) {
      return NextResponse.json({ error: 'Aucune donnée fournie.' }, { status: 400 });
    }

    // Analyse des réponses par catégorie
    const scores = {};
    let totalIssues = 0;
    const categories = Object.entries(answers || {}).map(([category, values]) => {
      const filtered = values.filter(v => v !== 'Aucun');
      scores[category] = filtered.length;
      totalIssues += filtered.length;
      return {
        category,
        count: filtered.length,
        items: filtered
      };
    });

    // Détermination de la catégorie dominante
    const dominant = categories.reduce((prev, curr) =>
      curr.count > prev.count ? curr : prev,
      { category: '', count: 0 }
    );

    // Routine de soin proposée (selon catégories détectées)
    const routines = {
      structurel: "Renforcement avec sérums, vernis durcisseur et hydratation quotidienne.",
      infectieux: "Désinfection douce, antifongiques, éviter les faux ongles.",
      esthetique: "Top coat brillance, soin blanchissant, routine cuticules.",
      environnement: "Utiliser des gants, soins post-exposition, huiles réparatrices.",
      autres: "Consulter un pro si coloration anormale + soin circulatoire (massages, sérum)."
    };

    const diagnosticPrompt = `
Diagnostic IA Leanail – Analyse approfondie

Réponses du client :
${categories
      .map(
        (cat) =>
          `- ${cat.category.toUpperCase()} (${cat.count}): ${cat.items.join(', ') || 'Aucun'}`
      )
      .join('\n')}

Résumé :
- Nombre total de problèmes détectés : ${totalIssues}
- Catégorie dominante : ${dominant.category.toUpperCase()} (${dominant.count})
- Routine beauté suggérée : ${routines[dominant.category] || 'Routine générale de soin et hydratation régulière.'}

Tâche :
En tant qu'experte beauté IA Leanail, génère un **diagnostic professionnel clair** avec :
1. Une interprétation des problèmes listés
2. Des recommandations personnalisées de produits (issus d'une gamme Leanail imaginaire)
3. Une routine beauté quotidienne ou hebdomadaire adaptée.
Utilise un ton chaleureux, professionnel et bienveillant.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'Tu es une IA beauté spécialisée dans les soins des ongles pour Leanail.',
        },
        {
          role: 'user',
          content: diagnosticPrompt,
        },
      ],
    });

    const recommendation = completion.choices?.[0]?.message?.content || 'Réponse indisponible.';

    return NextResponse.json({
      recommendation,
      dominantCategory: dominant.category,
      totalIssues,
      scores,
    });
  } catch (error) {
    console.error('[GPT ROUTE ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
