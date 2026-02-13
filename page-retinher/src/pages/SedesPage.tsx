import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
import { mockData } from '../data/MockData'
import { UbicacionMapa } from '../components/UbicacionMapa'

gsap.registerPlugin(ScrollTrigger)

const { sedes, footer } = mockData
const sede = sedes.sedePrincipal

export function SedesPage() {
  const heroRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const title = heroRef.current.querySelector('.sedes-hero-title')
        const subtitle = heroRef.current.querySelector('.sedes-hero-subtitle')
        gsap.fromTo(
          [title, subtitle],
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' }
        )
      }

      const cards = cardsRef.current?.querySelectorAll('.sedes-card')
      if (cards?.length) {
        gsap.set(cards, { opacity: 0, y: 40 })
        ScrollTrigger.batch(cards, {
          start: 'top 85%',
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power2.out',
            }),
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="sedes-page min-h-screen bg-white">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-8 py-32"
        style={{
          background: `linear-gradient(135deg, #003366 0%, #0056b3 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
              <MapPin className="h-10 w-10 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="sedes-hero-title text-5xl md:text-7xl font-bold tracking-tighter text-white">
            {sedes.titulo}
          </h1>
          <p className="sedes-hero-subtitle mt-6 text-xl text-white/90">
            {sedes.subtitulo}
          </p>
        </div>
      </section>

      {/* Cards de contacto */}
      <section className="relative px-8 py-20" style={{ backgroundColor: '#f4f7f9' }}>
        <div ref={cardsRef} className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="sedes-card flex flex-col rounded-3xl border-2 bg-white p-8 shadow-sm transition-all hover:shadow-xl" style={{ borderColor: '#0056b3' }}>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(0, 86, 179, 0.1)' }}>
              <MapPin className="h-7 w-7" style={{ color: '#0056b3' }} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Dirección</h3>
            <p className="mt-2 text-slate-600">{sede.direccion}</p>
            <p className="text-slate-600">{sede.barrio}</p>
            <p className="text-slate-600">{sede.ciudad}</p>
          </div>

          <div className="sedes-card flex flex-col rounded-3xl border-2 bg-white p-8 shadow-sm transition-all hover:shadow-xl" style={{ borderColor: '#0056b3' }}>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(0, 86, 179, 0.1)' }}>
              <Clock className="h-7 w-7" style={{ color: '#0056b3' }} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Horario</h3>
            <p className="mt-2 text-slate-600">Lun - Vie</p>
            <p className="text-slate-500 text-sm">Horarios de atención</p>
          </div>

          <div className="sedes-card flex flex-col rounded-3xl border-2 bg-white p-8 shadow-sm transition-all hover:shadow-xl" style={{ borderColor: '#0056b3' }}>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(0, 86, 179, 0.1)' }}>
              <Phone className="h-7 w-7" style={{ color: '#0056b3' }} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Contacto</h3>
            <p className="mt-2 text-slate-600">{footer.pbx}</p>
            <a href={`mailto:${footer.email}`} className="mt-2 flex items-center gap-2 text-slate-600 hover:text-[var(--color-btn)]">
              <Mail className="h-4 w-4" />
              {footer.email}
            </a>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <UbicacionMapa />
    </div>
  )
}
