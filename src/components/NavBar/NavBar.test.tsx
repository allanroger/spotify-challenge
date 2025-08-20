import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavBar from './index'
import { MemoryRouter } from 'react-router-dom'

const mockSetLogged = jest.fn()
jest.mock('../../context/useApp', () => ({
  __esModule: true,
  useApp: jest.fn(() => ({
    logged: false,
    setLogged: mockSetLogged,
  })),
}))

jest.mock('../../i18n', () => ({
  __esModule: true,
  useT: () => (k: string) => k,
}))

jest.mock('../LanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="lang-selector">Lang</div>,
}))

jest.mock('../../api/auth', () => ({
  __esModule: true,
  auth: {
    logout: jest.fn(),
  },
}))

const mockHasValidSession = jest.fn(() => false)
jest.mock('../../auth/pkce', () => ({
  __esModule: true,
  hasValidSession: () => mockHasValidSession(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderWithRouter(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <NavBar />
    </MemoryRouter>
  )
}

describe('NavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza sempre o título e o LanguageSelector', () => {
    renderWithRouter('/')
    expect(screen.getByRole('link', { name: 'ui.title' })).toBeInTheDocument()
    expect(screen.getByTestId('lang-selector')).toBeInTheDocument()
  })

  it('ao montar, chama setLogged com o retorno de hasValidSession()', () => {
    mockHasValidSession.mockReturnValueOnce(true)
    renderWithRouter('/')
    expect(mockSetLogged).toHaveBeenCalledWith(true)
  })

  it('quando logged=false, não mostra o botão de logout', () => {
    const { useApp } = jest.requireMock('../../context/useApp')
    ;(useApp as jest.Mock).mockReturnValueOnce({ logged: false, setLogged: mockSetLogged })
    renderWithRouter('/')
    expect(screen.queryByRole('button', { name: 'ui.logout' })).not.toBeInTheDocument()
  })

  it('quando logged=true, mostra o botão de logout', () => {
    const { useApp } = jest.requireMock('../../context/useApp')
    ;(useApp as jest.Mock).mockReturnValueOnce({ logged: true, setLogged: mockSetLogged })
    renderWithRouter('/')
    expect(screen.getByRole('button', { name: 'ui.logout' })).toBeInTheDocument()
  })

  it('clique em logout chama auth.logout, setLogged(false) e navega para /login', async () => {
    const user = userEvent.setup()

    const { useApp } = jest.requireMock('../../context/useApp')
    ;(useApp as jest.Mock).mockReturnValueOnce({ logged: true, setLogged: mockSetLogged })

    renderWithRouter('/')

    const btn = screen.getByRole('button', { name: 'ui.logout' })
    await user.click(btn)

    const { auth } = jest.requireMock('../../api/auth') as {
      auth: { logout: jest.Mock }
    }
    expect(auth.logout).toHaveBeenCalledTimes(1)

    expect(mockSetLogged).toHaveBeenCalledWith(false)
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})
