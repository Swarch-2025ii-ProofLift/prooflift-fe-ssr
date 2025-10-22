'use client'

import { Button } from "@/components/ui/button"
import { getReactionConfig } from "@/lib/constants/reactions"
import { ReactionsByType } from "@/lib/graphql/posts"
import { MessageCircle } from "lucide-react"

interface PostStatsProps {
  totalReactions: number
  totalComments: number
  reactionsByType: ReactionsByType[]
  onReactionsClick?: () => void
  onCommentsClick?: () => void
  compact?: boolean
}

export default function PostStats({
  totalReactions,
  totalComments,
  reactionsByType = [],
  onReactionsClick,
  onCommentsClick,
  compact = false,
}: PostStatsProps) {
  const hasReactions = totalReactions > 0
  const hasComments = totalComments > 0

  if (!hasReactions && !hasComments) {
    return null
  }

  return (
    <div className={`flex ${compact ? 'gap-3' : 'justify-between'} items-center text-sm text-muted-foreground`}>
      {/* Reactions */}
      {hasReactions ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onReactionsClick?.()
          }}
          className="h-auto p-0 hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {reactionsByType.slice(0, 3).map(({ type }) => {
                const config = getReactionConfig(type)
                const Icon = config?.icon
                return (
                  <span
                    key={type}
                    className="inline-flex items-center justify-center w-6 h-6 bg-card rounded-full border-2 border-background transition-transform hover:scale-110"
                    title={config?.ariaLabel || type}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${config.color}`} />}
                  </span>
                )
              })}
              {reactionsByType.length > 3 && (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-muted rounded-full border-2 border-background text-xs font-medium">
                  +{reactionsByType.length - 3}
                </span>
              )}
            </div>

            <span className="font-medium hover:underline">
              {totalReactions}
            </span>
          </div>
        </Button>
      ) : (
        <div />
      )}

      {/* Comments */}
      {hasComments && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onCommentsClick?.()
          }}
          className="h-auto p-0 hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium hover:underline">
              {totalComments}
            </span>
            {!compact && (
              <span className="hidden sm:inline text-xs">
                {totalComments === 1 ? "comentario" : "comentarios"}
              </span>
            )}
          </div>
        </Button>
      )}
    </div>
  )
}
