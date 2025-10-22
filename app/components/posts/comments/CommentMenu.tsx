'use client'

interface CommentMenuProps {
  commentId: string
  isOpen: boolean
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export default function CommentMenu({ 
  commentId, 
  isOpen, 
  onEdit, 
  onDelete, 
  onClose 
}: CommentMenuProps) {
  if (!isOpen) return null

  return (
    <div className="absolute right-8 -top-3 w-32 bg-background-secondary 
                   rounded-lg shadow-xl border border-gray-700/50 py-1 z-10
                   animate-in slide-in-from-right-2 fade-in duration-200">
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary 
                   hover:bg-tertiary transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Editar
      </button>
      <button
        onClick={onDelete}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 
                   hover:bg-red-500/10 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Eliminar
      </button>
    </div>
  )
}