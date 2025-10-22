'use client'

import { useState, useCallback } from "react"
import { useMutation } from "@apollo/client/react"
import { CREATE_POST } from "@/lib/graphql/posts"
import ExerciseSelector from "./ExerciseSelector"
import PostTextarea from "./PostTextArea"
import SelectedExerciseChip from "./SelectedExerciseChip"

const MAX_CHARACTERS = 500

interface Post {
  id: string
  userId: string
  body: string
  exerciseIds: string[]
  createdAt: string
  updatedAt: string
}

interface CreatePostData {
  createPost: Post
}

interface CreatePostVariables {
  body: string
  exerciseIds: string[]
}

interface CreatePostProps {
  onPostCreated?: (post: Post) => void
  placeholder?: string
}

export default function CreatePost({ 
  onPostCreated, 
  placeholder = "¿Qué estás entrenando hoy?" 
}: CreatePostProps) {
  const [body, setBody] = useState("")
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [exerciseMap, setExerciseMap] = useState<Record<string, string>>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState("")

  const [createPost, { loading }] = useMutation<CreatePostData, CreatePostVariables>(
    CREATE_POST,
    {
      onCompleted: (data) => {
        setBody("")
        setSelectedExercises([])
        setExerciseMap({})
        setIsExpanded(false)
        setError("")
        onPostCreated?.(data.createPost)
      },
      onError: (err) => {
        console.error(err)
        setError("Error al crear la publicación. Inténtalo de nuevo.")
      },
    }
  )

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!body.trim()) {
      setError("Por favor, escribe algo antes de publicar.")
      return
    }

    setError("")
    await createPost({
      variables: {
        body: body.trim(),
        exerciseIds: selectedExercises,
      },
    })
  }, [body, selectedExercises, createPost])

  const handleTextareaFocus = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleCancel = useCallback(() => {
    setBody("")
    setSelectedExercises([])
    setExerciseMap({})
    setIsExpanded(false)
    setError("")
  }, [])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }, [])

  const toggleExercise = useCallback((exerciseId: string, exerciseName: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    )
    
    setExerciseMap((prev) => ({
      ...prev,
      [exerciseId]: exerciseName
    }))
  }, [])

  const getExerciseName = useCallback((exerciseId: string) => {
    return exerciseMap[exerciseId] || exerciseId
  }, [exerciseMap])

  const isOverLimit = body.length > MAX_CHARACTERS

  return (
    <div className="w-full create-post-component">
      <form
        onSubmit={handleSubmit}
        className={`p-4 md:p-6 bg-card rounded-xl shadow-lg border border-border
                   transition-all duration-300 ease-out flex flex-col gap-4
                   ${isExpanded ? 'shadow-xl border-primary/20' : 'hover:shadow-xl hover:border-primary/20'}`}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-primary font-semibold text-lg">Crear publicación</h3>
        </div>

        {/* Textarea */}
        <PostTextarea
          value={body}
          onChange={handleTextChange}
          onFocus={handleTextareaFocus}
          onSubmit={() => handleSubmit()}
          isExpanded={isExpanded}
          placeholder={placeholder}
          maxLength={MAX_CHARACTERS}
        />

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Selected exercises */}
        {selectedExercises.length > 0 && (
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">Ejercicios seleccionados:</label>
            <div className="flex flex-wrap gap-2">
              {selectedExercises.map((id) => (
                <SelectedExerciseChip
                  key={id}
                  name={getExerciseName(id)}
                  onRemove={() => toggleExercise(id, getExerciseName(id))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Exercise selector */}
        {isExpanded && (
          <ExerciseSelector
            selectedExercises={selectedExercises}
            onToggleExercise={toggleExercise}
            getExerciseName={getExerciseName}
          />
        )}

        {/* Action buttons */}
        {isExpanded && (
          <div className="space-y-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <p className="text-xs text-muted-foreground">
              Presiona {navigator.platform.includes("Mac") ? "Cmd" : "Ctrl"} + Enter para publicar
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-muted-foreground
                           bg-tertiary/60 hover:bg-tertiary hover:text-primary
                           transition-all duration-200 disabled:opacity-50
                           focus:outline-none focus:ring-2 focus:ring-tertiary/50"
              >
                Cancelar
              </button>
            
            <button
              type="submit"
              disabled={loading || !body.trim() || isOverLimit}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm
                         bg-primary text-background hover:bg-primary/90
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-primary/50
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publicando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Publicar
                </>
              )}
            </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}