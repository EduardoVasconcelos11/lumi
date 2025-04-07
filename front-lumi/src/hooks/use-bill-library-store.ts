import { create } from "zustand"

export const useBillLibraryStore = create((set) => ({
  filters: {
    clientNumber: undefined,
    month: undefined,
  },
  setFilters: (filters: any) => set({ filters }),
}))

