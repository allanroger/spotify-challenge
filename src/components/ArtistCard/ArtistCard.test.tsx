import { screen } from '@testing-library/react'
import ArtistCard from './index'
import { renderWithProviders } from '@/test/renderWithProviders'

const artist = {
  id: '1',
  name: 'Test Artist',
  popularity: 80,
  images: [{ url: 'https://via.placeholder.com/100', width: 100, height: 100 }],
}

describe('ArtistCard', () => {
  it('renderiza o nome do artista', () => {
    renderWithProviders(<ArtistCard artist={artist} />)
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })
})
