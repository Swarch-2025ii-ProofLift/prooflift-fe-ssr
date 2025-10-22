'use client'

import { useEffect, useRef, useState } from 'react'
import { ExerciseCard } from './ExerciseCard'

interface Exercise {
  id: string
  name: string
  group: string
}

interface ExercisesGridProps {
  initialExercises: Exercise[]
  initialCursor: string | null
  searchQuery?: string
  groupFilter?: string
}

export function ExercisesGrid({ 
  initialExercises, 
  initialCursor,
  searchQuery = '',
  groupFilter = ''
}: ExercisesGridProps) {
  const [exercises, setExercises] = useState(initialExercises)
  const [cursor, setCursor] = useState(initialCursor)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(!!initialCursor)
  const observerTarget = useRef<HTMLDivElement>(null)

  
  useEffect(() => {
    setExercises(initialExercises)
    setCursor(initialCursor)
    setHasMore(!!initialCursor)
  }, [searchQuery, groupFilter, initialExercises, initialCursor])

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true)
          
          try {
            const params = new URLSearchParams()
            if (searchQuery && searchQuery.length >= 2) params.append('q', searchQuery)
            if (groupFilter) params.append('group', groupFilter)
            if (cursor) params.append('cursor', cursor)
            params.append('limit', '20')

            
            const baseUrl = process.env.NEXT_PUBLIC_SUGGEST_API_URL || 'http://localhost:8082'
            const res = await fetch(`${baseUrl}/exercises?${params.toString()}`)

            if (!res.ok) throw new Error('Failed to fetch')

            const data = await res.json()
            const newExercises = data.items || []

            setExercises((prev) => [...prev, ...newExercises])
            setCursor(data.page?.next_cursor || null)
            setHasMore(!!data.page?.next_cursor)
          } catch (error) {
            console.error('Error loading more exercises:', error)
            setHasMore(false)
          } finally {
            setIsLoading(false)
          }
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [cursor, hasMore, isLoading, searchQuery, groupFilter])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            id={exercise.id}
            title={exercise.name}
            bodyPart={exercise.group}
          />
        ))}
      </div>

      <div ref={observerTarget} className="py-8 text-center">
        {isLoading && <p className="text-gray-400">Cargando más ejercicios...</p>}
        {!hasMore && exercises.length > 0 && (
          <p className="text-gray-400">No hay más ejercicios</p>
        )}
        {exercises.length === 0 && (
          <p className="text-gray-400">No se encontraron ejercicios</p>
        )}
      </div>
    </>
  )
}