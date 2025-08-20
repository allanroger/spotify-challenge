import { render, screen, fireEvent } from '@testing-library/react'
import LanguageSelector from './index'

const mockSetLang = jest.fn()
jest.mock('../../context/useApp', () => ({
  __esModule: true,
  useApp: jest.fn(() => ({
    lang: 'pt',
    setLang: mockSetLang,
  })),
}))

describe('LanguageSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o idioma atual e não mostra o dropdown inicialmente', () => {
    render(<LanguageSelector />)

    expect(screen.getByRole('button', { name: /Português/i })).toBeInTheDocument()

    expect(screen.queryByText(/English/i)).not.toBeInTheDocument()

  })

  it('abre o dropdown ao clicar no botão principal', () => {
    render(<LanguageSelector />)

    fireEvent.click(screen.getByRole('button', { name: /Português/i }))

    expect(screen.getByText(/English/i)).toBeInTheDocument()

    expect(screen.getAllByText(/Português/i).length).toBeGreaterThanOrEqual(1)
  })

  it('ao selecionar English, chama setLang("en") e fecha o dropdown', () => {
    const { rerender } = render(<LanguageSelector />)

    fireEvent.click(screen.getByRole('button', { name: /Português/i }))

    fireEvent.click(screen.getByRole('button', { name: /English/i }))

    expect(mockSetLang).toHaveBeenCalledTimes(1)
    expect(mockSetLang).toHaveBeenCalledWith('en')

    rerender(<LanguageSelector />)

    expect(screen.queryByText(/English/i)).not.toBeInTheDocument()
  })

  it('reabre e permite selecionar Português (clicando na segunda ocorrência, a do menu)', () => {
    render(<LanguageSelector />)

    fireEvent.click(screen.getByRole('button', { name: /Português/i }))

    const portugueseButtons = screen.getAllByRole('button', { name: /Português/i })
    expect(portugueseButtons.length).toBeGreaterThanOrEqual(2)

    fireEvent.click(portugueseButtons[1])

    expect(mockSetLang).toHaveBeenCalledWith('pt')
  })
})
