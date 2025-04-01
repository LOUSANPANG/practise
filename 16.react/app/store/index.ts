import { create } from 'zustand'

export const useStoreCount = create(set => ({
  count: 0,
  increment: () => set((state: { count: number }) => ({ count: state.count + 1 })),
  decrement: () => set((state: { count: number }) => ({ count: state.count - 1 })),
}))
