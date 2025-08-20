import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/useApp'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { logged } = useApp()
  const loc = useLocation()

  if (!logged) {
    return <Navigate to="/login" replace state={{ from: loc }} />
  }
  return <>{children}</>
}
