const SITE_NAME = 'Retinher'

/** Descripción por defecto para buscadores y redes sociales */
export const DEFAULT_DESCRIPTION =
  'Retinher — Centro de especialidades en Cali. Atención en oftalmología, UCAD Te Veo y Ves, y programas de transformación visual.'

/** Configuración SEO por ruta: título de página y meta description */
export const SEO_BY_PATH: Record<string, { title: string; description: string }> = {
  '/': {
    title: `Inicio | ${SITE_NAME} — Centro de Especialidades`,
    description: DEFAULT_DESCRIPTION,
  },
  '/nosotros': {
    title: `Nosotros | ${SITE_NAME} — Centro de Especialidades`,
    description:
      'Conoce a Retinher: nuestro equipo, historia y compromiso con la salud visual en Cali.',
  },
  '/ucad-te-veo-te-ves': {
    title: `UCAD Te Veo y Ves | ${SITE_NAME}`,
    description:
      'Programa UCAD Te Veo y Ves: evaluación y acompañamiento en baja visión y rehabilitación visual.',
  },
  '/sedes': {
    title: `Sedes y contacto | ${SITE_NAME}`,
    description:
      'Ubicación de nuestras sedes en Cali, horarios y datos de contacto. Agenda tu cita.',
  },
  '/retinher-transforma': {
    title: `Retinher Transforma | ${SITE_NAME}`,
    description:
      'Retinher Transforma: programas y servicios para el cuidado y la mejora de tu visión.',
  },
}

/** Obtiene la config SEO para una ruta; si no existe, usa la de inicio */
export function getSEOForPath(pathname: string): { title: string; description: string } {
  const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  return SEO_BY_PATH[normalized] ?? SEO_BY_PATH['/']
}
