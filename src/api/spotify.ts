import axios from 'axios'
import type { Artist, Album, Track, Paginated, RecentItem } from '../types'
import { getValidAccessToken } from '../auth/pkce'

const api = axios.create({ baseURL: 'https://api.spotify.com/v1' })

api.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken()
  if (!token) throw new axios.Cancel('no_token')
  config.headers = config.headers || {}
  config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response && [401, 403].includes(err.response.status)) {
      return Promise.reject(new Error('unauthorized'))
    }
    return Promise.reject(err)
  }
)

export async function searchArtists(q: string): Promise<Artist[]> {
  if (!q) return []
  const { data } = await api.get('/search', { params: { q, type: 'artist', limit: 20 } })
  return data?.artists?.items ?? []
}

export async function getArtist(id: string): Promise<Artist> {
  const { data } = await api.get(`/artists/${id}`)
  return data
}

export async function getTopTracks(artistId: string, market = 'US'): Promise<Track[]> {
  const { data } = await api.get(`/artists/${artistId}/top-tracks`, { params: { market } })
  return data?.tracks ?? []
}

export async function getArtistAlbums(
  artistId: string,
  page: number,
  pageSize = 20,
  market = 'US',
): Promise<Paginated<Album>> {
  const offset = (page - 1) * pageSize
  const { data } = await api.get(`/artists/${artistId}/albums`, {
    params: { include_groups: 'album,single', limit: pageSize, offset, market },
  })
  return { items: data.items, total: data.total, limit: data.limit, offset: data.offset }
}

export async function getAlbum(albumId: string): Promise<Album> {
  const { data } = await api.get(`/albums/${albumId}`)
  return data
}

export async function getAlbumTracks(albumId: string, limit = 50, offset = 0): Promise<Track[]> {
  const { data } = await api.get(`/albums/${albumId}/tracks`, { params: { limit, offset } })
  return data?.items ?? []
}

export async function getRecentlyPlayed(limit = 10): Promise<RecentItem[]> {
  const { data } = await api.get('/me/player/recently-played', { params: { limit } })
  return data?.items ?? []
}