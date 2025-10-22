'use client'

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import ReactionBar from "./ReactionBar"
import { ReactionsByType, Reaction, ReactionType } from "@/lib/graphql/posts"
import { cn } from "@/lib/utils"

interface PostInteractionBarProps {
  reactionsByType?: ReactionsByType[]
  currentUserReaction?: Reaction | null
  onToggleReaction: (type: ReactionType) => void
  onOpenComments: () => void
  disabled?: boolean
  size?: "sm" | "default" | "lg"
  variant?: "default" | "compact" | "spacious"
}

export default function PostInteractionBar({
  reactionsByType = [],
  currentUserReaction = null,
  onToggleReaction,
  onOpenComments,
  disabled = false,
  size = "default",
  variant = "default",
}: PostInteractionBarProps) {
  const variantClasses = {
    default: "mt-3",
    compact: "mt-2",
    spacious: "mt-4",
  }

  return (
    <div className={cn("flex gap-3", variantClasses[variant])}>
      <ReactionBar
        reactionsByType={reactionsByType}
        currentUserReaction={currentUserReaction}
        onToggleReaction={onToggleReaction}
        disabled={disabled}
        size={size}
      />

      <Button
        variant="ghost"
        size={size}
        onClick={(e) => {
          e.stopPropagation()
          onOpenComments()
        }}
        disabled={disabled}
        className="flex-1 group relative overflow-hidden"
        aria-label="Open comments"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

        <span className="relative flex items-center gap-2">
          <MessageCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-semibold">Comentar</span>
        </span>
      </Button>
    </div>
  )
}
