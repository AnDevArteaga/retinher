export const ROUTES = {
  home: '/',
  nosotros: '/nosotros',
  ucad: '/ucad-te-veo-te-ves',
  sedes: '/sedes',
  contacto: '/contacto',
} as const

export const NAV_LINKS = [
  { to: ROUTES.home, label: 'Inicio' },
  { to: ROUTES.nosotros, label: 'Nosotros' },
  { to: ROUTES.ucad, label: 'UCAD Te Veo y Te Ves' },
  { to: ROUTES.sedes, label: 'Sedes' },
  { to: ROUTES.contacto, label: 'Contacto' },
] as const
