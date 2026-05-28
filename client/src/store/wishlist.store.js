import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      ids: [],
      setIds: (ids) => set({ ids: Array.from(new Set(ids)) }),
      toggle: (id) => {
        const ids = get().ids;
        set({ ids: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: 'kismayo-wishlist' }
  )
);
