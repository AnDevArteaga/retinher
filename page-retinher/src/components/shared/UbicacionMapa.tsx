import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../contexts/ContentContext'

gsap.registerPlugin(ScrollTrigger)

type SedeItem = {
  id: string
  nombre: string
  direccion: string
  barrio: string
  ciudad: string
  horario: string
  mapaEmbedUrl: string
}

export function UbicacionMapa() {
  const { data } = useContent()
  const sedesPayload = (data as { sedes?: { sedes: SedeItem[] } })?.sedes
  const sedesList = sedesPayload?.sedes ?? []
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      const blocks = sectionRef.current.querySelectorAll('.ubicacion-block')
      blocks.forEach((block) => {
        const title = block.querySelector('.ubicacion-title')
        const map = block.querySelector('.ubicacion-map')
        const card = block.querySelector('.ubicacion-card')
        gsap.set([title, map], { opacity: 0, y: 50 })
        ScrollTrigger.create({
          trigger: block,
          start: 'top 75%',
          onEnter: () => {
            gsap.to(title, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
            gsap.to(map, { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'power2.out' })
            if (card) gsap.to(card, { opacity: 1, x: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' })
          },
        })
        if (card) gsap.set(card, { opacity: 0, x: -40 })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [sedesList.length])

  if (sedesList.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-8">
        {sedesList.map((sede) => (
          <div key={sede.id} className="ubicacion-block mb-24 last:mb-0">
            <div className="mb-16 text-center">
              <h2
                className="ubicacion-title text-4xl md:text-6xl font-bold tracking-tighter text-slate-900"
                style={{ letterSpacing: '-0.02em' }}
              >
                {sedesList.length > 1 ? sede.nombre : 'Nuestra Sede Principal'}
              </h2>
              {sedesList.length > 1 && (
                <p className="ubicacion-title mt-4 text-lg text-slate-500">
                  {sede.ciudad}
                </p>
              )}
            </div>

            <div
              className="ubicacion-map relative overflow-hidden rounded-[3rem] border-8 border-slate-100 shadow-2xl transition-all duration-700 hover:scale-[1.01] group"
            >
              <div className="absolute inset-0 pointer-events-none border-[1px] border-black/5 rounded-[2.5rem] z-10" />

              <iframe
                src={sede.mapaEmbedUrl}
                title={`Ubicación ${sede.nombre}`}
                className="w-full h-[500px] md:h-[600px] grayscale-[0.2] contrast-[1.1] transition-all duration-700 group-hover:grayscale-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div
                className="ubicacion-card absolute bottom-8 left-8 z-20 hidden md:block max-w-sm rounded-3xl bg-white/95 p-8 backdrop-blur-md shadow-xl border border-slate-100"
              >
                <h4 className="font-bold text-slate-900 text-lg">Visítanos</h4>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed text-justify">
                  {sede.direccion}
                  <br />
                  {sede.barrio}
                  <br />
                  {sede.ciudad}
                </p>
                <div className="mt-4 h-[1px] w-full bg-slate-200" />
                <p className="mt-4 text-xs font-black uppercase tracking-widest text-[var(--color-btn)]">
                  Horario de atención
                </p>
                <p className="mt-2 text-sm text-slate-600 whitespace-pre-line leading-relaxed text-justify">
                  {sede.horario}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sede.direccion + ', ' + sede.ciudad)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-[var(--color-btn)] hover:underline"
                >
                  Cómo llegar →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
