import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExerciseImage } from '@/app/components/exercises/ExerciseImage'

interface Exercise {
  id: string
  name: string
  group: string
  description?: string
  cues?: string[]
  muscles: string[]
  goal_tags?: string[]
  equipment?: string[]
  level?: string
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getPlaceholderImage(group?: string) {
  const placeholders: Record<string, string> = {
    pecho: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
    espalda: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=600&fit=crop',
    piernas: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&h=600&fit=crop',
    hombros: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&h=600&fit=crop',
    brazos: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop',
    core: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
  }
  return placeholders[group?.toLowerCase() || ''] || placeholders['piernas']
}

function getImageUrl(exercise: Exercise) {
  if (exercise?.name) {
    const slug = createSlug(exercise.name)
    return `/exercises/${slug}.webp`
  }
  return getPlaceholderImage(exercise?.group)
}

function getLevelBadge(level?: string) {
  const badges: Record<string, { color: string; text: string }> = {
    principiante: { color: 'bg-green-600', text: 'Recomendado para empezar' },
    intermedio: { color: 'bg-amber-600', text: 'Requiere experiencia' },
    avanzado: { color: 'bg-red-600', text: 'Solo para expertos' }
  }
  return badges[level || 'principiante'] || badges['principiante']
}

async function fetchExercise(id: string): Promise<Exercise | null> {
  const baseUrl = process.env.EXERCISES_API_URL || 'http://localhost:8000/suggest'
  const res = await fetch(`${baseUrl}/exercises/${id}`)
  if (!res.ok) return null
  return res.json()
}

export default async function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exercise = await fetchExercise(id)
  if (!exercise) return notFound()

  return (
    <div className="bg-background-secondary min-h-screen text-white">
      <main className="main__infoExercises max-w-3xl mx-auto px-4 py-8">
        <Link href="/exercises" className="cursor-pointer flex items-center gap-2 transition-colors hover:text-primary mb-6">
          <span className="text-lg">←</span>
          Volver a ejercicios
        </Link>
        <h1 className="text-4xl font-bold mb-2">{exercise.name}</h1>
        <p className="text-gray-200 font-light mb-6">
          {exercise.description || `${exercise.name} es un ejercicio fundamental para el desarrollo de ${exercise.group}, diseñado para mejorar tanto la fuerza como la técnica de ejecución.`}
        </p>
        <ExerciseImage
          src={getImageUrl(exercise)}
          alt={`Demostración de ${exercise.name}`}
          fallback={getPlaceholderImage(exercise.group)}
        />

        <section className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Información del Ejercicio</h2>
        <div className="flex flex-col gap-6">

            {/* Grupo muscular */}
            <div>
            <span className="block text-s text-gray-400 font-semibold mb-1">Grupo muscular principal: </span>
            <span className="inline-block bg-primary text-black font-semibold px-4 py-2 rounded-xl font-sans text-base">
                {exercise.group}
            </span>
            </div>

            {/* Músculos trabajados */}
            <div>
            <span className="block text-s text-gray-400 mb-1 font-semibold">Músculos trabajados: </span>
            <div className="flex flex-wrap gap-3">
                {exercise.muscles.map((muscle, idx) => (
                <span key={idx} className="bg-tertiary font-semibold border border-tertiary text-white px-4 py-2 rounded-xl text-base font-sans">
                    {muscle}
                </span>
                ))}
            </div>
            </div>

            {/* Objetivos */}
            {exercise.goal_tags && exercise.goal_tags.length > 0 && (
            <div>
                <span className="block text-s font-semibold text-gray-400 mb-1">Objetivos: </span>
                <div className="flex flex-wrap gap-3">
                {exercise.goal_tags.map((goal, idx) => (
                    <span key={idx} className="bg-primary text-black font-semibold px-4 py-2 rounded-xl text-base font-sans">
                    {goal}
                    </span>
                ))}
                </div>
            </div>
            )}

            {/* Equipamiento */}
            {exercise.equipment && exercise.equipment.length > 0 && (
            <div>
                <span className="block text-s font-semibold text-gray-400 mb-1">Equipamiento necesario: </span>
                <div className="flex flex-wrap gap-3">
                {exercise.equipment.map((item, idx) => (
                    <span key={idx} className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-xl text-base font-sans">
                    {item}
                    </span>
                ))}
                </div>
            </div>
            )}

            {/* Nivel de dificultad */}
            {exercise.level && (
            <div>
                <span className="block text-s font-semibold text-gray-400 mb-1">Nivel de dificultad: </span>
                <span className={`inline-block px-4 py-2 rounded-xl text-black font-semibold font-sans text-base ${getLevelBadge(exercise.level).color}`}>
                {getLevelBadge(exercise.level).text}
                </span>
            </div>
            )}
        </div>
        </section>

        {/* Técnica de ejecución */}
        {exercise.cues && exercise.cues.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Técnica de Ejecución</h2>
            <div className="bg-background border border-primary/20 rounded-xl p-6 shadow-lg">
              <ol className="space-y-4 text-gray-200">
                {exercise.cues.map((cue, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-background text-sm rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-white pt-1">{cue}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}