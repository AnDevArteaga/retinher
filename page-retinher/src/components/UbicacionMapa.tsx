import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mockData } from '../data/MockData'

gsap.registerPlugin(ScrollTrigger)

const { sedePrincipal } = mockData.sedes

export function UbicacionMapa() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      const title = titleRef.current
      const map = mapRef.current
      const card = cardRef.current

      gsap.set([title, map], { opacity: 0, y: 50 })
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          })
          gsap.to(map, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: 0.2,
            ease: 'power2.out',
          })
          if (card)
            gsap.to(card, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: 0.5,
              ease: 'power2.out',
            })
        },
      })

      if (card) gsap.set(card, { opacity: 0, x: -40 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 bg-white"
    >
      <div className="mx-auto max-w-7xl px-8">
        <div ref={titleRef} className="mb-16 text-center">
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900"
            style={{ letterSpacing: '-0.02em' }}
          >
            Nuestra{' '}
            <span className="text-[var(--color-btn)]">Sede Principal</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Montería, Córdoba — Centro de Especialidades Oftalmológicas
          </p>
        </div>

        <div
          ref={mapRef}
          className="relative overflow-hidden rounded-[3rem] border-8 border-slate-100 shadow-2xl transition-all duration-700 hover:scale-[1.01] group"
        >
          <div className="absolute inset-0 pointer-events-none border-[1px] border-black/5 rounded-[2.5rem] z-10" />

          <iframe
            src={sedePrincipal.mapaEmbedUrl}
            title="Ubicación RETINHER - Sede Principal"
            className="w-full h-[500px] md:h-[600px] grayscale-[0.2] contrast-[1.1] transition-all duration-700 group-hover:grayscale-0"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div
            ref={cardRef}
            className="absolute bottom-8 left-8 z-20 hidden md:block max-w-sm rounded-3xl bg-white/95 p-8 backdrop-blur-md shadow-xl border border-slate-100"
          >
            <h4 className="font-bold text-slate-900 text-lg">Visítanos</h4>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              {sedePrincipal.direccion}
              <br />
              {sedePrincipal.barrio}
              <br />
              {sedePrincipal.ciudad}
            </p>
            <div className="mt-4 h-[1px] w-full bg-slate-200" />
            <p className="mt-4 text-xs font-black uppercase tracking-widest text-[var(--color-btn)]">
              Abierto: {sedePrincipal.horario}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sedePrincipal.direccion + ', ' + sedePrincipal.ciudad)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-[var(--color-btn)] hover:underline"
            >
              Cómo llegar →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
