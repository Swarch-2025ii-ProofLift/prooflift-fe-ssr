import { cookies } from 'next/headers'
import {jwtDecode} from 'jwt-decode'

const API_URL = process.env.AUTH_API_URL || 'http://localhost:8000/auth'


export async function getUserIdFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) return null

  try {
    const decoded = jwtDecode<{ sub: string }>(token)
    return decoded.sub
  } catch (e) {
    console.log('Error al decodificar:', e)
    return null
  }
}


export async function getUserData(uuid: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) return { nombre: 'Usuario' }

  const response = await fetch(`${API_URL}/user/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) return { nombre: 'Usuario' }

  const nombre = await response.text()
  return { nombre }
}