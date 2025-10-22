'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { exercisesAPI, type Exercise } from '@/lib/exercises'

interface ExerciseCacheContextType {
  getExercise: (exerciseId: string) => Exercise | null
  isLoading: (exerciseId: string) => boolean
  fetchExercises: (exerciseIds: string[]) => Promise<void>
}

const ExerciseCacheContext = createContext<ExerciseCacheContextType | undefined>(undefined)

interface ExerciseCacheProviderProps {
  children: React.ReactNode
}

export function ExerciseCacheProvider({ children }: ExerciseCacheProviderProps) {
  const [cache, setCache] = useState<Record<string, Exercise>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const pendingFetches = useRef<Set<string>>(new Set())
  const batchTimeout = useRef<NodeJS.Timeout | null>(null)
  const pendingBatch = useRef<Set<string>>(new Set())

  const fetchExercises = useCallback(async (exerciseIds: string[]) => {
    const idsToFetch = exerciseIds.filter(
      id => !cache[id] && !loading[id] && !pendingFetches.current.has(id)
    )

    if (idsToFetch.length === 0) return

    idsToFetch.forEach(id => {
      pendingFetches.current.add(id)
      setLoading(prev => ({ ...prev, [id]: true }))
    })

    try {
      const results = await Promise.allSettled(
        idsToFetch.map(async (id) => {
          try {
            const exercise = await exercisesAPI.getExercise(id)
            return { id, exercise }
          } catch (error) {
            console.error(`Error fetching exercise ${id}:`, error)
            return { id, exercise: { id, name: id } }
          }
        })
      )

      const newCache: Record<string, Exercise> = {}
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newCache[result.value.id] = result.value.exercise
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

  const batchedFetchExercises = useCallback((exerciseIds: string[]) => {
    exerciseIds.forEach(id => pendingBatch.current.add(id))

    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current)
    }

    batchTimeout.current = setTimeout(() => {
      const batch = Array.from(pendingBatch.current)
      pendingBatch.current.clear()
      if (batch.length > 0) {
        fetchExercises(batch)
      }
    }, 50)
  }, [fetchExercises])

  const getExercise = useCallback((exerciseId: string): Exercise | null => {
    if (!cache[exerciseId] && !loading[exerciseId] && !pendingFetches.current.has(exerciseId)) {
      batchedFetchExercises([exerciseId])
    }
    return cache[exerciseId] || null
  }, [cache, loading, batchedFetchExercises])

  const isLoading = useCallback((exerciseId: string): boolean => {
    return loading[exerciseId] || false
  }, [loading])

  const value = {
    getExercise,
    isLoading,
    fetchExercises,
  }

  return (
    <ExerciseCacheContext.Provider value={value}>
      {children}
    </ExerciseCacheContext.Provider>
  )
}

export function useExerciseCache() {
  const context = useContext(ExerciseCacheContext)
  if (context === undefined) {
    throw new Error('useExerciseCache must be used within an ExerciseCacheProvider')
  }
  return context
}
