import { Link } from 'react-router-dom'
import { useContent } from '../../contexts/ContentContext'
import { UCAD_COLORS } from '../../constants/UCAD'

export function SectionUCAD() {
  const { data } = useContent()
  const ucad = (data as { ucadSection?: { titulo: string; subtitulo: string; descripcion: string; cta: string; logo: string; ruta: string } })?.ucadSection
  if (!ucad) return null
  const { titulo, subtitulo, descripcion, cta, logo, ruta } = ucad
  return (
    <section
      className="relative w-full overflow-hidden border-t border-slate-100 py-16 sm:py-20 md:py-24 lg:py-32 font-sans"
      style={{ backgroundColor: UCAD_COLORS.azulProfundo }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 sm:gap-12 md:gap-16 lg:gap-20 px-4 sm:px-6 md:px-8 md:flex-row md:items-center">
        {/* Logo izquierda */}
        <div className="flex shrink-0 w-full md:w-auto md:basis-1/3 justify-center md:justify-end">
          <div className="rounded-md p-6 sm:p-8 md:p-10 lg:p-12 bg-white max-w-[280px] sm:max-w-[320px] md:max-w-none">
            <img
              src={logo}
              alt={titulo}
              className="h-auto w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] mx-auto object-contain"
            />
          </div>
        </div>

        {/* Info derecha */}
        <div className="flex flex-1 flex-col items-center md:items-start gap-4 sm:gap-5 md:gap-6 text-center md:text-left w-full md:basis-2/3">
          <div>
            <p
              className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/80"
              style={{ color: UCAD_COLORS.grisTecnico }}
            >
              {subtitulo}
            </p>
            <h2
              className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              {titulo}
            </h2>
          </div>
          <p className="max-w-xl text-sm sm:text-base md:text-lg font-light leading-relaxed text-white/90">
            {descripcion}
          </p>
          <Link
            to={ruta}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white transition-all hover:scale-105 hover:bg-white/10"
            style={{ backgroundColor: UCAD_COLORS.azulUCAD }}
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
