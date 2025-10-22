'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserName } from "@/lib/hooks/useUserName"
import { useRelativeTime } from "@/lib/hooks/useRelativeTime"
import { Comment } from "@/lib/graphql/posts"
import { Loader2, MoreVertical, Pencil, Trash2, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommentItemProps {
  comment: Comment
  currentUserId?: string
  isEditing: boolean
  editBody: string
  onEditBodyChange: (value: string) => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
  onUserClick: (userId: string) => void
  updating?: boolean
}

export default function CommentItem({
  comment,
  currentUserId,
  isEditing,
  editBody,
  onEditBodyChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onUserClick,
  updating = false,
}: CommentItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { userName, loading: userLoading } = useUserName(comment.userId)
  const createdTimeAgo = useRelativeTime(comment.createdAt)

  const isOwner = comment.userId === currentUserId
  const showEditedLabel = comment.updatedAt && comment.createdAt !== comment.updatedAt
  const shouldTruncate = comment.body && comment.body.length > 200
  const displayBody = shouldTruncate && !isExpanded
    ? comment.body.substring(0, 200) + "..."
    : comment.body

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen])

  return (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-lg transition-all duration-200",
        "bg-card/50 hover:bg-card border border-transparent hover:border-border",
        isEditing && "bg-card border-primary/20"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 ring-2 ring-primary/10 flex-shrink-0">
        <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
          {userInitials}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            {userLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <button
                onClick={() => onUserClick(comment.userId)}
                className="font-semibold text-sm text-primary hover:text-primary/80 transition-colors"
              >
                @{userName || comment.userId}
              </button>
            )}

            <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
              {createdTimeAgo}
            </time>

            {showEditedLabel && !isEditing && (
              <span className="text-xs text-muted-foreground opacity-75">
                (editado)
              </span>
            )}
          </div>

          {/* Menu */}
          {isOwner && !isEditing && (
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMenuOpen(!menuOpen)}
                className="h-6 w-6 -mt-1"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>

              {menuOpen && (
                <div className="absolute right-full -top-2 mr-2 bg-card border rounded-lg shadow-lg z-50 min-w-[140px] overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onStartEdit()
                      setMenuOpen(false)
                    }}
                    className="w-full justify-start h-8 text-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onDelete()
                      setMenuOpen(false)
                    }}
                    className="w-full justify-start h-8 text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editBody}
              onChange={(e) => onEditBodyChange(e.target.value)}
              className="resize-none min-h-[60px] text-sm"
              autoFocus
              disabled={updating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  if (editBody.trim() && !updating) {
                    onSaveEdit()
                  }
                }
              }}
            />

            <p className="text-xs text-muted-foreground">
              Presiona {typeof navigator !== 'undefined' && navigator.platform.includes("Mac") ? "Cmd" : "Ctrl"} + Enter para guardar
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelEdit}
                disabled={updating}
              >
                <X className="w-3.5 h-3.5" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={onSaveEdit}
                disabled={updating || !editBody.trim()}
              >
                {updating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-foreground">
            <p className="whitespace-pre-wrap break-words">{displayBody}</p>
            {shouldTruncate && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="h-auto p-0 mt-1 text-primary hover:text-primary/80 font-medium text-xs"
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Ver menos" : "Ver más"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
