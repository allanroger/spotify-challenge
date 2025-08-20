import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAlbum, getAlbumTracks } from '../api/spotify'
import { useT } from '../i18n/index'
import { msToMin } from '../utils'

export default function AlbumTracks() {
  const { id } = useParams<{ id: string }>()
  const albumQ = useQuery({ queryKey: ['album', id], queryFn: () => getAlbum(id!), enabled: !!id })
  const tracksQ = useQuery({ queryKey: ['album-tracks', id], queryFn: () => getAlbumTracks(id!), enabled: !!id })
  const nav = useNavigate()
  const t = useT()

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <button type="button" className="btn btn-primary" onClick={() => nav(-1)}>
          ← {t('ui.back')}
        </button>
      </div>

      <div className="card no-hover">
        {albumQ.isLoading ? (
          <div className="skeleton h-24" />
        ) : albumQ.data ? (
          <div className="flex items-center gap-4">
            <img
              src={albumQ.data.images?.[0]?.url}
              className="w-[100px] h-[100px] object-cover rounded-xl"
            />
            <div>
              <div className="title">{albumQ.data.name}</div>
              <div className="subtitle">
                {new Date(albumQ.data.release_date).getFullYear()} • {albumQ.data.total_tracks} {t('tracks.title')}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="card no-hover">
        <div className="title mb-3">{t('tracks.title')}</div>
        {tracksQ.isLoading && (
          <div className="grid gap-2">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-6" />)}
          </div>
        )}

        {tracksQ.isError && <div className="text-red-600">{t('tracks_error')}</div>}

        {!tracksQ.isLoading && !tracksQ.isError && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-2">#</th>
                <th className="py-2 pr-2">{t('tracks.name')}</th>
                <th className="py-2 pr-2 hidden sm:table-cell">{t('tracks.record')}</th>
                <th className="py-2 pr-2 text-right">{t('tracks.length')}</th>
              </tr>
            </thead>
            <tbody>
              {tracksQ.data?.map((t) => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="py-2 pr-2">{t.track_number}</td>
                  <td className="py-2 pr-2">{t.name}</td>
                  <td className="py-2 pr-2 hidden sm:table-cell">{t.disc_number}</td>
                  <td className="py-2 pr-2 text-right">{msToMin(t.duration_ms)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
