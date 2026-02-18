import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

type HeaderProps = {
  user: User | null
  onSignOut: () => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({
  user,
  onSignOut,
  sidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg text-[var(--color-text)] transition-colors hover:bg-slate-100 lg:hidden"
          onClick={onToggleSidebar}
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-all ${sidebarOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-all ${sidebarOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-all ${sidebarOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="Retinher CMS - Inicio"
        >
          <img
            src="/retiner1.png"
            alt="Retinher"
            className="h-16 w-auto object-contain object-left sm:h-16"
          />
          <span className="hidden font-semibold text-[var(--color-title)] sm:inline">
            CMS
          </span>
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className="max-w-[120px] truncate text-sm text-[var(--color-text-muted)] sm:max-w-[180px]"
          title={user?.email ?? ''}
        >
          {user?.email}
        </span>
        <button
          type="button"
          onClick={onSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-slate-100 hover:text-[var(--color-text)]"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
