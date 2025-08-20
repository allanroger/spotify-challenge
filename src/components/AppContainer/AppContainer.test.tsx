import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppContainer from './index'

jest.mock('../../context/useApp', () => ({
  __esModule: true,
  useApp: jest.fn(() => ({ logged: false })),
}))

jest.mock('../NavBar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">NavBar</div>,
}))

jest.mock('../ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected">{children}</div>
  ),
}))

jest.mock('../../pages/Login', () => ({
  __esModule: true,
  default: () => <div>Login Page</div>,
}))
jest.mock('../../pages/Artists', () => ({
  __esModule: true,
  default: () => <div>Artists Page</div>,
}))
jest.mock('../../pages/Albums', () => ({
  __esModule: true,
  default: () => <div>Albums Page</div>,
}))
jest.mock('../../pages/AlbumTracks', () => ({
  __esModule: true,
  default: () => <div>AlbumTracks Page</div>,
}))
jest.mock('../../pages/Callback', () => ({
  __esModule: true,
  default: () => <div>Callback Page</div>,
}))

jest.mock('../../assets/background.mp4', () => ({
  __esModule: true,
  default: 'video.mp4',
}))

function renderWith(path: string, logged: boolean) {
  const { useApp } = jest.requireMock('../../context/useApp')
  ;(useApp as jest.Mock).mockReturnValue({ logged })

  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppContainer />
    </MemoryRouter>
  )
}

describe('AppContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza NavBar sempre', () => {
    renderWith('/', false)
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('quando não logado: mostra vídeo e renderiza /login', () => {
    const { container } = renderWith('/login', false)
    expect(container.querySelector('video')).toBeInTheDocument()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('quando logado: não mostra vídeo e renderiza Artists na raiz', () => {
    const { container } = renderWith('/', true)
    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(screen.getByText('Artists Page')).toBeInTheDocument()
  })

  it('navega para páginas protegidas com logged=true', () => {
    renderWith('/artist/42/albums', true)
    expect(screen.getByText('Albums Page')).toBeInTheDocument()

    renderWith('/album/abc', true)
    expect(screen.getByText('AlbumTracks Page')).toBeInTheDocument()
  })

  it('rota /callback renderiza Callback Page', () => {
    renderWith('/callback', false)
    expect(screen.getByText('Callback Page')).toBeInTheDocument()
  })
})
