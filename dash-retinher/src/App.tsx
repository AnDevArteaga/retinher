import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { LoginPage } from './pages/LoginPage'
import { InicioPage } from './pages/InicioPage'
import { NosotrosPage } from './pages/NosotrosPage'
import { SedesPage } from './pages/SedesPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<InicioPage />} />
            <Route path="nosotros" element={<NosotrosPage />} />
            <Route path="sedes" element={<SedesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
