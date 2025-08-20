import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '../context/AppContext'

export function TestProviders({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
    },
  })

  return (
    <QueryClientProvider client={qc}>
      <AppProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </AppProvider>
    </QueryClientProvider>
  )
}
