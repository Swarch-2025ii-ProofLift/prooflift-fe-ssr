'use client'

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import PostHeader from "./shared/PostHeader"
import PostExercises from "./shared/PostExercises"
import PostStats from "./shared/PostStats"
import PostInteractionBar from "./PostInteractionBar"
import { Post, ReactionsByType, Reaction, ReactionType } from "@/lib/graphql/posts"
import { cn } from "@/lib/utils"

interface PostItemProps {
  post: Post
  totalComments?: number
  totalReactions?: number
  reactionsByType?: ReactionsByType[]
  currentUserReaction?: Reaction | null
  onToggleReaction?: (type: ReactionType) => void
  onOpenComments?: () => void
  onUserClick?: (userId: string) => void
  onExerciseClick?: (exerciseId: string) => void
  onReactionsClick?: () => void
  loading?: boolean
  variant?: "default" | "compact" | "grid"
}

export default function PostItem({
  post,
  totalComments = 0,
  totalReactions = 0,
  reactionsByType = [],
  currentUserReaction = null,
  onToggleReaction,
  onOpenComments,
  onUserClick,
  onExerciseClick,
  onReactionsClick,
  loading = false,
  variant = "default",
}: PostItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldTruncate = post.body && post.body.length > 200
  const displayBody = useMemo(() => {
    if (!post.body) return ""
    return shouldTruncate && !isExpanded ? post.body.substring(0, 200) + "..." : post.body
  }, [post.body, shouldTruncate, isExpanded])

  if (loading) {
    return <PostItemSkeleton />
  }

  return (
    <article
      className={cn(
        "w-full p-4 md:p-6 bg-card rounded-xl flex flex-col gap-4",
        "shadow-lg hover:shadow-xl transition-all duration-300 ease-out",
        "hover:transform hover:scale-[1.01] border border-border",
        "hover:border-primary/20 group cursor-pointer"
      )}
      role="article"
      aria-label={`Post by ${post.userId}`}
      onClick={() => onOpenComments?.()}
    >
      {/* Header */}
      <PostHeader
        userId={post.userId}
        createdAt={post.createdAt}
        updatedAt={post.updatedAt}
        onUserClick={onUserClick}
        compact={variant === "compact"}
      />

      {/* Body */}
      <div className="text-foreground text-base leading-relaxed">
        <p className="break-words whitespace-pre-wrap">{displayBody}</p>
        {shouldTruncate && (
          <Button
            variant="link"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded((prev) => !prev)
            }}
            className="h-auto p-0 mt-2 text-primary hover:text-primary/80 font-medium"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Ver menos" : "Ver mas"}
          </Button>
        )}
      </div>

      {/* Exercises */}
      {post.exerciseIds && post.exerciseIds.length > 0 && (
        <PostExercises
          exerciseIds={post.exerciseIds}
          onExerciseClick={onExerciseClick}
          compact={variant === "compact"}
        />
      )}

      {/* Separator */}
      <Separator className="my-1" />

      {/* Stats */}
      <PostStats
        totalReactions={totalReactions}
        totalComments={totalComments}
        reactionsByType={reactionsByType}
        onReactionsClick={onReactionsClick}
        onCommentsClick={onOpenComments}
        compact={variant === "compact"}
      />

      {/* Interaction Bar */}
      {onToggleReaction && onOpenComments && (
        <PostInteractionBar
          reactionsByType={reactionsByType}
          currentUserReaction={currentUserReaction}
          onToggleReaction={onToggleReaction}
          onOpenComments={onOpenComments}
          variant={variant === "compact" ? "compact" : "default"}
        />
      )}
    </article>
  )
}

function PostItemSkeleton() {
  return (
    <div
      className={cn(
        "w-full p-4 md:p-6 bg-card rounded-xl flex flex-col gap-4",
        "shadow-lg border border-border"
      )}
    >
      {/* Header Skeleton */}
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Exercises Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>

      <Separator className="my-1" />

      {/* Stats Skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Interaction Bar Skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  )
}
