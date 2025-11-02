export interface Exercise {
  id: string
  name: string
  description?: string
  group?: string
  muscle?: string
  muscles?: string[]
}

export interface ExercisesResponse {
  items: Exercise[]
  nextCursor?: string | null
  hasMore?: boolean
  total?: number
}

export interface GetExercisesParams {
  group?: string | null
  muscle?: string | null
  q?: string | null
  limit?: number
  cursor?: string | null
}

export const exercisesAPI = {
  async getExercises({ 
    q = '', 
    limit = 20 
  }: { 
    q?: string
    limit?: number 
  } = {}): Promise<ExercisesResponse> {
    const params = new URLSearchParams()
    if (q) params.append('q', q)
    params.append('limit', limit.toString())

    const response = await fetch(`/api/exercises?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises')
    }
    
    return response.json()
  },

  async getExercise(id: string): Promise<Exercise> {
    const response = await fetch(`/api/exercises/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch exercise ${id}`)
    }

    return response.json()
  }
}