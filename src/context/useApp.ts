import { useContext } from 'react'
import { AppCtx } from './AppContext.ctx'

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>')
  return ctx
}

export default useApp
