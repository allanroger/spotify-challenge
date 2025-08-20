import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import ArtistList from './index'
import { clip } from '@/utils'

jest.mock('../../context/useApp', () => {
  return {
    useApp: jest.fn(() => ({
      logged: true,
      filters: { artistName: '', albumName: '' },
    })),
  }
})

jest.mock('../../i18n', () => ({
  useT: () => (k: string) => k,
}))

jest.mock('../ArtistCard', () => ({
  __esModule: true,
  default: ({ artist }: { artist: { name: string } }) => (
    <div data-testid="artist-card">{artist.name}</div>
  ),
}))

const mockGetRecentlyPlayed = jest.fn()
const mockSearchArtists = jest.fn()
jest.mock('../../api/spotify', () => ({
  getRecentlyPlayed: (limit: number) => mockGetRecentlyPlayed(limit),
  searchArtists: (q: string) => mockSearchArtists(q),
}))

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('ArtistList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('exibe lista de tocadas recentemente quando houver dados', async () => {
    const { useApp } = jest.requireMock('../../context/useApp');
    
    (useApp as jest.Mock).mockReturnValue({
      logged: true,
      filters: { artistName: '', albumName: '' },
    })

    mockGetRecentlyPlayed.mockResolvedValue([
      {
        played_at: '2025-01-01T00:00:00Z',
        track: {
          id: 't1',
          name: 'Song A',
          preview_url: null,
          artists: [{ id: 'a1', name: 'Artist A' }],
          album: {
            id: 'al1',
            name: 'Album A',
            images: [{ url: 'https://img/1.jpg', width: 56, height: 56 }],
          },
        },
      },
      {
        played_at: '2025-01-01T00:01:00Z',
        track: {
          id: 't2',
          name: 'Song B',
          preview_url: null,
          artists: [{ id: 'a2', name: 'Artist B' }],
          album: {
            id: 'al2',
            name: 'Album B',
            images: [{ url: 'https://img/2.jpg', width: 56, height: 56 }],
          },
        },
      },
      {
        played_at: '2025-01-01T00:02:00Z',
        track: {
          id: 't3',
          name: clip('Song C With Long Title', 20),
          preview_url: null,
          artists: [{ id: 'a3', name: 'Artist C' }],
          album: {
            id: 'al3',
            name: 'Album C',
            images: [{ url: 'https://img/3.jpg', width: 56, height: 56 }],
          },
        },
      },
    ])

    mockSearchArtists.mockResolvedValue([])

    renderWithProviders(<ArtistList />)

    expect(await screen.findByText('recent.title')).toBeInTheDocument()

    expect(await screen.findByRole('link', { name: /Song A/i })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Song B/i })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Song C With Long .../i })).toBeInTheDocument()

    expect(mockSearchArtists).not.toHaveBeenCalled()
  })

  it('quando há termo de busca, renderiza os artistas retornados', async () => {
    const { useApp } = jest.requireMock('../../context/useApp')
      ; (useApp as jest.Mock).mockReturnValue({
        logged: true,
        filters: { artistName: 'beatles', albumName: '' },
      })

    mockGetRecentlyPlayed.mockResolvedValue([])

    mockSearchArtists.mockResolvedValue([
      { id: 'ar1', name: 'The Beatles', popularity: 99, images: [] },
      { id: 'ar2', name: 'Beatles Tribute', popularity: 50, images: [] },
    ])

    renderWithProviders(<ArtistList />)

    expect(await screen.findByText('artists.title')).toBeInTheDocument()
    expect(await screen.findAllByTestId('artist-card')).toHaveLength(2)

    expect(screen.getByText('The Beatles')).toBeInTheDocument()
    expect(screen.getByText('Beatles Tribute')).toBeInTheDocument()

    expect(mockSearchArtists).toHaveBeenCalledWith('beatles')
  })

  it('mostra estado vazio para tocadas recentemente quando não houver dados', async () => {
    const { useApp } = jest.requireMock('../../context/useApp')
      ; (useApp as jest.Mock).mockReturnValue({
        logged: true,
        filters: { artistName: '', albumName: '' },
      })

    mockGetRecentlyPlayed.mockResolvedValue([])
    mockSearchArtists.mockResolvedValue([])

    renderWithProviders(<ArtistList />)

    expect(await screen.findByText('recent.empty')).toBeInTheDocument()
  })
})
