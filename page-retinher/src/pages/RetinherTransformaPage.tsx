import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../contexts/ContentContext'
import { SectionReconocimientos } from '../components/sections/SectionReconocimientos'

gsap.registerPlugin(ScrollTrigger)

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

// type SlideItem = {
//   id: string
//   slideOrder: number
//   mediaType: 'video' | 'image'
//   mediaUrl: string
// }

export function RetinherTransformaPage() {
  const { data } = useContent()
  const hero = (
    data as {
      retinherTransformaHero?: {
        headline: string
        subline: string
        brandLine: string
        mediaType: 'video' | 'image'
        mediaUrl: string
      }
    }
  )?.retinherTransformaHero
  // const slides =
  //   (data as { retinherTransformaSlides?: SlideItem[] })
  //     ?.retinherTransformaSlides ?? []
  const ecosistema = (
    data as {
      ecosistemaImpacto?: {
        tituloSeccion: string
        subtituloSeccion: string
        bloques: Array<{
          id: string
          titulo: string
          sello: string
          parrafos: string[]
          highlights: string[]
        }>
      }
    }
  )?.ecosistemaImpacto

  // const [slideIndex, setSlideIndex] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const bentoRef = useRef<HTMLDivElement[]>([])

  // const totalSlides = slides.length
  // const goSlide = (dir: number) =>
  //   setSlideIndex((i) => (i + dir + totalSlides) % totalSlides)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bento = bentoRef.current.filter(Boolean)
      if (bento.length) {
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
      }
    })
    return () => ctx.revert()
  }, [ecosistema?.bloques?.length])

  if (!hero) return null

  return (
    <div className="retinher-transforma-page min-h-screen bg-white">
      {/* Hero */}
      <header
        ref={heroRef}
        className="relative h-[55vh] min-h-[600px] w-full overflow-hidden bg-transparent"
      >
        {hero.mediaUrl ? (
          hero.mediaType === 'video' ? (
            <video
              src={hero.mediaUrl}
              controls
              className="absolute inset-0 h-full w-fuver opacity-60"
            />
          ) : (
            <img
              src={hero.mediaUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )
        ) : (
          <div className="absolute inset-0 bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 flex h-full items-end px-8 pb-16 md:px-24">
          <div>
            <h1
              className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              {hero.headline}
              <span className="text-[var(--color-btn)]">.</span>
            </h1>
            {hero.subline && (
              <p className="mt-4 text-xl md:text-2xl text-white/90 font-light text-justify">
                {hero.subline}
              </p>
            )}
            {hero.brandLine && (
              <p className="mt-2 text-base md:text-lg text-white/70 text-justify">
                {hero.brandLine}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Carrusel de slides: ancho y alto fijo 16:9 */}
      {/* {totalSlides > 0 && (
        <section className="w-full flex justify-center px-4 py-8 md:py-12">
          <div className="relative w-full max-w-7xl aspect-video overflow-hidden rounded-xl md:rounded-2xl shadow-xl">
            {slides.map((s, i) => (
              <div
                key={s.id}
                className="absolute inset-0 z-0 transition-opacity duration-500"
                style={{
                  opacity: i === slideIndex ? 1 : 0,
                  pointerEvents: i === slideIndex ? 'auto' : 'none',
                }}
              >
                {s.mediaUrl ? (
                  s.mediaType === 'video' ? (
                    <video
                      src={s.mediaUrl}
                      controls
                      className="h-full w-full"
                    />
                  ) : (
                    <img
                      src={s.mediaUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="h-full w-full bg-slate-800" />
                )}
                <div
                  className="absolute inset-0 bg-black/30 pointer-events-none"
                  aria-hidden
                />
              </div>
            ))}
            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goSlide(-1)}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  onClick={() => goSlide(1)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Slide siguiente"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
                <div className="absolute bottom-1 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlideIndex(i)}
                      className={`h-2 rounded-full transition-all ${i === slideIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'}`}
                      aria-label={`Ir al slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )} */}

      {/* Sellos de impacto (antes en Home) */}
      <SectionReconocimientos />

      {/* Ecosistema — bento grid (contenido Retinher Transforma) */}
      {ecosistema && ecosistema.bloques?.length > 0 && (
        <section className="mx-auto max-w-7xl px-8 py-20 md:py-32">
          <div className="mb-16 text-center">
            <span className="text-[var(--color-btn)] font-black text-xs uppercase tracking-[0.4em]">
              {ecosistema.subtituloSeccion}
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tighter text-[var(--color-title)]">
              {ecosistema.tituloSeccion}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            {ecosistema.bloques.map((bloque, index) => (
              <div
                key={bloque.id}
                ref={(el) => {
                  if (el) bentoRef.current[index] = el
                }}
                className={`
                  rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-sm
                  ${BENTO_CLASSES[bloque.id] ?? ''}
                  ${SELLO_BG[bloque.sello] ?? 'bg-slate-50/90'}
                `}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-title)] mb-6">
                  {bloque.titulo}
                </h3>
                <div className="space-y-4 text-slate-600 leading-relaxed text-justify">
                  {bloque.parrafos.map((p, i) => (
                    <p key={i} className="text-base md:text-lg text-justify">
                      {highlightText(p, bloque.highlights)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Infografías: dos bloques (imagen izquierda + texto derecha; imagen derecha + texto izquierda) */}
      <section className="relative px-6 py-20 md:px-12 md:py-28 bg-[#f4f7f9]">
        <div className="mx-auto max-w-6xl space-y-24 md:space-y-32">
          {/* 1. Imagen izquierda, texto derecha */}
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
            <div
              className="flex flex-1 overflow-hidden rounded-2xl border-2 shadow-xl md:order-1"
              style={{ borderColor: 'var(--color-title)' }}
            >
              <img
                src="/infografia-2.jpg"
                alt="Infografía Retinher Transforma"
                className="h-auto w-full object-contain"
                onError={(e) => {
                  const t = e.currentTarget
                  t.style.background =
                    'linear-gradient(135deg,#e2e8f0 0%,#cbd5e1 100%)'
                  t.alt = 'Infografía'
                }}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center md:order-2">
              <h2
                className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl"
                style={{
                  color: 'var(--color-title)',
                  letterSpacing: '-0.02em',
                }}
              >
                Las 5R que cuidan el planeta
              </h2>

              <p className="text-lg text-slate-500 md:text-xl text-justify">
                En Retinher transformamos acciones en conciencia ambiental
              </p>
            </div>
          </div>

          {/* 2. Imagen derecha, texto izquierda */}
          {/* <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
            <div className="flex flex-1 flex-col justify-center md:order-1">
              <h2
                className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl"
                style={{ color: 'var(--color-title)' }}
              >
                Ecosistema de valor
              </h2>
              <p className="mb-6 text-xl font-medium text-slate-600 md:text-2xl text-justify">
                De la visión a los resultados
              </p>
              <p className="text-lg text-slate-500 md:text-xl text-justify">
                Te Veo y Te Ves y los sellos de impacto se integran en una misma
                estrategia: cuidado de la visión, prevención y compromiso con
                las comunidades.
              </p>
            </div>
            <div
              className="flex flex-1 overflow-hidden rounded-2xl border-2 shadow-xl md:order-2"
              style={{ borderColor: 'var(--color-title)' }}
            >
              <img
                src="/infografia-retinher-2.jpeg"
                alt="Infografía Retinher Transforma"
                className="h-auto w-full object-contain"
                onError={(e) => {
                  const t = e.currentTarget
                  t.style.background =
                    'linear-gradient(135deg,#e2e8f0 0%,#cbd5e1 100%)'
                  t.alt = 'Infografía'
                }}
              />
            </div>
          </div> */}
        </div>
      </section>
    </div>
  )
}
