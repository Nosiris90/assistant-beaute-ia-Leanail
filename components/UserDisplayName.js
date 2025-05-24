'use client'

import { useUser } from '@clerk/nextjs'

export default function UserDisplayName() {
  const { user } = useUser()

  if (!user) {
    return <span style={{ color: '#FF69B4', fontWeight: 'bold' }}>Invité</span>
  }

  return (
    <span style={{ color: '#FF69B4', fontWeight: 'bold' }}>
      Bienvenue, {user.firstName} !
    </span>
  )
}
