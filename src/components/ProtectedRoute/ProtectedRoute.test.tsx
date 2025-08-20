import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation, type Location } from 'react-router-dom'
import ProtectedRoute from './index'

jest.mock('../../context/useApp', () => ({
  __esModule: true,
  useApp: jest.fn(() => ({ logged: false })),
}))

interface ProtectedRouteState {
  from?: Location
}

function ShowLocation() {
  const loc = useLocation() as Location & { state: ProtectedRouteState }
  const from = loc.state?.from?.pathname ?? ''
  return (
    <div>
      <div data-testid="path">{loc.pathname}</div>
      <div data-testid="from">{from}</div>
      Login Page
    </div>
  )
}

function renderWithRouter(logged: boolean, initialPath = '/') {
  const { useApp } = jest.requireMock('../../context/useApp')
  ;(useApp as jest.Mock).mockReturnValue({ logged })

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Private Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<ShowLocation />} />
        <Route
          path="/private/:id"
          element={
            <ProtectedRoute>
              <div>Private Nested</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('quando logged=true, renderiza os children', () => {
    renderWithRouter(true, '/')
    expect(screen.getByText('Private Content')).toBeInTheDocument()
  })

  it('quando logged=false, redireciona para /login e passa state.from com a rota original', () => {
    renderWithRouter(false, '/')
    expect(screen.getByTestId('path')).toHaveTextContent('/login')
    expect(screen.getByTestId('from')).toHaveTextContent('/')
  })

  it('preserva o from quando a rota privada é aninhada (ex: /private/42)', () => {
    renderWithRouter(false, '/private/42')
    expect(screen.getByTestId('path')).toHaveTextContent('/login')
    expect(screen.getByTestId('from')).toHaveTextContent('/private/42')
  })
})
