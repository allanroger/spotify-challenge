import SearchBar from '../components/SearchBar'
import ArtistList from '../components/ArtistList'

export default function Artists() {
  return (
    <div className="grid gap-4">
      <SearchBar />
      <ArtistList />
    </div>
  )
}
