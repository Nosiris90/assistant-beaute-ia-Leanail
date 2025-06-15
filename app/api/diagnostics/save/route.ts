// ✅ /app/api/diagnostics/save/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

// Simuler un stockage en mémoire (à remplacer par une base de données réelle comme MongoDB ou Prisma)
const diagnosticsStore: any[] = [];

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const { imageUrl, result, suggestions } = body;

    if (!imageUrl || !result || !suggestions) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const newEntry = {
      userId,
      imageUrl,
      result,
      suggestions,
      createdAt: new Date().toISOString(),
    };

    diagnosticsStore.push(newEntry);

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error: any) {
    console.error('Erreur enregistrement diagnostic :', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
