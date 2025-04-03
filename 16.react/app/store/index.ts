import { create } from 'zustand'

interface State {
  count: number
}

interface Actions {
  increment: (qty: number) => void
  decrement: (qty: number) => void
}

export const useStoreCount = create<State & Actions>(set => ({
  count: 0,
  increment: (qty: number) => set((state: { count: number }) => ({ count: state.count + qty })),
  decrement: (qty: number) => set((state: { count: number }) => ({ count: state.count - qty })),
}))
