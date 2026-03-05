import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
import { useContent } from '../contexts/ContentContext'
import { UbicacionMapa } from '../components/shared/UbicacionMapa'

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

export function SedesPage() {
  const { data } = useContent()
  const sedesData = (
    data as {
      sedes?: {
        titulo: string
        subtitulo: string
        sedes: SedeItem[]
      }
    }
  )?.sedes
  const footer = (data as { footer?: { pbx: string; email: string; soloLlamadas?: string; soloMensaje?: string; emailGestion?: string; emailGeneral?: string } })?.footer
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
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' },
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

  if (!sedesData || !footer) return null
  const sedesList = sedesData.sedes ?? []
  if (sedesList.length === 0) return null

  return (
    <div className="sedes-page min-h-screen bg-white">
      {/* Hero */}
      <section
        ref={heroRef}
        className="px-8 py-32"
        style={{
          backgroundImage: `url('/sedes.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
          <h1
            className="sedes-hero-title text-5xl md:text-7xl font-bold tracking-tighter text-white"
            style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              letterSpacing: '-0.02em',
            }}
          >
            {sedesData.titulo}
          </h1>
          <p
            className="sedes-hero-subtitle mt-6 text-xl text-white/90"
            style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              letterSpacing: '-0.02em',
            }}
          >
            {sedesData.subtitulo}
          </p>
        </div>
      </section>

      {/* Cards: una por sede (dirección + horario) y una de contacto */}
      <section
        className="relative px-8 py-20"
        style={{ backgroundColor: '#f4f7f9' }}
      >
        <div
          ref={cardsRef}
          className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {sedesList.map((sede) => (
            <div
              key={sede.id}
              className="sedes-card flex flex-col rounded-3xl border-2 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
              style={{ borderColor: '#0056b3' }}
            >
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'rgba(0, 86, 179, 0.1)' }}
              >
                <MapPin
                  className="h-7 w-7"
                  style={{ color: '#0056b3' }}
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{sede.nombre}</h3>
              <p className="mt-2 text-slate-600 text-justify">{sede.direccion}</p>
              <p className="text-slate-600 text-justify">{sede.barrio}</p>
              <p className="text-slate-600 text-justify">{sede.ciudad}</p>
              <div className="mt-4 flex items-start gap-2 text-slate-600">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#0056b3' }} strokeWidth={1.5} />
                <span className="whitespace-pre-line text-sm text-justify block">{sede.horario}</span>
              </div>
            </div>
          ))}

          <div
            className="sedes-card flex flex-col rounded-3xl border-2 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
            style={{ borderColor: '#0056b3' }}
          >
            <div
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'rgba(0, 86, 179, 0.1)' }}
            >
              <Phone
                className="h-7 w-7"
                style={{ color: '#0056b3' }}
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Contacto</h3>
            <p className="mt-2 text-slate-600 text-justify">
              Sólo llamadas:{" "}
              <a href={`tel:${footer.soloLlamadas ?? "3218373481"}`} className="text-[var(--color-btn)] hover:opacity-90">
                {footer.soloLlamadas ?? "3218373481"}
              </a>
            </p>
            <p className="mt-1 text-slate-600 text-justify">
              Sólo mensaje:{" "}
              <a href={`tel:${footer.soloMensaje ?? "3227861029"}`} className="text-[var(--color-btn)] hover:opacity-90">
                {footer.soloMensaje ?? "3227861029"}
              </a>
            </p>
            <a
              href={`mailto:${footer.emailGestion ?? "Gestión.retinhersas@gmail.com"}`}
              className="mt-2 flex items-center gap-2 text-slate-600 hover:text-[var(--color-btn)]"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {footer.emailGestion ?? "Gestión.retinhersas@gmail.com"}
            </a>
            <a
              href={`mailto:${footer.emailGeneral ?? "retinhersas@gmail.com"}`}
              className="mt-1 flex items-center gap-2 text-slate-600 hover:text-[var(--color-btn)]"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {footer.emailGeneral ?? "retinhersas@gmail.com"}
            </a>
          </div>
        </div>
      </section>

      {/* Mapas (uno por sede) */}
      <UbicacionMapa />
    </div>
  )
}
