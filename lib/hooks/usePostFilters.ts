import { useMemo } from "react"
import { AggregatedPost } from "@/lib/graphql/posts"

type FilterType = "all" | "recent" | "popular"

export function usePostFilters(posts: AggregatedPost[], filter: FilterType) {
  const filteredPosts = useMemo(() => {
    if (!posts) return []

    const postsCopy = [...posts]

    switch (filter) {
      case "recent":
        return postsCopy.sort(
          (a, b) =>
            new Date(b.post.createdAt).getTime() -
            new Date(a.post.createdAt).getTime()
        )
      case "popular":
        return postsCopy.sort(
          (a, b) =>
            b.totalReactions +
            b.totalComments -
            (a.totalReactions + a.totalComments)
        )
      default:
        return postsCopy
    }
  }, [posts, filter])

  return filteredPosts
}
