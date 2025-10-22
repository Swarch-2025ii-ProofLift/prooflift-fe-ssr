'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  initialValue?: string
}

export function SearchBar({ initialValue = '' }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (query.trim()) {
        params.append('q', query)
      }
      router.push(`/exercises?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timer)
  }, [query, router])

  return (
    <form className="w-full mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-500 dark:border-gray-600 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-600 
          dark:bg-black dark:text-white bg-black text-white
          transition-all"
        />
      </div>
    </form>
  )
}