import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../api/auth'
import LanguageSelector from '../LanguageSelector'
import { useApp } from '../../context/useApp'
import { useT } from '../../i18n/index'
import { hasValidSession } from '../../auth/pkce'

export default function NavBar() {
  const { logged, setLogged } = useApp()
  const t = useT()
  const nav = useNavigate()

  useEffect(() => {
    setLogged(hasValidSession())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    auth.logout()
    setLogged(false)
    nav('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="text-2xl font-bold flex-1">
          {t('ui.title')}
        </Link>
        <LanguageSelector />
        {logged && (
          <button className="btn btn-primary" onClick={handleLogout}>
            {t('ui.logout')}
          </button>
        )}
      </div>
    </header>
  )
}
