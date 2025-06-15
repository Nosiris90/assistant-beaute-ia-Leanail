// /app/api/roboflow/route.ts

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readFile(file: any) {
  const data = await fs.readFile(file.filepath);
  return data.toString('base64');
}

function generateSuggestions(predictions: any[]) {
  if (!predictions || predictions.length === 0) return '🟢 Aucun problème détecté. Vos ongles semblent en bonne santé.';

  return predictions.map(pred => {
    const label = pred.class;
    const confidence = (pred.confidence * 100).toFixed(1);
    let translation = '';
    let recommendation = '';

    switch (label) {
      case 'onychomycosis':
        translation = "Mycose de l'ongle";
        recommendation = "Utilisez un traitement antifongique comme notre Gel à l'arbre à thé et évitez l'humidité prolongée.";
        break;
      case 'nail_psoriasis':
        translation = "Psoriasis de l'ongle";
        recommendation = "Hydratez régulièrement vos ongles et consultez un dermatologue. Évitez les vernis irritants.";
        break;
      case 'normal':
        translation = "Ongle sain";
        recommendation = "Aucun problème visible. Continuez votre routine de soin habituelle avec notre huile nourrissante Leanail.";
        break;
      case 'hangnail':
        translation = "Peau arrachée (envie)";
        recommendation = "Utilisez une crème réparatrice pour cuticules et évitez de tirer la peau.";
        break;
      default:
        translation = label;
        recommendation = "Aucune recommandation spécifique disponible pour cette condition.";
    }

    return `🧠 Diagnostic : ${translation}\n🎯 Score de confiance : ${confidence}%\n💅 Recommandation : ${recommendation}`;
  }).join('\n\n');
}

export async function POST(req: Request) {
  try {
    const formData = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: false });
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { files } = formData as any;
    const imageFile = files.file;
    const base64Image = await readFile(imageFile);

    const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY;
    const MODEL_ID = process.env.ROBOFLOW_MODEL_ID;

    const response = await fetch(`https://detect.roboflow.com/${MODEL_ID}?api_key=${ROBOFLOW_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: base64Image,
    });

    const data = await response.json();
    const suggestions = generateSuggestions(data.predictions);

    return NextResponse.json({ ...data, suggestions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur interne Roboflow' }, { status: 500 });
  }
}
