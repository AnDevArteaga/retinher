import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Target,
  Eye,
  TrendingUp,
  Users,
  Heart,
  Award,
  Zap,
  Handshake,
  Globe,
  Activity,
  MapPin,
  AlertTriangle,
  // Building2,
  Search,
  // Calendar,
} from 'lucide-react'
import { useContent } from '../contexts/ContentContext'
import { UCAD_COLORS } from '../constants/UCAD'
// import { Button } from '../components/ui/button'

const ICON_MAP = { Users, TrendingUp, Activity, Zap, Award, Heart, Target } as const
const COLOR_MAP: Record<string, string> = { verdeReti: UCAD_COLORS.verdeReti, azulUCAD: UCAD_COLORS.azulUCAD, rojoAlerta: UCAD_COLORS.rojoAlerta }

gsap.registerPlugin(ScrollTrigger)

const FALLBACK_GALLERY = [
  { id: 'g1', src: '/1.jpeg', alt: 'UCAD Te Veo y Te Ves' },
  { id: 'g2', src: '/2.jpeg', alt: 'UCAD Te Veo y Te Ves' },
  { id: 'g3', src: '/3.jpeg', alt: 'UCAD Te Veo y Te Ves' },
  { id: 'g4', src: '/4.jpeg', alt: 'UCAD Te Veo y Te Ves' },
  { id: 'g5', src: '/5.jpeg', alt: 'UCAD Te Veo y Te Ves' },
  { id: 'g6', src: '/6.jpeg', alt: 'UCAD Te Veo y Te Ves' },
  { id: 'g7', src: '/7.jpeg', alt: 'UCAD Te Veo y Te Ves' },
  { id: 'g8', src: '/8.jpg', alt: 'UCAD Te Veo y Te Ves' },
  { id: 'g9', src: '/9.jpg', alt: 'UCAD Te Veo y Te Ves' },
]

export function UCADPage() {
  const { data } = useContent()
  const ucadPage = (data as { ucadPage?: { tituloGaleria: string; subtituloGaleria: string; infografiaUrl: string; alcanceTitulo: string; alcanceTexto: string; poblacionTitulo: string; poblacionTexto: string; galleryItems: Array<{ id: string; src: string; alt: string }>; metas: Array<{ id: string; valor: string; label: string; descripcion: string; icon: string; color: string }> } })?.ucadPage

  const galleryTitle = ucadPage?.tituloGaleria ?? 'En imágenes'
  const gallerySubtitle = ucadPage?.subtituloGaleria ?? 'UCAD Te Veo y Te Ves en acción'
  const UCAD_IMAGES = (ucadPage?.galleryItems?.length ? ucadPage.galleryItems : FALLBACK_GALLERY) as Array<{ id: string; src: string; alt: string }>
  const METAS_DATA = ucadPage?.metas?.length
    ? ucadPage.metas.map((m) => ({ ...m, desc: m.descripcion, icon: ICON_MAP[m.icon as keyof typeof ICON_MAP] ?? Activity, color: COLOR_MAP[m.color] ?? UCAD_COLORS.verdeReti }))
    : [
        { id: 'm1', valor: '80%', label: 'Cobertura', desc: 'Tamizaje anual en población de riesgo identificada', descripcion: 'Tamizaje anual en población de riesgo identificada', icon: Users, color: UCAD_COLORS.verdeReti },
        { id: 'm2', valor: '90%', label: 'Seguimiento', desc: 'Efectividad en la Red de Referencia Digital', descripcion: 'Efectividad en la Red de Referencia Digital', icon: TrendingUp, color: UCAD_COLORS.verdeReti },
        { id: 'm3', valor: '80%', label: 'Estabilización', desc: 'Clínica de retinopatía a los 12 meses de manejo', descripcion: 'Clínica de retinopatía a los 12 meses de manejo', icon: Activity, color: UCAD_COLORS.verdeReti },
        { id: 'm4', valor: '< 7 Días', label: 'Oportunidad', desc: 'Meta para remisiones de alta prioridad', descripcion: 'Meta para remisiones de alta prioridad', icon: Zap, color: UCAD_COLORS.azulUCAD },
        { id: 'm5', valor: '-10%', label: 'Eficiencia', desc: 'Reducción anual en costo operativo por paciente tamizado mediante innovación', descripcion: 'Reducción anual en costo operativo por paciente tamizado mediante innovación', icon: TrendingUp, color: UCAD_COLORS.verdeReti },
      ]

  const heroRef = useRef<HTMLElement>(null)
  const platformRef = useRef<HTMLElement>(null)
  const metasRef = useRef<HTMLElement>(null)
  const adnRef = useRef<HTMLElement>(null)
  const alcanceRef = useRef<HTMLElement>(null)
  const clasificacionRef = useRef<HTMLElement>(null)
  const metasCardsRef = useRef<HTMLDivElement[]>([])
  const valoresRef = useRef<HTMLDivElement[]>([])
  const riesgoCardsRef = useRef<HTMLDivElement[]>([])
  const presentacionRef = useRef<HTMLElement>(null)
  const infographicRef = useRef<HTMLElement>(null)
  const retinaEtapasRef = useRef<HTMLElement>(null)
  const visionPacienteRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLElement>(null)
  const galleryTrackRef = useRef<HTMLDivElement>(null)

  // Imágenes de fondo de ojo por etapa (colocar en public/ucad/ o sustituir por URLs)
  const RETINA_ETAPAS = [
    { id: 'normal', label: 'Retina normal', src: '/normal.jpeg' },
    { id: 'leve', label: 'Retinopatía Diabética Leve', src: '/leve.jpeg' },
    {
      id: 'npdr-moderada',
      label: 'Retinopatía Diabética no Proliferativa Moderada',
      src: '/moderada.jpeg',
    },
    {
      id: 'npdr-severa',
      label: 'Retinopatía Diabética no Proliferativa Severa',
      src: '/severa.jpeg',
    },
  ]
  const VISION_PACIENTE_SRC = '/comove.jpeg'

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    const refreshSt = () => ScrollTrigger.refresh()
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const title = heroRef.current.querySelector('.ucad-hero-title')
        const subtitle = heroRef.current.querySelector('.ucad-hero-subtitle')
        gsap.fromTo(
          [title, subtitle],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' },
        )
      }

      const platformEls =
        platformRef.current?.querySelectorAll('.ucad-animate') || []
      gsap.set(platformEls, { opacity: 0, y: 30 })
      ScrollTrigger.batch(platformEls, {
        start: 'top 80%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
          }),
      })

      const metasCards = metasCardsRef.current.filter(Boolean)
      gsap.set(metasCards, { opacity: 0, y: 60 })
      ScrollTrigger.batch(metasCards, {
        start: 'top 75%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power2.out',
          }),
      })

      const valores = valoresRef.current.filter(Boolean)
      gsap.set(valores, { opacity: 0, x: -30 })
      ScrollTrigger.batch(valores, {
        start: 'top 80%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
          }),
      })

      const alcanceEls =
        alcanceRef.current?.querySelectorAll('.ucad-animate') || []
      gsap.set(alcanceEls, { opacity: 0, filter: 'blur(8px)' })
      ScrollTrigger.batch(alcanceEls, {
        start: 'top 82%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.08,
            ease: 'power2.out',
          }),
      })

      const riesgoCards = riesgoCardsRef.current.filter(Boolean)
      gsap.set(riesgoCards, { opacity: 0, scale: 0.95 })
      ScrollTrigger.batch(riesgoCards, {
        start: 'top 75%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
          }),
      })

      const presentacionEls =
        presentacionRef.current?.querySelectorAll('.ucad-animate') || []
      ScrollTrigger.batch(presentacionEls, {
        start: 'top 85%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out',
          }),
      })
      gsap.set(presentacionEls, { opacity: 0, y: 24 })

      // Etapas retinopatía: entrada suave al llegar a la sección (stagger en cards)
      const retinaSection = retinaEtapasRef.current
      const retinaEls =
        retinaSection?.querySelectorAll('.retina-etapa-item') || []
      if (retinaSection && retinaEls.length) {
        gsap.set(retinaEls, { opacity: 0, y: 32 })
        ScrollTrigger.batch(retinaEls, {
          start: 'top 82%',
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power2.out',
            }),
        })
      }

      const visionEl = visionPacienteRef.current?.querySelector('.ucad-animate')
      if (visionEl) {
        gsap.set(visionEl, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: visionPacienteRef.current,
          start: 'top 80%',
          onEnter: () =>
            gsap.to(visionEl, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power2.out',
            }),
        })
      }

      const infographicLeft =
        infographicRef.current?.querySelector('.infographic-left')
      const infographicRight =
        infographicRef.current?.querySelector('.infographic-right')
      if (infographicLeft && infographicRight) {
        gsap.set(infographicLeft, { opacity: 0, x: -60 })
        gsap.set(infographicRight, { opacity: 0, x: 60 })
        ScrollTrigger.create({
          trigger: infographicRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(infographicLeft, {
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: 'power2.out',
            })
            gsap.to(infographicRight, {
              opacity: 1,
              x: 0,
              duration: 0.9,
              delay: 0.15,
              ease: 'power2.out',
            })
          },
        })
      }

      // Animación galería: al llegar a la sección se fija y el scroll mueve el carril horizontal
      const gallerySection = galleryRef.current
      const galleryTrack = galleryTrackRef.current
      if (gallerySection && galleryTrack) {
        const trackWidth = galleryTrack.scrollWidth
        const distance = -(trackWidth - window.innerWidth)
        if (distance < 0) {
          gsap.to(galleryTrack, {
            x: distance,
            ease: 'none',
            scrollTrigger: {
              trigger: gallerySection,
              start: 'top top',
              end: () => `+=${trackWidth}`,
              pin: true,
              scrub: 1,
            },
          })
        }
      }
      refreshSt()
      window.addEventListener('load', refreshSt)
      timeoutId = setTimeout(refreshSt, 400)
    })
    return () => {
      ctx.revert()
      window.removeEventListener('load', refreshSt)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="ucad-page min-h-screen bg-white">
      {/* 1. HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 md:px-12"
        style={{
          backgroundImage: `url('https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/bg-tv.png.jpg')`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_256_256%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.9%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-12 flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {/* <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Building2 className="h-7 w-7 text-white" strokeWidth={1.5} />
              </div>
              <span className="ucad-hero-title text-xl font-semibold uppercase tracking-[0.2em] text-white/90 md:text-2xl">
                RETINHER S.A.S
              </span>
            </div>
            <span className="hidden text-white/40 md:inline">|</span> */}
            <div className="flex items-center gap-3">
              <h1
                className="ucad-hero-title text-5xl font-bold tracking-tight text-white md:text-7xl"
                style={{ letterSpacing: '-0.02em', wordSpacing: '0.1em' }}
              >
                UCAD TE VEO Y VES
              </h1>
            </div>
          </div>

          <div className="ucad-hero-subtitle mb-8 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2">
              <span className="text-base text-white/95 md:text-lg">
                Unidad Clínica de Alto Desempeño — Modelo EFQM
              </span>
            </div>
          </div>

          <div className="mb-12 rounded-3xl border-2 border-white/20 bg-white/5 p-8 text-center backdrop-blur-sm md:p-10">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Target className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h2
              className="mb-2 text-2xl font-bold text-white md:text-3xl"
              style={{ letterSpacing: '-0.02em', wordSpacing: '0.1em' }}
            >
              Programa de Prevención de Ceguera <br /> en Pacientes Diabéticos
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-white/90" strokeWidth={1.5} />
              <span className="text-lg text-white/90">Cuidado Integral</span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-6 w-6 text-white/90" strokeWidth={1.5} />
              <span className="text-lg text-white/90">Detección Temprana</span>
            </div>
          </div>
          {/* <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <span className="text-sm uppercase tracking-[0.15em] text-white/80 md:text-base">
                Centro de Especialidades Oftalmológicas
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-white/80" strokeWidth={1.5} />
                <span className="text-sm text-white/80">2025-2028</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-white/80" strokeWidth={1.5} />
                <span className="text-sm text-white/80">Córdoba, Colombia</span>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* 2. PRESENTACIÓN — Diabetes, Retina, Retinopatía Diabética */}
      <section
        ref={presentacionRef}
        className="relative px-6 py-20 md:px-12 md:py-28"
        style={{ backgroundColor: '#fff' }}
      >
        <div className="mx-auto max-w-4xl">
          <h2
            className="ucad-animate mb-12 text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: UCAD_COLORS.azulProfundo }}
          >
            Contexto: Diabetes, Retina y Retinopatía Diabética
          </h2>

          <div className="space-y-6 text-slate-700 leading-relaxed md:text-lg text-justify">
            <p className="ucad-animate">
              La diabetes es una enfermedad enigmática, complicada y progresiva
              que afecta a los vasos sanguíneos y ocasiona importantes
              trastornos en los ojos. La <strong>retina</strong> es una fina
              capa de células nerviosas que recubre la parte interna del ojo y
              es responsable de la formación de la imagen. La{' '}
              <strong>mácula</strong> es la parte central y más sensible de la
              retina; proporciona la visión central, nítida y detallada en
              colores.
            </p>
            <p className="ucad-animate">
              La <strong>retinopatía diabética</strong> es una complicación de
              la diabetes no controlada. Ocasiona deterioro de los vasos
              sanguíneos de la retina y puede afectar seriamente la visión. Al
              principio la visión no se encuentra afectada, por eso es
              indispensable realizar un examen de fondo de ojo periódico para
              detectar trastornos retinianos y recibir tratamiento oportuno que
              impida que la visión se deteriore y se pierda irremediablemente.
            </p>
            <p className="ucad-animate">
              La retinopatía diabética es la{' '}
              <strong>
                mayor causa de ceguera prevenible en adultos en edad productiva
              </strong>
              . Se estima que más de 93 millones de personas tienen retinopatía
              diabética y que ese número se duplicará hacia 2030, cuando
              existirán alrededor de 366 millones de personas diabéticas en el
              mundo y casi la mitad tendrán algún grado de retinopatía
              diabética.
            </p>
          </div>
        </div>
      </section>

      {/* 3. RETINA: etapas de la retinopatía diabética */}
      <section
        ref={retinaEtapasRef}
        className="relative px-6 py-20 md:px-12 md:py-28"
        style={{ backgroundColor: UCAD_COLORS.grisTecnico }}
      >
        <div className="mx-auto max-w-6xl">
          <h2
            className="retina-etapa-item mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: UCAD_COLORS.azulProfundo }}
          >
            Retina: etapas de la retinopatía diabética
          </h2>
          <p className="retina-etapa-item mb-12 text-slate-600 md:text-lg text-justify">
            Fondos de ojo según la clasificación.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RETINA_ETAPAS.map((item) => (
              <div
                key={item.id}
                className="retina-etapa-item overflow-hidden rounded-2xl border-2 bg-white shadow-md transition-shadow hover:shadow-lg"
                style={{ borderColor: UCAD_COLORS.azulUCAD }}
              >
                <div className="aspect-[4/3] bg-slate-100">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.background =
                        'linear-gradient(135deg,#e2e8f0 0%,#cbd5e1 100%)'
                      target.alt = item.label
                    }}
                  />
                </div>
                <div className="border-t border-slate-100 px-4 py-3">
                  <p
                    className="text-center text-sm font-semibold leading-snug md:text-base"
                    style={{ color: UCAD_COLORS.azulProfundo }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CLASIFICACIÓN DEL RIESGO */}
      <section
        ref={clasificacionRef}
        className="px-8 py-32"
        style={{ backgroundColor: UCAD_COLORS.grisTecnico }}
      >
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-6 text-center text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: UCAD_COLORS.azulProfundo }}
          >
            Clasificación del Riesgo
          </h2>
          <p className="mb-16 text-center text-slate-600">
            Protocolos de seguimiento
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div
              ref={(el) => {
                riesgoCardsRef.current[0] = el!
              }}
              className="rounded-3xl border-2 p-8"
              style={{
                borderColor: UCAD_COLORS.verdeReti,
                backgroundColor: 'white',
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <Activity
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.verdeReti }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.azulProfundo }}
                >
                  Riesgo Bajo/Leve
                </h3>
              </div>
              <p className="text-slate-600 text-justify">
                Control anual o cada 6-12 meses en UCAD.
              </p>
            </div>

            <div
              ref={(el) => {
                riesgoCardsRef.current[1] = el!
              }}
              className="rounded-3xl border-2 p-8"
              style={{
                borderColor: UCAD_COLORS.azulUCAD,
                backgroundColor: 'white',
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <TrendingUp
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.azulUCAD }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.azulProfundo }}
                >
                  Riesgo Moderado
                </h3>
              </div>
              <p className="text-slate-600 text-justify">
                Optimización de metas metabólicas y control semestral.
              </p>
            </div>

            <div
              ref={(el) => {
                riesgoCardsRef.current[2] = el!
              }}
              className="rounded-3xl border-2 p-8"
              style={{
                borderColor: UCAD_COLORS.rojoAlerta,
                backgroundColor: 'white',
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <AlertTriangle
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.rojoAlerta }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.rojoAlerta }}
                >
                  Alto/Muy Alto Riesgo
                </h3>
              </div>
              <p className="font-medium text-slate-700 text-justify">
                RD Severa o Proliferativa:{' '}
                <span
                  className="font-extrabold"
                  style={{ color: UCAD_COLORS.rojoAlerta }}
                >
                  Referencia inmediata
                </span>{' '}
                a especialista en Retina para tratamiento láser o cirugía.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CÓMO VE EL PACIENTE EN CADA ETAPA */}
      <section
        ref={visionPacienteRef}
        className="relative px-6 py-20 md:px-12 md:py-28"
        style={{ backgroundColor: '#fff' }}
      >
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: UCAD_COLORS.azulProfundo }}
          >
            Cómo ve el paciente en cada etapa
          </h2>
          <p className="mb-12 text-slate-600 md:text-lg text-justify">
            Simulación de la visión según el grado de afectación
          </p>
          <div
            className="ucad-animate overflow-hidden rounded-2xl border-2 shadow-xl"
            style={{ borderColor: UCAD_COLORS.azulUCAD }}
          >
            <img
              src={VISION_PACIENTE_SRC}
              alt="Diseño que muestra cómo ve el paciente en cada etapa de la retinopatía diabética"
              className="h-auto w-full object-contain"
              onError={(e) => {
                const target = e.currentTarget
                target.style.background =
                  'linear-gradient(135deg,#f4f7f9 0%,#e2e8f0 100%)'
                target.alt = 'Cómo ve el paciente en cada etapa'
              }}
            />
          </div>
        </div>
      </section>

      {/* 5. INFOGRAFÍA — izquierda: texto | derecha: infografía */}
      <section
        ref={infographicRef}
        className="relative px-8 py-24 md:py-32"
        style={{ backgroundColor: UCAD_COLORS.grisTecnico }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:items-center md:gap-16">
          <div className="infographic-left flex flex-1 flex-col justify-center md:order-1">
            <h2
              className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl"
              style={{ color: UCAD_COLORS.azulProfundo }}
            >
              Te Veo y Ves:
            </h2>
            <p className="mb-8 text-2xl font-medium text-slate-600 md:text-3xl text-justify">
              así cuidamos tu visión
            </p>
            <p className="text-lg text-slate-500 md:text-xl text-justify">
              Programa de prevención de ceguera por diabetes — Córdoba
            </p>
          </div>
          <div
            className="infographic-right flex flex-1 overflow-hidden rounded-2xl border-2 shadow-xl"
            style={{ borderColor: UCAD_COLORS.azulUCAD }}
          >
            <img
              src={ucadPage?.infografiaUrl ?? "/infografia.jpeg"}
              alt="Infografía UCAD Te Veo y Te Ves"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* 6. GALERÍA DE IMÁGENES — pin + scrub al llegar aquí */}
      <section
        ref={galleryRef}
        className="relative h-screen overflow-hidden"
        style={{ backgroundColor: UCAD_COLORS.azulProfundo }}
      >
        <div className="absolute left-0 top-0 z-10 px-8 pt-24 md:px-12">
          <h2 className="text-4xl font-bold tracking-tighter text-white md:text-5xl">
            {galleryTitle}
          </h2>
          <p className="mt-2 text-lg text-white/80">
            {gallerySubtitle}
          </p>
        </div>
        <div
          ref={galleryTrackRef}
          className="absolute left-0 top-0 flex h-full items-center gap-6 pl-8 pt-32 md:gap-8 md:pl-12"
          style={{ width: 'max-content' }}
        >
          {UCAD_IMAGES.map((img) => (
            <div
              key={img.id}
              className="relative flex h-[65vh] w-[85vw] flex-shrink-0 overflow-hidden rounded-3xl border-2 shadow-2xl md:w-[70vw] lg:w-[55vw]"
              style={{ borderColor: UCAD_COLORS.azulUCAD }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-sm font-medium text-white">{img.alt}</p>
              </div>
            </div>
          ))}
          <div className="h-[65vh] w-8 flex-shrink-0" aria-hidden />
        </div>
      </section>

      {/* 7. PLATAFORMA ESTRATÉGICA */}
      <section
        ref={platformRef}
        className="relative px-8 py-32"
        style={{ backgroundColor: UCAD_COLORS.grisTecnico }}
      >
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-12 text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: UCAD_COLORS.azulProfundo }}
          >
            Plataforma Estratégica
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div
              className="ucad-animate rounded-3xl border-2 p-8 md:p-10"
              style={{
                borderColor: UCAD_COLORS.azulUCAD,
                backgroundColor: 'white',
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <Target
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.azulUCAD }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.azulProfundo }}
                >
                  Propósito
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-justify">
                Reducir la pérdida de visión irreversible en personas con
                diabetes, centralizando el esfuerzo en el cuidado humanizado.
              </p>
            </div>

            <div
              className="ucad-animate rounded-3xl border-2 p-8 md:p-10"
              style={{
                borderColor: UCAD_COLORS.azulUCAD,
                backgroundColor: 'white',
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <Eye
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.azulUCAD }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.azulProfundo }}
                >
                  Visión 2028
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-justify">
                Ser el modelo referente regional en excelencia operativa para un
                futuro sin retinopatía diabética evitable.
              </p>
            </div>

            <div
              className="ucad-animate md:col-span-2 rounded-3xl border-2 p-8 md:p-10"
              style={{
                borderColor: UCAD_COLORS.azulUCAD,
                backgroundColor: 'white',
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <Activity
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.azulUCAD }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.azulProfundo }}
                >
                  Ejes de Impacto
                </h3>
              </div>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  'Detección Proactiva',
                  'Derivación Oportuna',
                  'Liderazgo Regional',
                  'Mejora de la Calidad de Vida',
                ].map((eje) => (
                  <li key={eje} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: UCAD_COLORS.verdeReti }}
                    />
                    <span className="text-slate-600">{eje}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="ucad-animate md:col-span-2 rounded-3xl border-2 p-8 md:p-10"
              style={{
                borderColor: UCAD_COLORS.azulUCAD,
                backgroundColor: 'white',
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <Award
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.azulUCAD }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.azulProfundo }}
                >
                  Alineación
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-justify">
                Articulado con el Modelo MAITE y estándares de acreditación
                REDER.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. METAS E INDICADORES */}
      <section ref={metasRef} className="px-8 py-32">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-16 text-center text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: UCAD_COLORS.azulProfundo }}
          >
            Metas e Indicadores de Éxito
          </h2>
          <p className="mb-16 text-center text-slate-600">2025-2026</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {METAS_DATA.map((meta, i) => (
              <div
                key={meta.id ?? meta.label}
                ref={(el) => {
                  metasCardsRef.current[i] = el!
                }}
                className="flex flex-col rounded-3xl border-2 p-8"
                style={{
                  borderColor: UCAD_COLORS.azulUCAD,
                  backgroundColor: UCAD_COLORS.grisTecnico,
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <meta.icon
                    className="h-8 w-8"
                    style={{ color: meta.color }}
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-4xl font-extrabold"
                    style={{ color: meta.color }}
                  >
                    {meta.valor}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {meta.label}
                </h3>
                <p className="mt-2 text-slate-600 text-justify">{meta.desc ?? meta.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ADN ORGANIZACIONAL */}
      <section
        ref={adnRef}
        className="px-8 py-32"
        style={{ backgroundColor: UCAD_COLORS.grisTecnico }}
      >
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-16 text-center text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: UCAD_COLORS.azulProfundo }}
          >
            ADN Organizacional
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Heart,
                titulo: 'Humanización',
                desc: 'Atención cálida, empática y digna.',
              },
              {
                icon: Award,
                titulo: 'Calidad',
                desc: 'Procesos clínicos bajo estándares superiores.',
              },
              {
                icon: Zap,
                titulo: 'Innovación',
                desc: 'Adopción continua de nuevas tecnologías de atención.',
              },
              {
                icon: Handshake,
                titulo: 'Trabajo en Equipo',
                desc: 'Sinergia multidisciplinaria.',
              },
              {
                icon: Globe,
                titulo: 'Compromiso Social',
                desc: 'Foco en las comunidades más vulnerables de Córdoba.',
              },
            ].map((v, i) => (
              <div
                key={v.titulo}
                ref={(el) => {
                  valoresRef.current[i] = el!
                }}
                className="flex items-start gap-6 rounded-3xl border-2 p-8"
                style={{
                  borderColor: UCAD_COLORS.azulUCAD,
                  backgroundColor: 'white',
                }}
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${UCAD_COLORS.azulUCAD}15` }}
                >
                  <v.icon
                    className="h-7 w-7"
                    style={{ color: UCAD_COLORS.azulUCAD }}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: UCAD_COLORS.azulProfundo }}
                  >
                    {v.titulo}
                  </h3>
                  <p className="mt-2 text-slate-600 text-justify">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ALCANCE Y POBLACIÓN OBJETIVO */}
      <section ref={alcanceRef} className="px-8 py-32">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-16 text-center text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: UCAD_COLORS.azulProfundo }}
          >
            Alcance y Población Objetivo
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div
              className="ucad-animate rounded-3xl border-2 p-10"
              style={{
                borderColor: UCAD_COLORS.azulUCAD,
                backgroundColor: UCAD_COLORS.grisTecnico,
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <MapPin
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.azulUCAD }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.azulProfundo }}
                >
                  {ucadPage?.alcanceTitulo ?? 'Zona de Influencia'}
                </h3>
              </div>
              <p className="text-slate-600 text-justify whitespace-pre-line">
                {ucadPage?.alcanceTexto ?? 'Departamento de Córdoba (Sede principal en Montería + Unidad Móvil).'}
              </p>
            </div>

            <div
              className="ucad-animate rounded-3xl border-2 p-10"
              style={{
                borderColor: UCAD_COLORS.azulUCAD,
                backgroundColor: UCAD_COLORS.grisTecnico,
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <Users
                  className="h-8 w-8"
                  style={{ color: UCAD_COLORS.azulUCAD }}
                  strokeWidth={1.5}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: UCAD_COLORS.azulProfundo }}
                >
                  {ucadPage?.poblacionTitulo ?? 'Grupos Prioritarios'}
                </h3>
              </div>
              <ul className="space-y-3 text-slate-600 text-justify">
                {(ucadPage?.poblacionTexto ?? 'Pacientes Diabéticos Tipo I y II\nGestantes con diabetes (Alto riesgo de progresión)\nPacientes sin tamizaje reciente (>1 año sin fondo de ojo)').split('\n').filter((l) => l.trim()).map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span
                      className="h-2 w-2 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: UCAD_COLORS.verdeReti }}
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
