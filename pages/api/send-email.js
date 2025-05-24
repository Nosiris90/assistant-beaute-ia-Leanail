import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, name, phone, message } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email obligatoire' }, { status: 400 });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Leanail <noreply@resend.com>',
        to: 'soclean.laverie@gmail.com',
        subject: `Nouveau contact Leanail de ${name || 'client'}`,
        text: `
Nouvelle inscription Leanail :
Nom : ${name || 'Non précisé'}
Email : ${email}
Téléphone : ${phone || 'Non précisé'}
Message : ${message || 'Aucun message'}
        `,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      console.error('Erreur Resend :', error);
      return NextResponse.json({ error: error.message || 'Erreur Resend' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès.' });
  } catch (err) {
    console.error('Erreur serveur :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
