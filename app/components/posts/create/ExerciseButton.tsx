'use client'

interface Exercise {
  name: string;
  muscles?: string[];
  group?: string;
  id?: string;
}

interface ExerciseButtonProps {
  exercise: Exercise;
  isSelected: boolean;
  onClick: () => void;
}

export default function ExerciseButton({ exercise, isSelected, onClick }: ExerciseButtonProps) {
  const primaryMuscle = exercise.muscles?.[0] || exercise.group;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-4 rounded-xl text-sm font-medium transition-all duration-300
                 border flex flex-col items-start justify-between gap-2 text-left
                 min-h-[90px] group overflow-hidden
                 ${isSelected
                   ? 'bg-gradient-to-br from-primary to-primary/80 text-background border-primary/50 shadow-lg shadow-primary/20'
                   : 'bg-gradient-to-br from-tertiary/40 to-tertiary/20 text-primary border-gray-700/50 hover:border-primary/40 hover:shadow-md hover:from-tertiary/60 hover:to-tertiary/30'
                 }`}
      title={exercise.name}
    >
      {/* Background decoration */}
      <div className={`absolute inset-0 opacity-10 transition-opacity duration-300
                      ${isSelected ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-3xl transform translate-x-8 -translate-y-8"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-1 w-full">
        <span className="line-clamp-2 font-semibold leading-tight">
          {exercise.name}
        </span>
      </div>
      
      {/* Footer with muscle info and checkmark */}
      <div className="relative z-10 w-full flex items-center justify-between">
        {primaryMuscle && (
          <span className={`text-xs capitalize px-2 py-0.5 rounded-md font-medium
                          ${isSelected 
                            ? 'bg-background/20 text-background' 
                            : 'bg-primary/10 text-primary/80 group-hover:bg-primary/20'
                          }`}>
            {primaryMuscle}
          </span>
        )}
        
        {/* Checkmark indicator */}
        <div className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${isSelected 
                          ? 'bg-background/30 scale-100' 
                          : 'bg-gray-600/30 scale-0 group-hover:scale-100'
                        }`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      {/* Hover border glow effect */}
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300
                      ${isSelected 
                        ? 'opacity-0' 
                        : 'opacity-0 group-hover:opacity-100'
                      }`}
           style={{
             background: 'linear-gradient(135deg, transparent 0%, rgba(var(--primary-rgb, 59, 130, 246), 0.1) 100%)',
             pointerEvents: 'none'
           }}>
      </div>
    </button>
  );
}