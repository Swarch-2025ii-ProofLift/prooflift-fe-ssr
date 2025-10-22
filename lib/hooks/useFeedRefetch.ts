'use client';

import { create } from 'zustand';

interface FeedRefetchState {
  refetch: (() => void) | null;
  registerRefetch: (refetch: () => void) => void;
  unregisterRefetch: () => void;
  triggerRefetch: () => void;
}

export const useFeedRefetch = create<FeedRefetchState>((set, get) => ({
  refetch: null,
  registerRefetch: (refetch: () => void) => set({ refetch }),
  unregisterRefetch: () => set({ refetch: null }),
  triggerRefetch: () => {
    const { refetch } = get();
    if (refetch) {
      refetch();
    }
  },
}));
