'use client'

import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { registerAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? 'Creando cuenta...' : 'Crear cuenta'}
    </Button>
  )
}

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, undefined)

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            className="rounded border-gray-300"
            required
          />
          <label
            htmlFor="terms"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Acepto los términos y condiciones
          </label>
        </div>

        {state?.error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {state.error}
          </div>
        )}

        <SubmitButton />
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Inicia sesión
        </Link>
      </div>
    </>
  )
}