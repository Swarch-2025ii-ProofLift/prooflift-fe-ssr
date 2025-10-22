'use client'

import { useState, useCallback, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@apollo/client/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Loader2, MoreVertical, Pencil, Trash2, X } from "lucide-react"
import PostHeader from "./shared/PostHeader"
import PostExercises from "./shared/PostExercises"
import PostStats from "./shared/PostStats"
import PostInteractionBar from "./PostInteractionBar"
import DeleteConfirmModal from "./shared/DeleteConfirmModal"
import ReactionsDetail from "./ReactionsDetail"
import CommentSection from "./comments/CommentSection"
import ExerciseSelector from "./create/ExerciseSelector"
import SelectedExerciseChip from "./create/SelectedExerciseChip"
import {
  GET_POST_DETAIL,
  GetPostDetailData,
  type ReactionType,
} from "@/lib/graphql/posts"
import { usePostReactions } from "@/lib/hooks/usePostReactions"
import { usePostEdit } from "@/lib/hooks/usePostEdit"
import { useExerciseCache } from "@/lib/contexts/ExerciseCacheContext"

interface PostDetailProps {
  open: boolean
  onClose: () => void
  postId: string
  currentUserId?: string
  onDelete?: () => void
}

export default function PostDetail({
  open,
  onClose,
  postId,
  currentUserId,
  onDelete,
}: PostDetailProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showReactionsModal, setShowReactionsModal] = useState(false)
  const [isBodyExpanded, setIsBodyExpanded] = useState(false)
  const [exerciseMap, setExerciseMap] = useState<Record<string, string>>({})

  const { data, loading, error, refetch } = useQuery<GetPostDetailData>(GET_POST_DETAIL, {
    variables: { postId, skip: 0, limit: 50 },
    skip: !postId || !open,
    fetchPolicy: "cache-and-network",
  })

  const post = data?.getAggregatedPostById?.post
  const { getExercise, fetchExercises } = useExerciseCache()

  const {
    isEditing,
    editBody,
    editSelectedExercises,
    showDeleteConfirm,
    updateLoading,
    deleteLoading,
    setEditBody,
    setEditSelectedExercises,
    setShowDeleteConfirm,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDeletePost,
  } = usePostEdit({
    post,
    onEditComplete: () => refetch(),
    onDeleteComplete: () => {
      onDelete?.()
      onClose()
    },
  })

  const { handleToggleReaction } = usePostReactions({
    currentUserId,
    onCompleted: () => refetch(),
  })

  const comments = data?.getCommentsForPost || []
  const totalComments = data?.getAggregatedPostById?.totalComments || 0
  const totalReactions = useMemo(
    () =>
      data?.getAggregatedPostById?.reactionsByType?.reduce(
        (sum: number, r: { count: number }) => sum + r.count,
        0
      ) || 0,
    [data?.getAggregatedPostById?.reactionsByType]
  )
  const reactionsByType = data?.getAggregatedPostById?.reactionsByType || []
  const currentUserReaction = data?.getAggregatedPostById?.currentUserReaction || null
  const detailedReactions = data?.getReactionsForPost || []

  useEffect(() => {
    if (isEditing && editSelectedExercises.length > 0) {
      fetchExercises(editSelectedExercises).then(() => {
        const newExerciseMap: Record<string, string> = {}
        editSelectedExercises.forEach((id) => {
          const exercise = getExercise(id)
          if (exercise) {
            newExerciseMap[id] = exercise.name
          }
        })
        setExerciseMap(newExerciseMap)
      })
    } else if (!isEditing) {
      setExerciseMap({})
    }
  }, [isEditing, editSelectedExercises, fetchExercises, getExercise])

  const handleEditPost = useCallback(() => {
    handleStartEdit()
    setMenuOpen(false)
  }, [handleStartEdit])

  const toggleExercise = useCallback((exerciseId: string, exerciseName: string) => {
    setEditSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    )

    setExerciseMap((prev) => ({
      ...prev,
      [exerciseId]: exerciseName
    }))
  }, [setEditSelectedExercises])

  const getExerciseName = useCallback((exerciseId: string) => {
    return exerciseMap[exerciseId] || exerciseId
  }, [exerciseMap])

  const handleReactionToggle = useCallback(
    (type: ReactionType) => {
      handleToggleReaction(postId, type, currentUserReaction)
    },
    [handleToggleReaction, postId, currentUserReaction]
  )

  const handleScrollToComments = useCallback(() => {
    const commentSection = document.getElementById("comment-section")
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const handleExerciseClick = useCallback((exerciseId: string) => {
    router.push(`/exercises/${exerciseId}`)
    onClose()
  }, [router, onClose])

  const handleUserClick = useCallback((userId: string) => {
    console.log("Navigate to user:", userId)
    // TODO: Implement navigation
  }, [])

  const isOwner = post?.userId === currentUserId

  const shouldTruncateBody = post?.body && post.body.length > 500
  const displayBody = useMemo(() => {
    if (!post?.body) return ""
    return shouldTruncateBody && !isBodyExpanded
      ? post.body.substring(0, 500) + "..."
      : post.body
  }, [post?.body, shouldTruncateBody, isBodyExpanded])

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 bg-card [&>button]:hidden">
          {/* Header */}
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle>Publicación</DialogTitle>
              <div className="flex items-center gap-2">
                {/* Edit menu button (only for owner) */}
                {isOwner && !isEditing && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="h-8 w-8"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>

                    {menuOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[160px] overflow-hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditPost}
                          className="w-full justify-start"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowDeleteConfirm(true)
                            setMenuOpen(false)
                          }}
                          className="w-full justify-start text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {/* Custom close button */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && !post ? (
              <LoadingState />
            ) : error && !post ? (
              <ErrorState error={error} onRetry={() => refetch()} />
            ) : post ? (
              <div className="space-y-6">
                {/* Post Header */}
                <PostHeader
                  userId={post.userId}
                  createdAt={post.createdAt}
                  updatedAt={post.updatedAt}
                  onUserClick={handleUserClick}
                />

                {/* Post Body */}
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="min-h-[120px] resize-none"
                      placeholder="Escribe tu publicación..."
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault()
                          if (editBody.trim()) {
                            handleSaveEdit(postId)
                          }
                        }
                      }}
                    />

                    {/* Selected exercises */}
                    {editSelectedExercises.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-muted-foreground text-sm font-medium">Ejercicios seleccionados:</label>
                        <div className="flex flex-wrap gap-2">
                          {editSelectedExercises.map((id) => (
                            <SelectedExerciseChip
                              key={id}
                              name={getExerciseName(id)}
                              onRemove={() => toggleExercise(id, getExerciseName(id))}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exercise selector */}
                    <ExerciseSelector
                      selectedExercises={editSelectedExercises}
                      onToggleExercise={toggleExercise}
                      getExerciseName={getExerciseName}
                    />

                    <p className="text-xs text-muted-foreground">
                      Presiona {typeof navigator !== 'undefined' && navigator.userAgent.includes("Mac") ? "Cmd" : "Ctrl"} + Enter para guardar
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={updateLoading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => handleSaveEdit(postId)}
                        disabled={updateLoading || !editBody.trim()}
                      >
                        {updateLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          "Guardar cambios"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-foreground text-base leading-relaxed">
                    <p className="whitespace-pre-wrap break-words">{displayBody}</p>
                    {shouldTruncateBody && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setIsBodyExpanded((prev) => !prev)}
                        className="h-auto p-0 mt-2 text-primary hover:text-primary/80 font-medium"
                        aria-expanded={isBodyExpanded}
                      >
                        {isBodyExpanded ? "Ver menos" : "Ver más"}
                      </Button>
                    )}
                  </div>
                )}

                {/* Exercises */}
                {!isEditing && post.exerciseIds && post.exerciseIds.length > 0 && (
                  <PostExercises
                    exerciseIds={post.exerciseIds}
                    onExerciseClick={handleExerciseClick}
                  />
                )}

                <Separator />

                {/* Stats */}
                <PostStats
                  totalReactions={totalReactions}
                  totalComments={totalComments}
                  reactionsByType={reactionsByType}
                  onReactionsClick={() => setShowReactionsModal(true)}
                  onCommentsClick={handleScrollToComments}
                />

                {/* Interaction Bar */}
                <PostInteractionBar
                  reactionsByType={reactionsByType}
                  currentUserReaction={currentUserReaction}
                  onToggleReaction={handleReactionToggle}
                  onOpenComments={handleScrollToComments}
                  disabled={isEditing}
                />

                <Separator />

                {/* Comments Section */}
                <div id="comment-section">
                  <CommentSection
                    postId={postId}
                    comments={comments}
                    currentUserId={currentUserId}
                    refetch={refetch}
                    disabled={isEditing}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => handleDeletePost(postId)}
        loading={deleteLoading}
        type="post"
      />

      {/* Reactions Detail */}
      {showReactionsModal && (
        <ReactionsDetail
          open={showReactionsModal}
          onClose={() => setShowReactionsModal(false)}
          postId={postId}
          reactionsByType={reactionsByType}
          totalReactions={totalReactions}
          detailedReactions={detailedReactions}
        />
      )}
    </>
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-7 w-20" />
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Error al cargar</h3>
      <p className="text-muted-foreground text-sm mb-4">{error.message}</p>
      <Button onClick={onRetry} variant="outline">
        Intentar de nuevo
      </Button>
    </div>
  )
}
