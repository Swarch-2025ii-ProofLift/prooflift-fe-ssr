'use client'

import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { GET_POST_DETAIL, Reaction, ReactionsByType, GetPostDetailData } from "@/lib/graphql/posts"
import { getReactionConfig } from "@/lib/constants/reactions"
import { useUserNameCache } from "@/lib/contexts/UserNameCacheContext"
import { cn } from "@/lib/utils"

interface ReactionsDetailProps {
  open: boolean
  onClose: () => void
  postId: string
  reactionsByType: ReactionsByType[]
  totalReactions: number
  detailedReactions?: Reaction[] | null
}

export default function ReactionsDetail({
  open,
  onClose,
  postId,
  reactionsByType,
  totalReactions,
  detailedReactions = null,
}: ReactionsDetailProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const { getUserName, isLoading, fetchUserNames } = useUserNameCache()
  const [userNames, setUserNames] = useState<Record<string, string>>({})
  const [loadingUsers, setLoadingUsers] = useState(true)

  const { data, loading } = useQuery<GetPostDetailData>(GET_POST_DETAIL, {
    variables: { postId, skip: 0, limit: 1 },
    skip: !postId || detailedReactions !== null,
    fetchPolicy: "network-only",
  })

  const reactions = useMemo(() => {
    if (detailedReactions) {
      return detailedReactions
    }

    const queryReactions = data?.getReactionsForPost || []
    return queryReactions
  }, [detailedReactions, data])

  useEffect(() => {
    if (reactions.length === 0) {
      setLoadingUsers(false)
      return
    }

    const uniqueUserIds = [...new Set(reactions.map((r) => r.userId))]

    fetchUserNames(uniqueUserIds)

    const names: Record<string, string> = {}
    let anyLoading = false

    uniqueUserIds.forEach((userId) => {
      const name = getUserName(userId)
      if (name) {
        names[userId] = name
      } else {
        names[userId] = userId
      }
      if (isLoading(userId)) {
        anyLoading = true
      }
    })

    setUserNames(names)
    setLoadingUsers(anyLoading)

    if (anyLoading) {
      const interval = setInterval(() => {
        const updatedNames: Record<string, string> = {}
        let stillLoading = false

        uniqueUserIds.forEach((userId) => {
          const name = getUserName(userId)
          if (name) {
            updatedNames[userId] = name
          } else {
            updatedNames[userId] = userId
          }
          if (isLoading(userId)) {
            stillLoading = true
          }
        })

        setUserNames(updatedNames)
        setLoadingUsers(stillLoading)

        if (!stillLoading) {
          clearInterval(interval)
        }
      }, 500)

      return () => clearInterval(interval)
    }
  }, [reactions, getUserName, isLoading, fetchUserNames])

  const filteredReactions = useMemo(() => {
    if (selectedFilter === "all") return reactions
    return reactions.filter((r: Reaction) => r.type === selectedFilter)
  }, [reactions, selectedFilter])

  const reactionCounts = useMemo(() => {
    const counts: Record<string, number> = { all: reactions.length }
    reactions.forEach((r: Reaction) => {
      counts[r.type] = (counts[r.type] || 0) + 1
    })
    return counts
  }, [reactions])

  const handleUserClick = (userId: string) => {
    console.log("Navigate to user:", userId)
    // TODO: Implement navigation to user profile
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Reacciones ({totalReactions})</DialogTitle>
        </DialogHeader>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-4 border-b overflow-x-auto scrollbar-thin">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
            className={cn(
              "whitespace-nowrap",
              selectedFilter === "all" && "scale-105"
            )}
          >
            Todas
            <span className="ml-1.5 text-xs opacity-75">
              ({reactionCounts.all})
            </span>
          </Button>

          {reactionsByType.map(({ type, count }) => {
            const config = getReactionConfig(type)
            const Icon = config?.icon
            return (
              <Button
                key={type}
                variant={selectedFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(type)}
                className={cn(
                  "whitespace-nowrap gap-1.5",
                  selectedFilter === type && "scale-105"
                )}
              >
                {Icon && <Icon className={`w-4 h-4 ${selectedFilter === type ? '' : config?.color}`} />}
                <span className="font-medium">{config?.label}</span>
                <span className="text-xs opacity-75">({count})</span>
              </Button>
            )
          })}
        </div>

        {/* Reactions List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading || loadingUsers ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredReactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay reacciones de este tipo
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredReactions.map((reaction: Reaction) => {
                const config = getReactionConfig(reaction.type)
                const Icon = config?.icon
                const userName = userNames[reaction.userId] || reaction.userId
                const userInitials = userName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <div
                    key={reaction.id}
                    className="flex items-center justify-between p-3 rounded-lg
                             bg-card/50 hover:bg-card border hover:border-primary/20
                             transition-all duration-200 group"
                  >
                    <button
                      onClick={() => handleUserClick(reaction.userId)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                          @{userName}
                        </p>
                      </div>
                    </button>

                    {/* Reaction icon */}
                    <div className="ml-2 group-hover:scale-125 transition-transform">
                      {Icon && <Icon className={`w-6 h-6 ${config?.color}`} />}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
