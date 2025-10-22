'use client'

import { useState, useEffect } from "react"
import { useUserNameCache } from "@/lib/contexts/UserNameCacheContext"

export function useUserName(userId: string | null | undefined) {
  const { getUserName, isLoading } = useUserNameCache()
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      setUserName(null)
      return
    }

    const cachedName = getUserName(userId)
    const isCurrentlyLoading = isLoading(userId)

    setUserName(cachedName)
    setLoading(isCurrentlyLoading)

    if (isCurrentlyLoading) {
      const interval = setInterval(() => {
        const updatedName = getUserName(userId)
        const stillLoading = isLoading(userId)

        setUserName(updatedName)
        setLoading(stillLoading)

        if (!stillLoading) {
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [userId, getUserName, isLoading])

  return { userName, loading }
}
