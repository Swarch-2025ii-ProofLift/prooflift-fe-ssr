import { SearchBar } from '@/app/components/exercises/SearchBar'
import { MuscularGroupFilter } from '@/app/components/exercises/MuscularGroupFilter'
import { ExercisesGrid } from '@/app/components/exercises/ExercisesGrid'

interface ExercisesPageProps {
  searchParams: Promise<{ q?: string; group?: string }>
}

interface Exercise {
  id: string
  name: string
  group: string
}

interface ApiResponse {
  items: Exercise[]
  page: {
    next_cursor: string | null
    limit: number
  }
}

async function fetchExercises(q?: string, group?: string): Promise<{ exercises: Exercise[]; cursor: string | null }> {
  try {
    const params = new URLSearchParams()
    if (q && q.length >= 2) params.append('q', q)
    if (group) params.append('group', group)
    params.append('limit', '20')

    const baseUrl = process.env.EXERCISES_API_URL || 'http://localhost:8082'
    const url = `${baseUrl}/exercises?${params.toString()}`

    const res = await fetch(url, { 
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      return { exercises: [], cursor: null }
    }

    const data: ApiResponse = await res.json()
    
    return {
      exercises: data.items || [],
      cursor: data.page?.next_cursor || null,
    }
  } catch (error) {
    return { exercises: [], cursor: null }
  }
}

export default async function ExercisesPage({
  searchParams,
}: ExercisesPageProps) {
  const params = await searchParams
  const { exercises, cursor } = await fetchExercises(params.q, params.group)

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Ejercicios</h1>
      <p className="text-muted-foreground mb-6">
        Explora y encuentra ejercicios para tu rutina de entrenamiento.
      </p>
      <SearchBar initialValue={params.q || ''} />
      <MuscularGroupFilter />

      <ExercisesGrid 
        initialExercises={exercises} 
        initialCursor={cursor}
        searchQuery={params.q}
        groupFilter={params.group}
      />
    </div>
  )
}