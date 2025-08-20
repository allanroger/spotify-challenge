import { useApp } from '../../context/useApp'
import { useDebounced } from '../../hooks/useDebounced'
import { useT } from '../../i18n/index'
import { useState, useEffect } from 'react'

export default function SearchBar() {
  const { filters, setFilters, setSelectedArtistId } = useApp()
  const [artist, setArtist] = useState(filters.artistName)
  const dArtist = useDebounced(artist)
  const t = useT()

  useEffect(() => {
    if (filters.artistName !== dArtist) {
      setFilters({ artistName: dArtist })
      setSelectedArtistId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dArtist])

  return (
    <div className="flex gap-2">
      <input
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="input flex-1 artist"
        placeholder={t('ui.search_artists')}
      />
    </div>
  )
}
