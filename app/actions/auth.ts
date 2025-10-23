'use server'

import { redirect } from 'next/navigation'
import { setAuthToken, removeAuthToken } from '@/lib/auth'

const AUTH_API_URL = process.env.AUTH_API_URL || 'http://localhost:8000/auth'

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email y contraseña requeridos' }
  }

  try {
    const res = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json() as { error?: string; token?: string }

    if (!res.ok) {
      return { error: data.error ?? 'Error al iniciar sesión' }
    }

    if (data.token) {
      await setAuthToken(data.token)
      console.log('Cookie set by server action')
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Error al iniciar sesión' }
  }

  redirect('/feed')
}

export async function registerAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const nombre = String(formData.get('nombre') ?? '')
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  if (!nombre || !email || !password) {
    return { error: 'Todos los campos son requeridos' }
  }

  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden' }
  }

  try {
    const res = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    })

    const data = await res.json() as { error?: string }

    if (!res.ok) {
      return { error: data.error ?? 'Error en el registro' }
    }
  } catch (error) {
    console.error('Register error:', error)
    return { error: 'Error en el registro' }
  }

  redirect('/login')
}

export async function logoutAction() {
  await removeAuthToken()
  redirect('/login')
}