import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './index'

const mockSetFilters = jest.fn()
const mockSetSelectedArtistId = jest.fn()
jest.mock('../../context/useApp', () => ({
  __esModule: true,
  useApp: jest.fn(() => ({
    filters: { artistName: 'beatles', albumName: '' },
    setFilters: mockSetFilters,
    setSelectedArtistId: mockSetSelectedArtistId,
  })),
}))

jest.mock('../../i18n', () => ({
  __esModule: true,
  useT: () => (k: string) => k,
}))

jest.mock('../../hooks/useDebounced', () => ({
  __esModule: true,
  useDebounced: <T,>(v: T) => v,
}))

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza com o valor inicial vindo de filters e placeholder traduzido', () => {
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('ui.search_artists') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('beatles')
  })

  it('ao digitar um novo termo, chama setFilters e limpa selectedArtistId', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('ui.search_artists') as HTMLInputElement

    await user.clear(input)
    await user.type(input, 'queen')

    expect(mockSetFilters).toHaveBeenCalledWith({ artistName: 'queen' })
    expect(mockSetSelectedArtistId).toHaveBeenCalledWith(null)
  })

  it('não chama setFilters quando o valor não mudou (sem digitar nada)', () => {
    render(<SearchBar />)

    expect(mockSetFilters).not.toHaveBeenCalled()
    expect(mockSetSelectedArtistId).not.toHaveBeenCalled()
  })
})
