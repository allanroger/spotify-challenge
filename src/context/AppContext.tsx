import { useMemo, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { AppCtx, type AppState, type Language, type Filters } from './AppContext.ctx'
import { loadTokens, isExpired } from '../auth/pkce'
import { auth } from '../api/auth'
import { shallowEqual } from '../utils'

function hasValidSession(): boolean {
  const t = loadTokens()
  return !!t && !isExpired(t)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, _setLang] = useState<Language>('pt')
  const [filters, setFiltersState] = useState<Filters>({ artistName: '', albumName: '' })
  const [selectedArtistId, _setSelectedArtistId] = useState<string | null>(null)
  const [logged, setLogged] = useState<boolean>(() => hasValidSession())

  useEffect(() => {
    if (!logged) return
    let alive = true
    auth.me().then(
      () => alive && setLogged(true),
      () => alive && setLogged(false),
    )
    return () => { alive = false }
  }, [logged])

  const setLang = (l: Language) => _setLang(prev => (prev === l ? prev : l))

  const setFilters = (p: Partial<Filters>) => {
    setFiltersState(prev => {
      const next = { ...prev, ...p }
      return shallowEqual(prev, next) ? prev : next
    })
  }

  const setSelectedArtistId = (id: string | null) =>
    _setSelectedArtistId(prev => (prev === id ? prev : id))

  const value: AppState = useMemo(
    () => ({
      lang, setLang,
      filters, setFilters,
      selectedArtistId, setSelectedArtistId,
      logged, setLogged,
    }),
    [lang, filters, selectedArtistId, logged]
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
