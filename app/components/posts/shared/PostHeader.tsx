'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUserName } from "@/lib/hooks/useUserName"
import { useRelativeTime } from "@/lib/hooks/useRelativeTime"
import { Skeleton } from "@/components/ui/skeleton"

interface PostHeaderProps {
  userId: string
  createdAt: string
  updatedAt?: string
  onUserClick?: (userId: string) => void
  compact?: boolean
}

export default function PostHeader({
  userId,
  createdAt,
  updatedAt,
  onUserClick,
  compact = false,
}: PostHeaderProps) {
  const { userName, loading: userLoading } = useUserName(userId)
  const createdTimeAgo = useRelativeTime(createdAt)
  const updatedTimeAgo = useRelativeTime(updatedAt || createdAt)

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  const showEditedLabel = updatedAt && createdAt !== updatedAt

  return (
    <div className={`flex items-start gap-3 ${compact ? "flex-row" : "flex-col sm:flex-row sm:justify-between"}`}>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          {userLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onUserClick?.(userId)
              }}
              className="h-auto p-0 font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              @{userName || userId}
            </Button>
          )}

          <time
            dateTime={createdAt}
            className="text-xs text-muted-foreground"
          >
            {createdTimeAgo}
          </time>
        </div>
      </div>

      {showEditedLabel && !compact && (
        <time
          dateTime={updatedAt}
          className="text-xs text-muted-foreground opacity-75 self-end sm:self-start"
        >
          Editado {updatedTimeAgo}
        </time>
      )}
    </div>
  )
}
