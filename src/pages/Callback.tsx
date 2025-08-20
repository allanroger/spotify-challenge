import { useEffect, useRef } from 'react'
import { auth } from '../api/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { useApp } from '../context/useApp'
import type { LocationState } from '../types'

export default function Callback() {
  const nav = useNavigate()
  const loc = useLocation() as Location & { state?: LocationState }
  const ran = useRef(false)
  const { setLogged } = useApp()

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    ;(async () => {
      try {
        const ok: boolean = await auth.handleRedirect()
        if (ok) setLogged(true)
        const to = loc.state?.from?.pathname ?? '/'
        nav(ok ? to : '/login', { replace: true })
      } catch {
        nav('/login', { replace: true })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav, loc])

  return <div className="subtitle">Processando autenticação...</div>
}
