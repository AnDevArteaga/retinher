export const ROUTES = {
  home: '/',
  nosotros: '/nosotros',
  ucad: '/ucad-te-veo-te-ves',
  sedes: '/sedes',
  retinherTransforma: '/retinher-transforma',
  informes: '/informes',
} as const

export const NAV_LINKS = [
  { to: ROUTES.home, label: 'Inicio' },
  { to: ROUTES.nosotros, label: 'Nosotros' },
  { to: ROUTES.ucad, label: 'UCAD Te Veo y Ves' },
  { to: ROUTES.retinherTransforma, label: 'Retinher Transforma' },
  { to: ROUTES.informes, label: 'Informes' },
  { to: ROUTES.sedes, label: 'Sedes' },
] as const
