'use client'

import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="ghost"
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Salir
      </Button>
    </form>
  )
}