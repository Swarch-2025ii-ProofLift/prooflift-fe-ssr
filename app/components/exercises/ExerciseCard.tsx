'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ExerciseCardProps {
  id: string
  title: string
  bodyPart: string
}

export function ExerciseCard({ id, title, bodyPart }: ExerciseCardProps) {
  const router = useRouter()

  const placeholders: Record<string, string> = {
    pecho: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    espalda: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop',
    piernas: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&h=300&fit=crop',
    hombros: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop',
    brazos: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    core: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  }

  const getPlaceholderImage = (group: string): string => {
    return placeholders[group.toLowerCase()] || placeholders['piernas']
  }

  const handleCardClick = () => {
    router.push(`/exercises/${id}`)
  }

  return (
    <div
      className="group relative bg-black dark:bg-black rounded-xl overflow-hidden 
      hover:shadow-xl transition-all duration-300 cursor-pointer h-full
      flex flex-col border border-gray-600 dark:border-gray-700"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-56 overflow-hidden bg-gray-700">
        <Image
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={getPlaceholderImage(bodyPart)}
          alt={`Imagen de ${title}`}
          width={400}
          height={300}
          priority={false}
          unoptimized={true}
        />
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Contenido */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold text-white mb-2 line-clamp-2">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gray-700 rounded-full capitalize">
              {bodyPart}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            Haz clic para ver detalles
          </p>
        </div>
      </div>
    </div>
  )
}