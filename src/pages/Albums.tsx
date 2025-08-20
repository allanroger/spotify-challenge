import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getArtist, getTopTracks, getArtistAlbums } from '../api/spotify'
import { useState, useMemo } from 'react'
import { useT } from '../i18n/index'
import Pagination from '../components/Pagination'

export default function Albums() {
  const { id } = useParams<{ id: string }>()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const nav = useNavigate()
  const t = useT()

  const artistQ = useQuery({
    queryKey: ['artist', id],
    queryFn: () => getArtist(id!),
    enabled: !!id,
  })

  const topQ = useQuery({
    queryKey: ['top', id],
    queryFn: () => getTopTracks(id!),
    enabled: !!id,
  })

  const albumsQ = useQuery({
    queryKey: ['albums', id, page],
    queryFn: () => getArtistAlbums(id!, page, 20),
    enabled: !!id,
  })

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase()
    const items = albumsQ.data?.items ?? []
    if (!f) return items
    return items.filter((a) => a.name.toLowerCase().includes(f))
  }, [albumsQ.data, filter])

  const total = albumsQ.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / 20))

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <button type="button" className="btn btn-primary" onClick={() => nav('/')}>
          ← {t('ui.back')}
        </button>
        <div className="flex-1" />
        <input
          className="input max-w-xs flex-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('ui.search_albums')}
        />
      </div>

      <div className="card no-hover">
        {artistQ.isLoading ? (
          <div className="skeleton h-24" />
        ) : artistQ.data ? (
          <div className="flex items-center gap-4">
            <img
              src={artistQ.data.images?.[0]?.url}
              className="w-[100px] h-[100px] object-cover rounded-xl"
            />
            <div>
              <div className="title">{artistQ.data.name}</div>
              <div className="subtitle">
                {t('artist.popularity')}: <span className="badge">{artistQ.data.popularity}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="card no-hover">
        <div className="title mb-3">{t('artist.top_tracks')}</div>
        {topQ.isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-6" />)}
          </div>
        ) : (
          <ol className="list-decimal pl-5 space-y-1">
            {topQ.data?.slice(0, 10).map((t) => <li key={t.id}>{t.name}</li>)}
          </ol>
        )}
      </div>

      <div className="card no-hover">
        <div className="title mb-3">{t('albums.title')}</div>

        {albumsQ.isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40" />)}
          </div>
        )}

        {!albumsQ.isLoading && (
          <>
            {filtered.length === 0 ? (
              <div>{t('albums.empty')}</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map((al) => (
                  <Link key={al.id} to={`/album/${al.id}`} className="card block hover:shadow">
                    <img src={al.images?.[0]?.url} className="w-full h-40 object-cover rounded-xl mb-3" />
                    <div className="font-medium">{al.name}</div>
                    <div className="subtitle">
                      {new Date(al.release_date).getFullYear()} • {al.total_tracks} {t('tracks.title')}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Pagination
              className="mt-4 justify-center"
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  )
}
