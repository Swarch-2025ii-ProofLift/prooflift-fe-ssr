'use client'

import { useState, useCallback } from "react"
import { useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { Loader2, MessageCircle, Send } from "lucide-react"
import CommentItem from "./CommentItem"
import DeleteConfirmModal from "../shared/DeleteConfirmModal"
import {
  ADD_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  Comment,
} from "@/lib/graphql/posts"

interface CommentSectionProps {
  postId: string
  comments?: Comment[]
  currentUserId?: string
  refetch: () => void
  disabled?: boolean
  maxHeight?: string
}

export default function CommentSection({
  postId,
  comments = [],
  currentUserId,
  refetch,
  disabled = false,
  maxHeight = "400px",
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const [addComment, { loading: addingComment }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setNewComment("")
      refetch()
      setTimeout(() => {
        const commentsContainer = document.querySelector(".comments-container")
        if (commentsContainer) {
          commentsContainer.scrollTop = commentsContainer.scrollHeight
        }
      }, 100)
    },
    onError: (error) => console.error("Error adding comment:", error),
  })

  const [updateComment, { loading: updatingComment }] = useMutation(
    UPDATE_COMMENT,
    {
      onCompleted: () => {
        setEditingId(null)
        setEditBody("")
        refetch()
      },
      onError: (error) => console.error("Error updating comment:", error),
    }
  )

  const [deleteComment, { loading: deletingComment }] = useMutation(
    DELETE_COMMENT,
    {
      onCompleted: () => {
        setShowDeleteConfirm(null)
        refetch()
      },
      onError: (error) => console.error("Error deleting comment:", error),
    }
  )

  const handleAddComment = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!newComment.trim() || disabled) return
      await addComment({ variables: { postId, body: newComment.trim() } })
    },
    [newComment, disabled, addComment, postId]
  )

  const handleStartEdit = useCallback((commentId: string, body: string) => {
    setEditingId(commentId)
    setEditBody(body)
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editBody.trim()) return
    await updateComment({
      variables: { commentId: editingId, body: editBody.trim() },
    })
  }, [editBody, editingId, updateComment])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setEditBody("")
  }, [])

  const handleDeleteComment = useCallback(async () => {
    if (!showDeleteConfirm) return
    await deleteComment({ variables: { commentId: showDeleteConfirm } })
  }, [deleteComment, showDeleteConfirm])

  const handleUserClick = useCallback((userId: string) => {
    console.log("Navigate to user:", userId)
    // TODO: Implement navigation
  }, [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">
          Comentarios ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div
          className="comments-container space-y-3 overflow-y-auto pr-2 scrollbar-thin"
          style={{ maxHeight }}
        >
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isEditing={editingId === comment.id}
              editBody={editBody}
              onEditBodyChange={setEditBody}
              onStartEdit={() => handleStartEdit(comment.id, comment.body)}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onDelete={() => setShowDeleteConfirm(comment.id)}
              onUserClick={handleUserClick}
              updating={updatingComment}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No hay comentarios aún</p>
          <p className="text-xs mt-1">Sé el primero en comentar</p>
        </div>
      )}

      {/* New Comment Form */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          disabled={disabled || addingComment}
          className="resize-none min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleAddComment(e)
            }
          }}
        />

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Presiona {navigator.platform.includes("Mac") ? "Cmd" : "Ctrl"} +
            Enter para enviar
          </p>

          <Button
            type="submit"
            disabled={!newComment.trim() || disabled || addingComment}
            size="sm"
          >
            {addingComment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Comentar
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDeleteComment}
        loading={deletingComment}
        type="comment"
      />
    </div>
  )
}
