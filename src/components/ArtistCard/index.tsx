import type { Artist } from '../../types'
import { useNavigate } from 'react-router-dom'
import { useT } from '../../i18n/index'

export default function ArtistCard({ artist }: { artist: Artist }) {
  const t = useT()
  const nav = useNavigate()
  const img = artist.images?.[0]?.url

  return (
    <button
      onClick={() => nav(`/artist/${artist.id}/albums`)}
      className="card w-full text-left hover:shadow-card transition"
    >
      <div className="flex gap-4 items-center">
        <img src={img} alt={artist.name} className="w-[100px] h-[100px] object-cover rounded-xl bg-gray-100" />
        <div className="flex-1">
          <div className="title">{artist.name}</div>
          <div className="subtitle">{t('artist.popularity')}: <span className="badge">{artist.popularity}</span></div>
        </div>
      </div>
    </button>
  )
}
