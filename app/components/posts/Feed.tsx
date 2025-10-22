'use client'

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus } from "lucide-react"
import PostItem from "./PostItem"
import CreatePost from "./create/CreatePost"
import PostDetail from "./PostDetail"
import ReactionsDetail from "./ReactionsDetail"
import {
  GET_AGGREGATED_POSTS,
  AggregatedPost,
  GetAggregatedPostsData,
} from "@/lib/graphql/posts"
import { usePostReactions } from "@/lib/hooks/usePostReactions"
import { usePostFilters } from "@/lib/hooks/usePostFilters"
import { useFeedRefetch } from "@/lib/hooks/useFeedRefetch"
import { cn } from "@/lib/utils"

interface FeedProps {
  currentUserId?: string
  limit?: number
  showCreateButton?: boolean
  layout?: "default" | "compact" | "grid"
  filter?: "all" | "recent" | "popular"
}

export default function Feed({
  currentUserId,
  limit = 100,
  showCreateButton = true,
  layout = "default",
  filter = "all",
}: FeedProps) {
  const router = useRouter()
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [reactionsModalPost, setReactionsModalPost] = useState<AggregatedPost | null>(null)
  const { registerRefetch, unregisterRefetch } = useFeedRefetch()

  const { data, loading, error, refetch } = useQuery<GetAggregatedPostsData>(GET_AGGREGATED_POSTS, {
    variables: { skip: 0, limit },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    registerRefetch(() => refetch())
    return () => unregisterRefetch()
  }, [refetch, registerRefetch, unregisterRefetch])

  const { handleToggleReaction } = usePostReactions({
    currentUserId,
    onCompleted: () => refetch(),
  })

  const handleUserClick = useCallback((userId: string) => {
    console.log("Navigate to user:", userId)
    // TODO: Implement navigation to user profile
  }, [])

  const handleExerciseClick = useCallback((exerciseId: string) => {
    router.push(`/exercises/${exerciseId}`)
  }, [router])

  const handlePostCreated = useCallback(() => {
    refetch()
  }, [refetch])

  const handleScrollToCreate = useCallback(() => {
    const createPostElement = document.querySelector(".create-post-component")
    if (createPostElement) {
      createPostElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      setTimeout(() => {
        const textarea = createPostElement.querySelector("textarea")
        if (textarea) {
          textarea.focus()
        }
      }, 300)
    }
  }, [])

  const layoutClasses = useMemo(() => {
    switch (layout) {
      case "compact":
        return "flex flex-col gap-4 max-w-4xl mx-auto"
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
      default:
        return "flex flex-col gap-6 max-w-4xl mx-auto"
    }
  }, [layout])

  const posts = data?.getAggregatedPost as AggregatedPost[] || []
  const filteredPosts = usePostFilters(posts, filter)

  if (error && !data) {
    return (
      <div className="feed flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-card rounded-xl p-6 max-w-md border border-border">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error al cargar el feed</h3>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>Intentar de nuevo</Button>
        </div>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="feed p-4 lg:p-6">
        <div className={layoutClasses}>
          {Array.from({ length: 3 }).map((_, index) => (
            <PostItem
              key={`skeleton-${index}`}
              post={{ id: "", userId: "", body: "", exerciseIds: [], createdAt: "", updatedAt: "" }}
              loading={true}
              variant={layout === "grid" ? "grid" : layout}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="feed">
      {/* Create Post */}
      {showCreateButton && (
        <div className="max-w-4xl mx-auto mb-8">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Posts Container */}
      <div className={layoutClasses}>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-card rounded-xl p-8 max-w-md mx-auto border border-border">
              <svg
                className="w-16 h-16 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2">No hay publicaciones</h3>
              <p className="text-muted-foreground mb-4">
                Sé el primero en compartir algo con la comunidad
              </p>
            </div>
          </div>
        ) : (
          filteredPosts.map((aggregatedPost: AggregatedPost) => {
            const {
              post,
              totalComments,
              totalReactions,
              reactionsByType,
              currentUserReaction,
            } = aggregatedPost

            return (
              <PostItem
                key={post.id}
                post={post}
                totalComments={totalComments}
                totalReactions={totalReactions}
                reactionsByType={reactionsByType}
                currentUserReaction={currentUserReaction}
                onToggleReaction={(type) =>
                  handleToggleReaction(post.id, type, currentUserReaction)
                }
                onOpenComments={() => setSelectedPostId(post.id)}
                onReactionsClick={() => setReactionsModalPost(aggregatedPost)}
                onUserClick={handleUserClick}
                onExerciseClick={handleExerciseClick}
                variant={layout === "grid" ? "grid" : layout}
              />
            )
          })
        )}
      </div>

      {/* Floating Action Button */}
      {showCreateButton && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            size="icon-lg"
            onClick={handleScrollToCreate}
            className={cn(
              "group shadow-lg hover:shadow-xl",
              "transition-all duration-300 hover:scale-110"
            )}
            aria-label="Ir a crear publicaci�n"
            title="Crear publicaci�n"
          >
            <Plus className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
          </Button>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetail
          open={!!selectedPostId}
          onClose={() => {
            setSelectedPostId(null)
            refetch()
          }}
          postId={selectedPostId}
          currentUserId={currentUserId}
          onDelete={() => {
            setSelectedPostId(null)
            refetch()
          }}
        />
      )}

      {/* Reactions Detail Modal */}
      {reactionsModalPost && (
        <ReactionsDetail
          open={!!reactionsModalPost}
          onClose={() => setReactionsModalPost(null)}
          postId={reactionsModalPost.post.id}
          reactionsByType={reactionsModalPost.reactionsByType}
          totalReactions={reactionsModalPost.totalReactions}
        />
      )}
    </div>
  )
}
