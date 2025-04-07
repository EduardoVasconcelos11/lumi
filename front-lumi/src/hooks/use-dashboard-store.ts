import { create } from "zustand"

type DashboardFilters = {
  clientNumber?: string
  startDate?: Date
  endDate?: Date
}

type DashboardStore = {
  filters: DashboardFilters
  setFilters: (filters: DashboardFilters) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  filters: {
    clientNumber: undefined,
    startDate: undefined,
    endDate: undefined,
  },
  setFilters: (filters) => set({ filters }),
}))
