'use client'

import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? 'Ingresando...' : 'Iniciar Sesión'}
    </Button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, undefined)

  return (
    <>
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>

        {state?.error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {state.error}
          </div>
        )}

        <SubmitButton />
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">¿No tienes una cuenta? </span>
        <Link href="/register" className="text-primary hover:underline font-semibold">
          Regístrate aquí
        </Link>
      </div>
    </>
  )
}