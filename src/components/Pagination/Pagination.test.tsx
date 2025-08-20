import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from './index'

jest.mock('../../i18n', () => ({
  __esModule: true,
  useT: () => (k: string) => k,
}))

function mockMatchMedia(matches: boolean) {
  const mql = {
    matches,
    media: '(max-width: 640px)',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  } as unknown as MediaQueryList

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => mql),
  })
  return mql
}

describe('Pagination', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Mobile (apenas Anterior/Próximo)', () => {
    it('renderiza somente os botões Prev/Next; desabilita corretamente nas bordas', async () => {
      mockMatchMedia(true)
      const user = userEvent.setup()
      const onChange = jest.fn()

      const { rerender } = render(
        <Pagination page={1} totalPages={5} onChange={onChange} />
      )

      const prev = screen.getByRole('button', { name: 'pagination.prev' })
      const next = screen.getByRole('button', { name: 'pagination.next' })

      expect(prev).toBeDisabled()
      expect(next).not.toBeDisabled()

      await user.click(next)
      expect(onChange).toHaveBeenCalledWith(2)

      rerender(<Pagination page={5} totalPages={5} onChange={onChange} />)
      expect(screen.getByRole('button', { name: 'pagination.next' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'pagination.prev' })).not.toBeDisabled()
    })

    it('usa onPrev/onNext se fornecidos', async () => {
      mockMatchMedia(true)
      const user = userEvent.setup()
      const onPrev = jest.fn()
      const onNext = jest.fn()

      render(
        <Pagination page={3} totalPages={5} onChange={() => {}} onPrev={onPrev} onNext={onNext} />
      )

      await user.click(screen.getByRole('button', { name: 'pagination.prev' }))
      await user.click(screen.getByRole('button', { name: 'pagination.next' }))

      expect(onPrev).toHaveBeenCalledTimes(1)
      expect(onNext).toHaveBeenCalledTimes(1)
    })
  })

  describe('Desktop (números, reticências, primeira/última)', () => {
    it('mostra janela central, reticências e botões de primeira/última quando aplicável', () => {
      mockMatchMedia(false)
      const onChange = jest.fn()

      render(<Pagination page={6} totalPages={20} onChange={onChange} />)

      expect(screen.getByRole('button', { name: 'pagination.prev' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'pagination.next' })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()

      expect(screen.getAllByText('…').length).toBeGreaterThanOrEqual(1)

      expect(screen.getByRole('button', { name: '6' })).toBeDisabled()
      expect(screen.getByRole('button', { name: '5' })).toBeEnabled()
      expect(screen.getByRole('button', { name: '7' })).toBeEnabled()
    })

    it('clique em páginas chama onChange com o número correto', async () => {
      mockMatchMedia(false)
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<Pagination page={10} totalPages={20} onChange={onChange} />)

      await user.click(screen.getByRole('button', { name: '9' }))
      await user.click(screen.getByRole('button', { name: '11' }))
      await user.click(screen.getByRole('button', { name: '1' }))
      await user.click(screen.getByRole('button', { name: '20' }))

      expect(onChange).toHaveBeenNthCalledWith(1, 9)
      expect(onChange).toHaveBeenNthCalledWith(2, 11)
      expect(onChange).toHaveBeenNthCalledWith(3, 1)
      expect(onChange).toHaveBeenNthCalledWith(4, 20)
    })

    it('Prev/Next respeitam as bordas e chamam onChange corretamente', async () => {
      mockMatchMedia(false)
      const user = userEvent.setup()
      const onChange = jest.fn()

      const { rerender } = render(
        <Pagination page={1} totalPages={3} onChange={onChange} />
      )

      expect(screen.getByRole('button', { name: 'pagination.prev' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'pagination.next' })).not.toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'pagination.next' }))
      expect(onChange).toHaveBeenCalledWith(2)

      rerender(<Pagination page={3} totalPages={3} onChange={onChange} />)
      expect(screen.getByRole('button', { name: 'pagination.prev' })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: 'pagination.next' })).toBeDisabled()
    })
  })
})
