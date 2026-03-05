import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../contexts/ContentContext'
import { ROUTES } from '../../constants/routes'

gsap.registerPlugin(ScrollTrigger)

export function SectionSellosReconocimientosHome() {
  const { data } = useContent()
  const sellos = (data as { sellosReconocimientos?: { titulo: string; subtitulo: string; cta: string; sellos: Array<{ id: string; titulo: string; subtitulo: string; descripcion: string; imagen: string }> } })?.sellosReconocimientos
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sellos?.sellos?.length) return
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.sello-card-home')
      if (cards?.length) {
        gsap.set(cards, { opacity: 0, y: 40 })
        ScrollTrigger.batch(cards, {
          start: 'top 88%',
          onEnter: (batch) => {
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' })
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [sellos?.sellos?.length])

  if (!sellos || !sellos.sellos?.length) return null

  return (
    <section ref={sectionRef} className="mx-auto max-w-6xl px-8 py-20 md:py-28" id="sellos">
      <div className="mb-14 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[var(--color-title)]">
          {sellos.titulo}
        </h2>
        <p className="mt-4 text-slate-500 text-lg text-justify max-w-2xl mx-auto">{sellos.subtitulo}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {sellos.sellos.map((s) => (
          <div
            key={s.id}
            className="sello-card-home rounded-2xl md:rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center"
          >
            <div className="h-32 w-full flex items-center justify-center mb-4">
              <img src={s.imagen} alt={s.titulo} className="max-h-full w-full object-contain" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-title)]">{s.titulo}</h3>
            <p className="mt-1 text-sm text-slate-500 text-justify">{s.subtitulo}</p>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed line-clamp-3 text-justify">
              {s.descripcion}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          to={ROUTES.retinherTransforma}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-btn)] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-btn-hover)] hover:scale-105"
        >
          Descubre Retinher Transforma
        </Link>
      </div>
    </section>
  )
}
