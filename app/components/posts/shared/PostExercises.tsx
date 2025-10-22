'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { type Exercise } from "@/lib/exercises"
import { useExerciseCache } from "@/lib/contexts/ExerciseCacheContext"
import { Dumbbell } from "lucide-react"

interface PostExercisesProps {
  exerciseIds: string[]
  onExerciseClick?: (exerciseId: string) => void
  compact?: boolean
}

export default function PostExercises({
  exerciseIds,
  onExerciseClick,
  compact = false,
}: PostExercisesProps) {
  const { getExercise, isLoading, fetchExercises } = useExerciseCache()
  const [exercises, setExercises] = useState<Record<string, Exercise>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!exerciseIds || exerciseIds.length === 0) {
      setLoading(false)
      return
    }

    fetchExercises(exerciseIds)

    const exerciseData: Record<string, Exercise> = {}
    let anyLoading = false

    exerciseIds.forEach((id) => {
      const exercise = getExercise(id)
      if (exercise) {
        exerciseData[id] = exercise
      }
      if (isLoading(id)) {
        anyLoading = true
      }
    })

    setExercises(exerciseData)
    setLoading(anyLoading)

    if (anyLoading) {
      const interval = setInterval(() => {
        const updatedExercises: Record<string, Exercise> = {}
        let stillLoading = false

        exerciseIds.forEach((id) => {
          const exercise = getExercise(id)
          if (exercise) {
            updatedExercises[id] = exercise
          }
          if (isLoading(id)) {
            stillLoading = true
          }
        })

        setExercises(updatedExercises)
        setLoading(stillLoading)

        if (!stillLoading) {
          clearInterval(interval)
        }
      }, 500)

      return () => clearInterval(interval)
    }
  }, [exerciseIds, getExercise, isLoading, fetchExercises])

  if (!exerciseIds || exerciseIds.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {!compact && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Ejercicios:</span>
        </div>
      )}

      {loading ? (
        exerciseIds.map((_, index) => (
          <Skeleton key={index} className="h-7 w-20 rounded-md" />
        ))
      ) : (
        <TooltipProvider>
          {exerciseIds.map((exerciseId) => {
            const exercise = exercises[exerciseId]
            const displayName = exercise?.name || exerciseId

            return (
              <Tooltip key={exerciseId}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onExerciseClick?.(exerciseId)
                    }}
                    className="h-7 px-2.5 text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-primary"
                  >
                    #{displayName}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{displayName}</p>
                  {exercise?.muscle && (
                    <p className="text-xs text-muted-foreground">
                      {exercise.muscle}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      )}
    </div>
  )
}
