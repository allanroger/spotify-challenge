import { useQuery } from '@tanstack/react-query'
import { searchArtists, getRecentlyPlayed } from '../../api/spotify'
import { useApp } from '../../context/useApp'
import ArtistCard from '../ArtistCard'
import { useT } from '../../i18n/index'
import { Link } from 'react-router-dom'
import { clip } from '../../utils'

export default function ArtistList() {
  const { filters, logged } = useApp()
  const t = useT()

  const recentQ = useQuery({
    queryKey: ['recently-played'],
    enabled: logged,
    staleTime: 60 * 1000,
    queryFn: () => getRecentlyPlayed(3),
  })

  const enabledSearch = !!filters.artistName && logged
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['artists', filters.artistName],
    queryFn: () => searchArtists(filters.artistName),
    enabled: enabledSearch,
    retry: 1,
  })

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <div className="title">{t('recent.title')}</div>

        {recentQ.isLoading && (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card skeleton h-16" />
            ))}
          </div>
        )}

        {!recentQ.isLoading && (recentQ.data?.length ?? 0) === 0 && (
          <div className="card subtitle">{t('recent.empty')}</div>
        )}

        {!!recentQ.data?.length && (
          <ul className="grid gap-2">
            {recentQ.data.map((item) => {
              const img = item.track.album.images?.[0]?.url
              const artists = item.track.artists.map((a) => a.name).join(', ')
              const albumId = item.track.album.id
              const title = item.track.name

              return (
                <li key={`${item.played_at}-${item.track.id}`}>
                  <Link
                    to={`/album/${albumId}`}
                    className="card flex items-center gap-3 hover:shadow transition"
                    title={title}
                  >
                    {img && (
                      <img
                        src={img}
                        alt={item.track.album.name}
                        width={56}
                        height={56}
                        className="w-[56px] h-[56px] object-cover rounded-xl"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{clip(title, 20)}</div>
                      <div className="subtitle truncate">{artists}</div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {filters.artistName && (
        <div className="grid gap-3">
          <div className="title">{t('artists.title')}</div>

          {isFetching && (
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card skeleton h-20" />
              ))}
            </div>
          )}

          {isError && (
            <div className="card">
              <div className="text-red-600 font-medium mb-2">{t('artists.error')}</div>
              <button className="btn" onClick={() => refetch()}>
                {t('ui.retry')}
              </button>
            </div>
          )}

          {!isFetching && !isError && data && data.length === 0 && (
            <div className="card">{t('artists.empty')}</div>
          )}

          {!isFetching && !isError && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data?.map((a) => (
                <ArtistCard key={a.id} artist={a} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
