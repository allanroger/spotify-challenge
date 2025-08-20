import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from '../NavBar'
import ProtectedRoute from '../ProtectedRoute'
import Login from '../../pages/Login'
import Artists from '../../pages/Artists'
import Albums from '../../pages/Albums'
import AlbumTracks from '../../pages/AlbumTracks'
import Callback from '../../pages/Callback'
import { useApp } from '../../context/useApp'
import bgVideo from '../../assets/background.mp4'

export default function AppContainer() {
  const { logged } = useApp() 

  return (
    <div className={`min-h-screen relative ${logged ? 'bg-app-bg' : ''}`}>
      <NavBar />

      {!logged && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover -z-10 backdrop-blur"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      )}

      <main className="max-w-6xl mx-auto px-4 py-6 relative z-0">
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Artists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artist/:id/albums"
            element={
              <ProtectedRoute>
                <Albums />
              </ProtectedRoute>
            }
          />
          <Route
            path="/album/:id"
            element={
              <ProtectedRoute>
                <AlbumTracks />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
