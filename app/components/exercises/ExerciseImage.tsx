'use client'

import { useState } from 'react'

export function ExerciseImage({ src, alt, fallback }: { src: string, alt: string, fallback: string }) {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <img
      className="w-full h-auto object-fit rounded-2xl lg:h-120"
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
    />
  )
}