'use client';

import { usePostDetail } from '@/lib/hooks/usePostDetail';
import { useFeedRefetch } from '@/lib/hooks/useFeedRefetch';
import PostDetail from './PostDetail';

interface GlobalPostDetailModalProps {
  currentUserId?: string;
}

export function GlobalPostDetailModal({ currentUserId }: GlobalPostDetailModalProps) {
  const { isOpen, postId, closePostDetail } = usePostDetail();
  const { triggerRefetch } = useFeedRefetch();

  if (!postId) return null;

  const handleClose = () => {
    closePostDetail();
    triggerRefetch();
  };

  return (
    <PostDetail
      open={isOpen}
      onClose={handleClose}
      postId={postId}
      currentUserId={currentUserId}
      onDelete={() => {
        closePostDetail();
        triggerRefetch();
      }}
    />
  );
}
