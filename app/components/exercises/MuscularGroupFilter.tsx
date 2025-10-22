'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface MuscularGroupButtonProps {
  groupName: string
  isSelected?: boolean
  onClick?: (groupName: string) => void
}

function MuscularGroupButton({
  groupName,
  isSelected = false,
  onClick,
}: MuscularGroupButtonProps) {
  return (
    <button
      className={`px-6 py-2 font-sans rounded-full transition-all duration-300 shrink-0 cursor-pointer 
      hover:scale-95 ${
        isSelected
          ? 'bg-primary text-black shadow-lg rounded-full'
          : 'text-white border border-white '
      }`}
      onClick={() => onClick?.(groupName)}
    >
      {groupName}
    </button>
  )
}

const muscularGroups = ['pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core']

export function MuscularGroupFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedGroup = searchParams.get('group')

  const handleGroupClick = (groupName: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (groupName === 'todos') {
      params.delete('group')
    } else {
      params.set('group', groupName.toLowerCase())
    }
    
    router.push(`/exercises?${params.toString()}`)
  }

  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
      <MuscularGroupButton
        key="todos"
        groupName="Todos"
        isSelected={!selectedGroup}
        onClick={() => handleGroupClick('todos')}
      />
      
      {muscularGroups.map((group) => (
        <MuscularGroupButton
          key={group}
          groupName={group.charAt(0).toUpperCase() + group.slice(1)}
          isSelected={selectedGroup === group}
          onClick={handleGroupClick}
        />
      ))}
    </div>
  )
}