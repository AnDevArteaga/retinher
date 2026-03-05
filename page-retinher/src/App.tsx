import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { CustomCursor } from './components/shared/CustomCursor'
import { FloatingWhatsApp } from './components/shared/FloatingWhatsApp'
import { NavBar } from './components/layout/NavBar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { NosotrosPage } from './pages/NosotrosPage'
import { UCADPage } from './pages/UCADPage'
import { SedesPage } from './pages/SedesPage'
import { RetinherTransformaPage } from './pages/RetinherTransformaPage'
import { ContentProvider, useContent } from './contexts/ContentContext'
import { PageSEO } from './components/shared/PageSEO'
import type { PageSlug } from './data/contentApi'

function slugFromPathname(pathname: string): PageSlug {
  if (pathname === '/') return 'home'
  if (pathname === '/ucad-te-veo-te-ves') return 'ucad'
  if (pathname === '/nosotros') return 'nosotros'
  if (pathname === '/sedes') return 'sedes'
  if (pathname === '/retinher-transforma') return 'retinher_transforma'
  return 'home'
}

function AppContent() {
  const { loading, error } = useContent()
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
  if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--color-text-muted)]">Cargando…</div>
  return (
    <>
      <PageSEO />
      <CustomCursor />
      <FloatingWhatsApp />
      <NavBar />
      <main className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/ucad-te-veo-te-ves" element={<UCADPage />} />
          <Route path="/sedes" element={<SedesPage />} />
          <Route path="/retinher-transforma" element={<RetinherTransformaPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="grain" aria-hidden />
        <ContentProviderWithSlug />
      </div>
    </BrowserRouter>
  )
}

function ContentProviderWithSlug() {
  const location = useLocation()
  const slug = useMemo(() => slugFromPathname(location.pathname), [location.pathname])
  return (
    <ContentProvider slug={slug}>
      <AppContent />
    </ContentProvider>
  )
}

export default App
