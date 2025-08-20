import { useEffect } from 'react'
import { auth } from '../api/auth'
import { loadTokens, isExpired } from '../auth/pkce'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { useT } from '../i18n/index'
import type { LocationState } from '../types'

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation() as Location & { state?: LocationState }
  const t = useT()

  useEffect(() => {
    const tokens = loadTokens()
    if (tokens && !isExpired(tokens)) {
      const to = loc.state?.from?.pathname || '/'
      nav(to, { replace: true })
    }
  }, [nav, loc])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full card no-hover text-center">
        <h1 className="title mb-3">{t('ui.headline')}</h1>
        <p className="subtitle mb-4">{t('ui.redirect')}</p>
        <button className="btn btn-primary w-full" onClick={() => auth.login()}>
          {t('ui.login')}
        </button>
      </div>
    </div>
  )
}
