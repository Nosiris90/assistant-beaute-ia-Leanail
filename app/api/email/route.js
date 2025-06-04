// ==============================
// ✅ /app/api/email/route.js
// ==============================

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { email, content } = await req.json()

    await resend.emails.send({
      from: 'Leanail <noreply@leanail.com>',
      to: email,
      subject: 'Votre diagnostic beauté Leanail',
      html: `<div style="font-family:Lato,sans-serif;padding:20px">${content}</div>`,
    })

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

