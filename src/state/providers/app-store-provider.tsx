'use client'

import { type ReactNode, createContext, useRef, useContext, createServerContext } from 'react'
import { AppState, type AppStore, createAppStore } from '@/state/stores/app-store'
import { useStore } from 'zustand'

export type AppStoreApi = ReturnType<typeof createAppStore>

export const AppStoreContext = createContext<AppStoreApi | undefined>(
  undefined,
)

export interface AppStoreProviderProps {
  children: ReactNode
  initialState: AppState
}

export const AppStoreProvider = ({ initialState, children }: AppStoreProviderProps) => {
  const storeRef = useRef<AppStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState)
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  )
}

export const useAppStore = <T,>(
  selector: (store: AppStore) => T,
): T => {
  const appStoreContext = useContext(AppStoreContext)

  if (!appStoreContext) {
    throw new Error(`useAppStore must be used within AppStoreProvider`)
  }

  return useStore(appStoreContext, selector)
}
