'use client';

import { create } from 'zustand';

interface PostDetailState {
  isOpen: boolean;
  postId: string | null;
  onCloseCallback: (() => void) | null;
  openPostDetail: (postId: string, onClose?: () => void) => void;
  closePostDetail: () => void;
}


export const usePostDetail = create<PostDetailState>((set, get) => ({
  isOpen: false,
  postId: null,
  onCloseCallback: null,
  openPostDetail: (postId: string, onClose?: () => void) =>
    set({ isOpen: true, postId, onCloseCallback: onClose || null }),
  closePostDetail: () => {
    const { onCloseCallback } = get();
    if (onCloseCallback) {
      onCloseCallback();
    }
    set({ isOpen: false, postId: null, onCloseCallback: null });
  },
}));
