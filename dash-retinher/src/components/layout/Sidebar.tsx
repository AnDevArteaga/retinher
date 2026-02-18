import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, MapPin } from 'lucide-react'

const pages = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/nosotros', label: 'Nosotros', icon: Users },
  { to: '/sedes', label: 'Sedes', icon: MapPin },
]

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300 ease-out lg:relative lg:z-auto lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menú de navegación"
      >
        <div className="flex flex-col border-b border-slate-100 p-4 lg:p-5">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2">
            <img src="/retiner1.png" alt="Retinher" className="h-9 w-auto object-contain" />
            <span className="font-bold text-[var(--color-title)]">CMS</span>
          </NavLink>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {pages.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--color-btn)] text-[var(--color-btn-text)]'
                        : 'text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
