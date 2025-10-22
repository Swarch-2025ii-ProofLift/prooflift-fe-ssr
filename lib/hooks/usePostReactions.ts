import { useCallback } from "react"
import { useMutation } from "@apollo/client/react"
import { SET_REACTION, REMOVE_REACTION, Reaction, ReactionType } from "@/lib/graphql/posts"

interface UsePostReactionsProps {
  currentUserId?: string
  onCompleted?: () => void
}

export function usePostReactions({ currentUserId, onCompleted }: UsePostReactionsProps) {
  const [setReaction] = useMutation(SET_REACTION, {
    optimisticResponse: (vars) => ({
      setReaction: {
        __typename: "Reaction",
        id: `temp-${Date.now()}`,
        postId: vars.postId,
        userId: currentUserId || "unknown",
        type: vars.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }),
    onCompleted,
  })

  const [removeReaction] = useMutation(REMOVE_REACTION, {
    optimisticResponse: (vars) => ({
      removeReaction: {
        __typename: "Reaction",
        id: "temp-removed",
        postId: vars.postId,
        userId: currentUserId || "unknown",
        type: "LIKE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }),
    onCompleted,
  })

  const handleToggleReaction = useCallback(
    async (postId: string, type: ReactionType, currentUserReaction: Reaction | null) => {
      try {
        if (currentUserReaction && currentUserReaction.type === type) {
          await removeReaction({ variables: { postId } })
        } else {
          await setReaction({ variables: { postId, type } })
        }
      } catch (error) {
        console.error("Error toggling reaction:", error)
      }
    },
    [setReaction, removeReaction]
  )

  return {
    handleToggleReaction,
    setReaction,
    removeReaction,
  }
}
