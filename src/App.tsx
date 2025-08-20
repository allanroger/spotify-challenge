import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppContainer from './components/AppContainer'
const qc = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 1000 * 30, placeholderData: (prev: unknown) => prev },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppProvider>
        <BrowserRouter>
          <AppContainer />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  )
}
