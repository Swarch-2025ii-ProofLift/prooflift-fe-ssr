import Link from 'next/link'
import Image from 'next/image'
import type { LucideIcon } from 'lucide-react'
import { Home, Dumbbell, User, Menu, Activity } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import LogoutButton from '../components/auth/LogoutButton'
import { NotificationDropdown } from '../components/notifications/NotificationDropdown'
import { NotificationProvider } from '@/lib/contexts/NotificationContext'
import { GlobalPostDetailModal } from '@/app/components/posts/GlobalPostDetailModal'
import { getUserIdFromToken, getUserData } from '@/lib/user'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const menuItems: { title: string; url: string; icon: LucideIcon | undefined }[] = [
    { title: 'Feed', url: '/feed', icon: Home },
    { title: 'Ejercicios', url: '/exercises', icon: Dumbbell },
    { title: 'Perfil', url: '/profile', icon: User },
  ]


  const uuid = await getUserIdFromToken()
  const defaultUser = { nombre: 'Usuario', email: 'usuario@ejemplo.com' }
  let userName = defaultUser.nombre

  if (uuid) {
    try {
      const data = await getUserData(uuid)
      userName = data.nombre
    } catch {
      //default userName
    }
  }

  const user = { nombre: userName, email: defaultUser.email }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-background">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex fixed inset-y-0 left-0 w-[15.5rem] border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full flex-col">
          {/* Logo */}
          <div className="p-6 flex justify-center">
            <Link href="/" className="block w-fit mx-auto">
              <Image src="/logo-white.png" alt="ProofLift" width={120} height={120} unoptimized />
            </Link>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = (item.icon ?? Activity)
                return (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-base hover:bg-accent hover:text-accent-foreground transition"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Notificaciones */}
          <div className="px-4 pb-2">
            <NotificationDropdown />
          </div>

          {/* Usuario + logout */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.nombre}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      
      <div className="md:ml-[15.5rem]">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-10 bg-background border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center">
              <Image src="/logo.png" alt="ProofLift" width={28} height={28} unoptimized />
              <span className="ml-2 font-semibold">ProofLift</span>
            </div>

            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Abrir menú">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[16rem] h-full flex flex-col">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navegación</SheetTitle>
                  </SheetHeader>


                  <div className="p-4 border-b">
                    <Link href="/" className="flex items-center gap-2">
                      <Image src="/logo.png" alt="ProofLift" width={28} height={28} />
                      <span className="font-semibold">ProofLift</span>
                    </Link>
                  </div>

                  {/* Nav en drawer*/}
                  <nav className="p-2 flex-1 overflow-y-auto">
                    <ul className="space-y-1">
                      {menuItems.map((item) => {
                        const Icon = (item.icon ?? Activity)
                        return (
                          <li key={item.title}>
                            <SheetClose asChild>
                              <Link
                                href={item.url}
                                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base hover:bg-accent hover:text-accent-foreground transition"
                              >
                                <Icon className="h-5 w-5" />
                                <span>{item.title}</span>
                              </Link>
                            </SheetClose>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>

                  {/* Usuario + logout*/}
                  <div className="border-t p-4 flex items-center justify-between">
                    <div>
                      <span className="block font-medium">{user.nombre}</span>
                      <span className="block text-xs text-muted-foreground truncate">{user.email || 'Sin email'}</span>
                    </div>
                    <LogoutButton />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
      </div>
      <GlobalPostDetailModal currentUserId={uuid || undefined} />
    </NotificationProvider>
  )
}