import { beginLogin, handleRedirectCallback, loadTokens, logout as doLogout } from '../auth/pkce'

export const auth = {
  login: () => beginLogin(),
  handleRedirect: () => handleRedirectCallback(),
  me: async () => {
    const token = loadTokens()?.access_token
    if (!token) throw new Error('not_logged_in')
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('not_logged_in')
    return res.json()
  },
  logout: () => doLogout(),
}
