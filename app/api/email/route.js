// app/api/email/route.js
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { to, subject, message } = await req.json()

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const data = await resend.emails.send({
      from: 'Leanail <no-reply@leanail.com>',
      to,
      subject,
      html: `<p>${message.replace(/\n/g, '<br/>')}</p>`
    })

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Erreur envoi email:', err)
    return NextResponse.json({ error: 'Erreur interne Resend' }, { status: 500 })
  }
}
