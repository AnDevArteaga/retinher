import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CustomCursor } from './components/shared/CustomCursor'
import { FloatingWhatsApp } from './components/shared/FloatingWhatsApp'
import { NavBar } from './components/layout/NavBar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { NosotrosPage } from './pages/NosotrosPage'
import { UCADPage } from './pages/UCADPage'
import { SedesPage } from './pages/SedesPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="grain" aria-hidden />
        <CustomCursor />
        <FloatingWhatsApp />
        <NavBar />
        <main className="relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/ucad-te-veo-te-ves" element={<UCADPage />} />
            <Route path="/sedes" element={<SedesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
