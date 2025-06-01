import { NextResponse } from 'next/server';

export async function POST(req) {
  const { to, subject, message } = await req.json();

  if (!to || !subject || !message) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@leanail.com',
        to,
        subject,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || "Erreur d'envoi." }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: "Email envoyé avec succès." });
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
