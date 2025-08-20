import { createContext } from 'react'

export type Language = 'pt' | 'en'
export type Filters = { artistName: string; albumName: string }

export type AppState = {
  lang: Language
  setLang: (l: Language) => void

  filters: Filters
  setFilters: (p: Partial<Filters>) => void

  selectedArtistId: string | null
  setSelectedArtistId: (id: string | null) => void

  logged: boolean
  setLogged: (v: boolean) => void
}

export const AppCtx = createContext<AppState | null>(null)
