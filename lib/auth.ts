import { cookies } from 'next/headers'

export async function setAuthToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('access_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  console.log('Token set in cookies')
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value
}

export async function removeAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
}