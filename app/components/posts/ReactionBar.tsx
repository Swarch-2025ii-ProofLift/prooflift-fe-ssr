'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { REACTIONS } from "@/lib/constants/reactions"
import { ReactionsByType, Reaction, ReactionType } from "@/lib/graphql/posts"
import { cn } from "@/lib/utils"

interface ReactionBarProps {
  reactionsByType?: ReactionsByType[]
  currentUserReaction?: Reaction | null
  onToggleReaction: (type: ReactionType) => void
  disabled?: boolean
  size?: "sm" | "default" | "lg"
}

export default function ReactionBar({
  reactionsByType = [],
  currentUserReaction = null,
  onToggleReaction,
  disabled = false,
  size = "default",
}: ReactionBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])

  function handleMouseEnter() {
    if (disabled) return
    clearTimeout(timeoutRef.current)
    setIsExpanded(true)
  }

  function handleMouseLeave() {
    if (disabled) return
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 300)
  }

  function handleReactionClick(e: React.MouseEvent, type: ReactionType) {
    e.stopPropagation()
    if (disabled) return
    setSelectedReaction(type)
    onToggleReaction(type)
    setTimeout(() => {
      setSelectedReaction(null)
      setIsExpanded(false)
    }, 150)
  }

  function handleMainButtonClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (disabled) return

    if (currentUserReaction) {
      onToggleReaction(currentUserReaction.type)
    } else {
      setIsExpanded((prev) => !prev)
    }
  }

  function getReactionCount(type: ReactionType): number {
    const reaction = reactionsByType.find((r) => r.type === type)
    return reaction ? reaction.count : 0
  }

  const currentReaction = REACTIONS.find(
    (r) => r.type === currentUserReaction?.type
  )
  const mainButtonText = currentReaction?.label || "Reaccionar"
  const mainButtonAriaLabel = currentReaction?.ariaLabel || "React"
  const MainButtonIcon = currentReaction?.icon

  return (
    <div
      ref={containerRef}
      className="relative flex-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant="ghost"
        size={size}
        onClick={handleMainButtonClick}
        disabled={disabled}
        className={cn(
          "w-full group relative overflow-hidden",
          currentUserReaction && currentReaction?.color
        )}
        aria-label={
          currentUserReaction
            ? `Remove ${mainButtonAriaLabel} reaction`
            : "Add reaction"
        }
        aria-expanded={isExpanded}
        aria-haspopup="true"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

        <span className="relative flex items-center gap-2">
          {MainButtonIcon && <MainButtonIcon className="w-5 h-5" />}
          <span className="font-semibold">{mainButtonText}</span>

          {!currentUserReaction && (
            <svg
              className={cn(
                "w-4 h-4 transition-transform duration-200 opacity-60",
                isExpanded && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </span>
      </Button>

      {isExpanded && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                     bg-card backdrop-blur-sm rounded-xl shadow-2xl
                     border border-border z-50 min-w-max p-2
                     animate-in slide-in-from-bottom-2 fade-in duration-200"
          role="menu"
          aria-label="Reaction options"
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-card border-r border-b border-border transform rotate-45 -mt-1.5" />
          </div>

          {/* Reactions */}
          <div className="flex gap-1">
            {REACTIONS.map(({ type, ariaLabel, icon: Icon, color, bgColor, ringColor }) => {
              const isSelected = currentUserReaction?.type === type
              const count = getReactionCount(type)

              return (
                <button
                  key={type}
                  onClick={(e) => handleReactionClick(e, type)}
                  className={cn(
                    "group/reaction relative px-3 py-2 rounded-lg font-semibold text-sm",
                    "transition-all duration-200 flex flex-col items-center gap-1",
                    "hover:transform hover:scale-110 hover:-translate-y-1",
                    "focus:outline-none focus:ring-2",
                    isSelected
                      ? `${bgColor} shadow-md ring-2 ${ringColor}`
                      : "hover:bg-primary/10"
                  )}
                  role="menuitem"
                  aria-label={`${isSelected ? "Remove" : "Add"} ${ariaLabel} reaction`}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-200",
                      selectedReaction === type && "animate-bounce",
                      color
                    )}
                  />

                  {count > 0 && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center",
                      `${bgColor} ${color}`
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Hint */}
          <div className="mt-2 pt-2 border-t border-border text-center">
            <span className="text-xs text-muted-foreground">
              Haz clic para reaccionar
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
