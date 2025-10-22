'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

interface UserNameCacheContextType {
  getUserName: (userId: string) => string | null
  isLoading: (userId: string) => boolean
  fetchUserNames: (userIds: string[]) => Promise<void>
}

const UserNameCacheContext = createContext<UserNameCacheContextType | undefined>(undefined)

interface UserNameCacheProviderProps {
  children: React.ReactNode
}

export function UserNameCacheProvider({ children }: UserNameCacheProviderProps) {
  const [cache, setCache] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const pendingFetches = useRef<Set<string>>(new Set())
  const batchTimeout = useRef<NodeJS.Timeout | null>(null)
  const pendingBatch = useRef<Set<string>>(new Set())

  const fetchUserNames = useCallback(async (userIds: string[]) => {
    const idsToFetch = userIds.filter(
      id => !cache[id] && !loading[id] && !pendingFetches.current.has(id)
    )

    if (idsToFetch.length === 0) return

    idsToFetch.forEach(id => {
      pendingFetches.current.add(id)
      setLoading(prev => ({ ...prev, [id]: true }))
    })

    try {
      const results = await Promise.allSettled(
        idsToFetch.map(async (userId) => {
          try {
            const response = await fetch(`/api/user/${userId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            })

            if (!response.ok) {
              throw new Error('Failed to fetch user name')
            }

            const data = await response.json()
            const name = data.nombre || userId
            return { userId, name }
          } catch (error) {
            console.error(`Error fetching username for ${userId}:`, error)
            return { userId, name: userId }
          }
        })
      )

      const newCache: Record<string, string> = {}
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newCache[result.value.userId] = result.value.name
        }
      })

      setCache(prev => ({ ...prev, ...newCache }))
    } finally {
      const loadingUpdates: Record<string, boolean> = {}
      idsToFetch.forEach(id => {
        loadingUpdates[id] = false
        pendingFetches.current.delete(id)
      })
      setLoading(prev => ({ ...prev, ...loadingUpdates }))
    }
  }, [cache, loading])

  const batchedFetchUserNames = useCallback((userIds: string[]) => {
    userIds.forEach(id => pendingBatch.current.add(id))

    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current)
    }

    batchTimeout.current = setTimeout(() => {
      const batch = Array.from(pendingBatch.current)
      pendingBatch.current.clear()
      if (batch.length > 0) {
        fetchUserNames(batch)
      }
    }, 50)
  }, [fetchUserNames])

  const getUserName = useCallback((userId: string): string | null => {
    if (!cache[userId] && !loading[userId] && !pendingFetches.current.has(userId)) {
      batchedFetchUserNames([userId])
    }
    return cache[userId] || null
  }, [cache, loading, batchedFetchUserNames])

  const isLoading = useCallback((userId: string): boolean => {
    return loading[userId] || false
  }, [loading])

  const value = {
    getUserName,
    isLoading,
    fetchUserNames,
  }

  return (
    <UserNameCacheContext.Provider value={value}>
      {children}
    </UserNameCacheContext.Provider>
  )
}

export function useUserNameCache() {
  const context = useContext(UserNameCacheContext)
  if (context === undefined) {
    throw new Error('useUserNameCache must be used within a UserNameCacheProvider')
  }
  return context
}
