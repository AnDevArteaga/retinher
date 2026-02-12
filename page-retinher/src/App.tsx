import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CustomCursor } from './components/CustomCursor'
import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { NosotrosPage } from './pages/NosotrosPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="grain" aria-hidden />
        <CustomCursor />
        <NavBar />
        <main className="relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
