import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { TestProviders } from './TestProviders'

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProviders as React.ComponentType, ...options })
}
