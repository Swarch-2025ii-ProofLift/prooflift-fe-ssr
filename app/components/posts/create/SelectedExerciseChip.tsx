'use client'

interface SelectedExerciseChipProps {
  name: string;
  onRemove: () => void;
}

export default function SelectedExerciseChip({ name, onRemove }: SelectedExerciseChipProps) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-background 
                   rounded-full text-sm font-medium shadow-md hover:shadow-lg
                   transition-all duration-200 hover:scale-105">
      {name}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 w-4 h-4 flex items-center justify-center rounded-full
                 hover:bg-background/20 transition-colors group"
        aria-label={`Remove ${name}`}
      >
        <svg className="w-3 h-3 group-hover:scale-110 transition-transform" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
