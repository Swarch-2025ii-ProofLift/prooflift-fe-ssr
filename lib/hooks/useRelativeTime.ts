import { useMemo } from "react"

export function useRelativeTime(dateString: string): string {
  return useMemo(() => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) return "Hace unos minutos"
    if (diffInHours < 24) return `Hace ${Math.floor(diffInHours)}h`
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`

    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }, [dateString])
}


export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) return "Hace unos minutos"
  if (diffInHours < 24) return `Hace ${Math.floor(diffInHours)}h`
  if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
