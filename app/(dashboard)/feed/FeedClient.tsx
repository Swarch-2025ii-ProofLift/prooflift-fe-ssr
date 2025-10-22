'use client'

import Feed from '@/app/components/posts/Feed'

interface FeedClientProps {
  currentUserId?: string
}

export default function FeedClient({ currentUserId }: FeedClientProps) {
  return (
    <Feed
      currentUserId={currentUserId}
      limit={100}
      showCreateButton={true}
      layout="default"
      filter="all"
    />
  )
}
