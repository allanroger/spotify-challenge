// src/auth/pkce.ts
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string

const TOKEN_KEY = 'sp_tokens_v2_no_refresh'
const STATE_KEY = 'sp_state_v1'
const VERIFIER_KEY = 'sp_verifier_v1'
const PROCESSING_LOCK_KEY = 'sp_pkce_processing_v1'

export type Tokens = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  scope?: string
  expires_at: number
}

function toB64Url(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf)
  let str = ''
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i])
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sha256_b64url(input: string) {
  const enc = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', enc)
  return toB64Url(digest)
}

function randomString(len = 64) {
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return toB64Url(arr.buffer)
}

function getEnvScopes(): string[] {
  const s = (import.meta.env.VITE_SPOTIFY_SCOPES ?? '').trim()
  if (!s) return ['user-read-email', 'user-read-private']
  return s.split(/\s+/g)
}

function unique(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean)))
}

function clearAuthArtifactsFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('code')
  url.searchParams.delete('state')
  window.history.replaceState({}, '', url.toString())
}

function clearEphemeralStorage() {
  sessionStorage.removeItem(STATE_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
  sessionStorage.removeItem(PROCESSING_LOCK_KEY)
}

export function saveTokens(t: Tokens | null) {
  if (!t) localStorage.removeItem(TOKEN_KEY)
  else localStorage.setItem(TOKEN_KEY, JSON.stringify(t))
}

export function loadTokens(): Tokens | null {
  const raw = localStorage.getItem(TOKEN_KEY)
  return raw ? (JSON.parse(raw) as Tokens) : null
}

export function isExpired(t: Tokens | null) {
  if (!t) return true
  return Date.now() >= t.expires_at - 15_000
}

export function hasValidSession(): boolean {
  const t = loadTokens()
  return !!t && !isExpired(t)
}

export async function beginLogin(scopes: string[] = []) {
  const wantedScopes = unique([...getEnvScopes(), ...scopes])

  const verifier = randomString(64)
  const challenge = await sha256_b64url(verifier)
  const state = randomString(16)

  sessionStorage.setItem(VERIFIER_KEY, verifier)
  sessionStorage.setItem(STATE_KEY, state)

  const url = new URL('https://accounts.spotify.com/authorize')
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('redirect_uri', REDIRECT_URI)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('state', state)
  url.searchParams.set('scope', wantedScopes.join(' '))

  window.location.href = url.toString()
}

async function tokenRequest(params: Record<string, string>) {
  const body = new URLSearchParams(params)
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('Token exchange failed:', res.status, text)
    throw new Error('token_request_failed')
  }
  return res.json()
}

export async function handleRedirectCallback() {
  if (sessionStorage.getItem(PROCESSING_LOCK_KEY)) return false
  sessionStorage.setItem(PROCESSING_LOCK_KEY, '1')

  try {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const saved = sessionStorage.getItem(STATE_KEY)
    const verifier = sessionStorage.getItem(VERIFIER_KEY)

    if (!code) return false
    if (!state || state !== saved || !verifier) throw new Error('invalid_state_or_verifier')

    const data = await tokenRequest({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    })

    const now = Date.now()
    const tokens: Tokens = {
      access_token: data.access_token,
      token_type: 'Bearer',
      scope: data.scope,
      expires_in: data.expires_in,
      expires_at: now + (data.expires_in ?? 3600) * 1000,
    }
    saveTokens(tokens)

    clearAuthArtifactsFromUrl()
    clearEphemeralStorage()
    return true
  } finally {
    sessionStorage.removeItem(PROCESSING_LOCK_KEY)
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const t = loadTokens()
  if (!t || isExpired(t)) return null
  return t.access_token
}

export function logout() {
  saveTokens(null)
  clearEphemeralStorage()
}
