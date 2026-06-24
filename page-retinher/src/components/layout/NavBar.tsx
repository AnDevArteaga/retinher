import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../../constants/routes'

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      setIsScrolled(window.scrollY > heroHeight * 0.5)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isTransparent = !isScrolled

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
        isTransparent
          ? 'bg-white text-[var(--color-text)] shadow-sm'
          : 'bg-white text-[var(--color-text)] shadow-sm'
      }`}
      aria-label="Navegación principal"
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:pl-6 sm:pr-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center transition-opacity hover:opacity-90 md:w-auto"
          onClick={() => setMobileOpen(false)}
        >
          <img
            src="/retiner1.png"
            alt="Retinher"
            className={`h-auto w-auto object-contain object-left ${
              isTransparent ? '' : ''
            }`}
          />
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 hidden translate-x-1/2 -translate-y-1/2 items-center gap-8 min-[1600px]:flex"
          aria-label="Enlaces principales"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative py-2 text-md font-medium tracking-wide transition-colors ${
                isTransparent
                  ? 'text-gray-600 hover:text-[var(--color-title-dark)]'
                  : 'text-gray-600 hover:text-[var(--color-title-dark)]'
              } ${location.pathname === item.to ? 'font-semibold text-[var(--color-title)]' : ''}`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
                  isTransparent
                    ? 'bg-[var(--color-btn)]'
                    : 'bg-[var(--color-btn)]'
                } ${location.pathname === item.to ? 'w-full' : ''}`}
                aria-hidden
              />
            </Link>
          ))}
        </nav>

        <div className="flex w-24 shrink-0 justify-end min-[1600px]:w-36">
          <button
            type="button"
            className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors min-[1600px]:hidden ${
              isTransparent
                ? 'text-[var(--color-text)]'
                : 'text-[var(--color-text)]'
            }`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-all ${
                mobileOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-all ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-all ${
                mobileOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out min-[1600px]:hidden ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav
          className="border-t border-white/10 bg-white/95 px-4 py-4 backdrop-blur-sm"
          aria-label="Menú móvil"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-secondary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
