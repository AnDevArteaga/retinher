import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mockData } from '../data/MockData'

gsap.registerPlugin(ScrollTrigger)

const {
  heroImage,
  title,
  intro,
  mision,
  vision,
  valores,
  politicaCalidad,
  politicaSeguridad,
  serviceGroups,
} = mockData.nosotros

const ecosistemaImpacto = mockData.ecosistemaImpacto

const BENTO_CLASSES: Record<string, string> = {
  'red-hospitales-verdes': 'md:col-span-2',
  'cultura-seguridad': 'md:col-start-3 md:row-span-2 md:row-start-1',
  'reti-5r-semillero': '',
  'alianzas-estrategicas': '',
  'ucap-tv-obes': 'md:col-span-2',
}

const SELLO_BG: Record<string, string> = {
  verde: 'bg-emerald-50/90',
  azul: 'bg-sky-50/90',
  morado: 'bg-violet-50/90',
}

function highlightText(
  text: string,
  highlights: readonly string[],
): React.ReactNode {
  if (!highlights?.length) return text
  type Part =
    | { type: 'text'; value: string }
    | { type: 'highlight'; value: string }
  let parts: Part[] = [{ type: 'text', value: text }]
  const sorted = [...highlights]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  for (const term of sorted) {
    const next: Part[] = []
    for (const p of parts) {
      if (p.type === 'highlight') {
        next.push(p)
        continue
      }
      let rest = p.value
      while (rest.includes(term)) {
        const idx = rest.indexOf(term)
        const before = rest.slice(0, idx)
        rest = rest.slice(idx + term.length)
        if (before) next.push({ type: 'text', value: before })
        next.push({ type: 'highlight', value: term })
      }
      if (rest) next.push({ type: 'text', value: rest })
    }
    parts = next
  }
  let key = 0
  return parts.map((p) =>
    p.type === 'text' ? (
      p.value
    ) : (
      <span key={key++} className="font-extrabold text-inherit">
        {p.value}
      </span>
    ),
  )
}

export function NosotrosPage() {
  const missionRef = useRef<HTMLDivElement>(null)
  const visionRef = useRef<HTMLDivElement>(null)
  const impactoSectionRef = useRef<HTMLElement>(null)
  const bentoBlocksRef = useRef<HTMLDivElement[]>([])
  const politicasRef = useRef<HTMLDivElement>(null)
  const serviciosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // —— Misión y Visión: Fade-In + Blur (ScrollTrigger)
      const misionVision = [missionRef.current, visionRef.current].filter(
        Boolean,
      ) as HTMLElement[]
      gsap.set(misionVision, { opacity: 0, filter: 'blur(12px)' })
      misionVision.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          end: 'top 50%',
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'power2.out',
            })
          },
        })
      })

      // —— Bento Impacto: stagger
      const bento = bentoBlocksRef.current.filter(Boolean)
      gsap.set(bento, { opacity: 0, y: 48 })
      ScrollTrigger.batch(bento, {
        start: 'top 88%',
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power2.out',
          })
        },
      })

      // —— Políticas 2x2: reveal desde el fondo
      const politicasWrap = politicasRef.current
      if (politicasWrap) {
        const cards = politicasWrap.querySelectorAll('.politica-card')
        gsap.set(cards, { opacity: 0, y: 56 })
        ScrollTrigger.create({
          trigger: politicasWrap,
          start: 'top 82%',
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power2.out',
            })
          },
        })
      }

      // —— Servicios 2x2: reveal desde el fondo
      const serviciosWrap = serviciosRef.current
      if (serviciosWrap) {
        const cards = serviciosWrap.querySelectorAll('.servicio-card-reveal')
        gsap.set(cards, { opacity: 0, y: 56 })
        ScrollTrigger.create({
          trigger: serviciosWrap,
          start: 'top 82%',
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power2.out',
            })
          },
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="nosotros-page min-h-screen bg-white">
      {/* 1. HERO */}
      <header className="relative h-[55vh] w-full overflow-hidden bg-black">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 flex h-full items-end px-10 pb-16 md:px-24">
          <h1
            className="text-6xl md:text-9xl font-bold tracking-tighter text-white leading-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            {title}
            <span className="text-[var(--color-btn)]">.</span>
          </h1>
        </div>
      </header>

      {/* 2. MISIÓN Y VISIÓN — Fade-In + Blur con ScrollTrigger */}
      <section className="mx-auto max-w-7xl px-10 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div ref={missionRef} className="space-y-6">
            <span className="text-[var(--color-btn)] font-black text-xs uppercase tracking-[0.4em]">
              Propósito
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-title)]">
              Misión
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              {mision}
            </p>
          </div>
          <div ref={visionRef} className="space-y-6 md:pt-20">
            <span className="text-[var(--color-btn)] font-black text-xs uppercase tracking-[0.4em]">
              Futuro
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-title)]">
              Visión
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              {vision}
            </p>
          </div>
        </div>
      </section>

      {/* 3. VALORES CORPORATIVOS */}
      <section className="bg-slate-50 py-32">
        <div className="mx-auto max-w-7xl px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[var(--color-title)]">
              Valores corporativos
            </h2>
            <div className="h-px flex-1 bg-slate-200 mx-10 hidden md:block mb-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valores.map((pair, i) => (
              <div
                key={i}
                className="border-l-4 border-[var(--color-btn)] pl-6 py-4"
              >
                <p className="text-lg font-bold text-[var(--color-title)]">
                  {pair.left}
                </p>
                <p className="text-slate-500 mt-1">{pair.right}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SERVICIOS — 2x2 grid, reveal */}
      <section ref={serviciosRef} className="bg-[#f8f9fa] py-32">
        <div className="mx-auto max-w-7xl px-10">
          <div className="mb-20 text-center">
            <h2 className="text-5xl mb-10 md:text-7xl font-bold tracking-tighter text-[var(--color-title)]">
              Nuestros Servicios
            </h2>
            <p className="mb-20 text-lg text-center text-slate-500 leading-relaxed">
              {intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {serviceGroups.map((group, index) => (
              <div
                key={group.id}
                className="servicio-card-reveal group flex flex-col rounded-[3rem] border border-slate-200 bg-white p-12 transition-all hover:shadow-2xl"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-[var(--color-btn)] font-black text-xl group-hover:bg-[var(--color-btn)] group-hover:text-white transition-colors duration-500">
                  0{index + 1}
                </div>

                <h3 className="mb-8 text-3xl font-bold text-[var(--color-title)] uppercase tracking-tight">
                  {group.title}
                </h3>

                <ul className="grid grid-cols-1 gap-4">
                  {group.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-slate-500 font-light"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-btn)]" />
                      <span className="text-base md:text-lg leading-tight">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ECOSISTEMA DE IMPACTO — Bento Grid */}
      <section
        ref={impactoSectionRef}
        className="mx-auto max-w-7xl px-10 py-32"
      >
        <div className="mb-20 text-center">
          <span className="text-[var(--color-btn)] font-black text-xs uppercase tracking-[0.4em]">
            {ecosistemaImpacto.subtituloSeccion}
          </span>
          <h2 className="mt-4 text-5xl md:text-7xl font-bold tracking-tighter text-[var(--color-title)]">
            {ecosistemaImpacto.tituloSeccion}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {ecosistemaImpacto.bloques.map((bloque, index) => (
            <div
              key={bloque.id}
              ref={(el) => {
                if (el) bentoBlocksRef.current[index] = el
              }}
              className={`
                rounded-[3rem] p-10 md:p-12 border border-white/60 shadow-sm
                ${BENTO_CLASSES[bloque.id] ?? ''}
                ${SELLO_BG[bloque.sello] ?? 'bg-slate-50/90'}
              `}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-title)] mb-6">
                {bloque.titulo}
              </h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                {bloque.parrafos.map((p, i) => (
                  <p key={i} className="text-base md:text-lg">
                    {highlightText(p, bloque.highlights)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. POLÍTICAS — 2x2 grid, reveal */}
      <section ref={politicasRef} className="mx-auto max-w-7xl px-10 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="politica-card p-12 rounded-[3rem] bg-[var(--color-title)] text-white shadow-xl">
            <h3 className="text-3xl font-bold mb-6">Política de calidad</h3>
            <div className="space-y-4 opacity-90 leading-relaxed font-light text-lg">
              {politicaCalidad.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="politica-card p-12 rounded-[3rem] border border-slate-200 bg-white shadow-sm">
            <h3 className="text-3xl font-bold mb-6 text-[var(--color-title)]">
              Política de seguridad del paciente
            </h3>
            <div className="space-y-4 text-slate-500 leading-relaxed font-light text-lg">
              {politicaSeguridad.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
