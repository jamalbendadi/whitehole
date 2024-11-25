import { createStore } from 'zustand/vanilla'

export type AppState = {
  isAuthenticated: boolean
}

export type AppActions = {

}

export type AppStore = AppState & AppActions

export const defaultInitState: AppState = {
  isAuthenticated: false,
}

export const createAppStore = (
  initState: AppState = defaultInitState,
) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    toggleIsAuthenticated: () => set((state) => ({ isAuthenticated:  !state.isAuthenticated})),
  }))
}
