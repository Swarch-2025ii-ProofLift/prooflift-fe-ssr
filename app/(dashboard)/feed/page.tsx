import { getUserIdFromToken } from '@/lib/user'
import FeedClient from './FeedClient'

export default async function FeedPage() {
  const currentUserId = await getUserIdFromToken()

  return (
    <div className="w-full">
      <FeedClient currentUserId={currentUserId || undefined} />
    </div>
  )
}
