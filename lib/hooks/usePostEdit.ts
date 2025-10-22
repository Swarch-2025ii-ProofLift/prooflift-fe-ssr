import { useState, useCallback } from "react"
import { useMutation } from "@apollo/client/react"
import { UPDATE_POST, DELETE_POST, Post } from "@/lib/graphql/posts"

interface UsePostEditProps {
  post?: Post
  onEditComplete?: () => void
  onDeleteComplete?: () => void
}

export function usePostEdit({ post, onEditComplete, onDeleteComplete }: UsePostEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState("")
  const [editSelectedExercises, setEditSelectedExercises] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [updatePost, { loading: updateLoading }] = useMutation(UPDATE_POST, {
    onCompleted: () => {
      setIsEditing(false)
      setEditBody("")
      setEditSelectedExercises([])
      onEditComplete?.()
    },
    onError: (error) => console.error("Error updating post:", error),
  })

  const [deletePost, { loading: deleteLoading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      setShowDeleteConfirm(false)
      onDeleteComplete?.()
    },
    onError: (error) => console.error("Error deleting post:", error),
  })

  const handleStartEdit = useCallback(() => {
    if (post) {
      setEditBody(post.body || "")
      setEditSelectedExercises(post.exerciseIds || [])
      setIsEditing(true)
    }
  }, [post])

  const handleSaveEdit = useCallback(
    async (postId: string) => {
      if (!editBody.trim()) return

      await updatePost({
        variables: {
          postId,
          body: editBody.trim(),
          exerciseIds: editSelectedExercises,
        },
      })
    },
    [editBody, editSelectedExercises, updatePost]
  )

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditBody("")
    setEditSelectedExercises([])
  }, [])

  const handleDeletePost = useCallback(
    async (postId: string) => {
      await deletePost({ variables: { postId } })
    },
    [deletePost]
  )

  return {
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
  }
}
