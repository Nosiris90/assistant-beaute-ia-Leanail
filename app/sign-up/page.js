// app/sign-up/page.js
'use client'
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  )
}