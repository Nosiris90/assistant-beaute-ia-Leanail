// /app/api/roboflow/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString('base64')

    const apiUrl = `https://detect.roboflow.com/${process.env.ROBOFLOW_MODEL_ID}?api_key=${process.env.ROBOFLOW_API_KEY}`

    const roboflowRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `image=${encodeURIComponent(base64Image)}`
    })

    const roboflowData = await roboflowRes.json()

    if (!roboflowData || !roboflowData.predictions || roboflowData.predictions.length === 0) {
      return NextResponse.json({ message: "Aucune anomalie détectée. Vos ongles semblent sains." })
    }

    const suggestions = roboflowData.predictions.map((pred: any) => {
      const label = pred.class || pred.label || 'anomalie'
      const confidence = Math.round((pred.confidence || 0) * 100)
      const translated = translateLabel(label)
      const conseil = conseilProduit(label)

      return `✅ ${translated} détecté(e) avec ${confidence}% de confiance.\n👉 ${conseil}`
    }).join('\n\n')

    return NextResponse.json({
      suggestions,
      brut: roboflowData.predictions
    })

  } catch (err: any) {
    console.error('Erreur Roboflow:', err)
    return NextResponse.json({ error: 'Erreur interne lors de la détection.' }, { status: 500 })
  }
}

// Traduction française des labels Roboflow
function translateLabel(label: string): string {
  const map: Record<string, string> = {
    'onychomycosis': 'Mycose des ongles',
    'nail_psoriasis': 'Psoriasis',
    'melanonychia': 'Stries noires',
    'paronychia': 'Infection du pli de l’ongle',
    'healthy': 'Ongle sain'
  }
  return map[label] || label
}

// Suggestions de soin ou produit associés
function conseilProduit(label: string): string {
  const conseils: Record<string, string> = {
    'onychomycosis': 'Utilisez un gel antifongique à base d’arbre à thé et consultez un professionnel.',
    'nail_psoriasis': 'Hydratez intensément et utilisez un vernis protecteur adapté.',
    'melanonychia': 'Surveillez la tache noire. Consultez si elle s’élargit.',
    'paronychia': 'Nettoyez la zone, appliquez un désinfectant, et évitez les agressions.',
    'healthy': 'Continuez votre routine actuelle et protégez vos ongles.'
  }
  return conseils[label] || 'Consultez un professionnel pour plus de détails.'
}
