import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { RevealText } from '../shared/RevealText'
import { useContent } from '../../contexts/ContentContext'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type HeroSlide = {
  id: string
  headline: string
  subline: string
  brandLine: string
  cta: string
  ctaLinkType: 'page' | 'section'
  ctaLinkValue: string
  mediaType: 'video' | 'image'
  mediaUrl: string
}

export function Hero() {
  const { data } = useContent()
  const slides = (data as { heroSlides?: HeroSlide[] })?.heroSlides ?? []
  const [currentIndex, setCurrentIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

  const total = slides.length

  /** Construye el href del CTA: ruta de página o ancla #id para sección */
  const getCtaHref = (s: HeroSlide): string =>
    s.ctaLinkType === 'page'
      ? s.ctaLinkValue.startsWith('/')
        ? s.ctaLinkValue
        : `/${s.ctaLinkValue}`
      : `#${s.ctaLinkValue.replace(/^#/, '')}`

  const handleCtaClick = (e: React.MouseEvent, s: HeroSlide) => {
    if (s.ctaLinkType === 'section') {
      e.preventDefault()
      const id = s.ctaLinkValue.replace(/^#/, '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (total === 0) return
    const ctx = gsap.context(() => {
      const overlay = overlayRefs.current[currentIndex]
      const content = contentRefs.current[currentIndex]
      if (!overlay || !content) return
      const words = content.querySelectorAll('.reveal-unit')
      const info = content.querySelector('.hero-info')
      gsap.set(words, { opacity: 0, y: 80, filter: 'blur(15px)' })
      gsap.set(info, { opacity: 0, x: -20 })
      gsap.set(overlay, { opacity: 0 })
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to(overlay, { opacity: 1, duration: 2 })
        .to(
          words,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            stagger: 0.08,
          },
          '-=1.5',
        )
        .to(info, { opacity: 1, x: 0, duration: 1 }, '-=0.8')
    }, sectionRef)
    return () => ctx.revert()
  }, [currentIndex, total])

  const go = (dir: number) => {
    setCurrentIndex((i) => (i + dir + total) % total)
  }

  useEffect(() => {
    if (total <= 1) return
    const t = setInterval(() => {
      setCurrentIndex((i) => (i + 1 + total) % total)
    }, 10000)
    return () => clearInterval(t)
  }, [total, currentIndex])

  if (slides.length === 0) return null

  /** Por slide: 'dark' = cursor oscuro (fondo claro), 'light' = cursor claro (fondo oscuro) */
  const cursorModeBySlideId: Record<string, 'dark' | 'light'> = {
    '94d1eceb-f884-48bc-b5e7-a5d52ce5dee6': 'dark',  // video blanco + gradiente
    '828bb8a9-5db4-4007-942a-7cc0a1c3042c': 'light', // UCAD fondo oscuro, texto blanco
    'ea1515ba-5110-4285-8f14-d85e830ecac1': 'light', // imagen rotada (ajustar si la imagen es clara)
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      id="hero"
    >
      {/* Slides: fondos (video/imagen) + overlay + contenido por slide */}
      {slides.map((s, i) => {
        const cursorMode = cursorModeBySlideId[s.id] ?? 'light'
        return (
        <div
          key={s.id}
          className="absolute inset-0 z-0 transition-opacity duration-700"
          style={{
            opacity: i === currentIndex ? 1 : 0,
            pointerEvents: i === currentIndex ? 'auto' : 'none',
          }}
          {...(cursorMode === 'dark' ? { 'data-cursor-dark': '' } : { 'data-cursor-light': '' })}
        >
          {/* Media de fondo */}
          <div className="absolute inset-0">
            {s.id === 'ea1515ba-5110-4285-8f14-d85e830ecac1' && s.mediaUrl ? (
              /* --- Slide: imagen rotada -90° y parte derecha pegada al fondo del viewport --- */
              <div className="absolute inset-0 overflow-hidden">
                {s.mediaType === 'video' ? (
                  <video
                    src={s.mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover object-right"
                  />
                ) : (
                  <img
                    src={s.mediaUrl}
                    alt=""
                    className="h-full w-full object-cover object-right"
                  />
                )}
              </div>
            ) : s.mediaType === 'video' && s.mediaUrl ? (
              s.id === '94d1eceb-f884-48bc-b5e7-a5d52ce5dee6' ? (
                /* --- PRIMER SLIDE: desktop = video derecha + gradiente; móvil = video arriba a ancho completo --- */
                <>
                  {/* Desktop: video a la derecha, volteado, con gradiente */}
                  <div className="relative h-full w-full bg-white hidden md:block">
                    <video
                      src={s.mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute right-0 top-0 h-full w-[80%] md:w-3/4 object-cover -scale-x-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-transparent pointer-events-none" />
                  </div>
                  {/* Móvil: video arriba, ancho completo, sin voltear (se verá en la columna) */}
                  <div className="absolute inset-x-0 top-0 h-[40vh] w-full md:hidden bg-white">
                    <video
                      src={s.mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>
                </>
              ) : (
                /* --- RESTO DE LOS VIDEOS --- */
                <video
                  src={s.mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              )
            ) : s.mediaUrl ? (
              <img
                src={s.mediaUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-800" />
            )}
          </div>
          <div
            ref={(el) => {
              overlayRefs.current[i] = el
            }}
            className="absolute inset-0 bg-transparent"
          />
          {/* Contenido del slide — en móvil para el slide del video blanco queda debajo del video */}
          <div
            className={`relative z-10 flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 lg:px-24 ${
              s.id === '94d1eceb-f884-48bc-b5e7-a5d52ce5dee6'
                ? 'absolute inset-x-0 bottom-0 top-[45vh] md:top-0 md:inset-0 md:h-full'
                : 'h-full'
            }`}
          >
            <div
              ref={(el) => {
                contentRefs.current[i] = el
              }}
              className="max-w-[1600px] w-full"
            >
              <h1
                className={`text-left text-[clamp(2.25rem,8vw,9rem)] sm:text-[clamp(2.75rem,9vw,9rem)] font-bold leading-[1.05] ${s.id === '828bb8a9-5db4-4007-942a-7cc0a1c3042c' ? 'text-white' : 'text-[var(--color-title)]'}`}
                style={{ letterSpacing: '-0.02em', wordSpacing: '0.1em' }}
              >
                <RevealText
                  text={s.headline}
                  splitBy="words"
                  skipAutoAnimate
                  className="inline-block"
                />
              </h1>
              <div className="hero-info mt-6 sm:mt-10 mb-6 sm:mb-10 flex md:flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-left">
                {s.id === '828bb8a9-5db4-4007-942a-7cc0a1c3042c' ? (
                  <img
                    src="/tevytv.png"
                    alt=""
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-24 md:h-24 shrink-0 object-contain"
                  />
                ) : s.id === '94d1eceb-f884-48bc-b5e7-a5d52ce5dee6' ? (
                  <img
                    src="/cropped-Icono.png"
                    alt=""
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-24 md:h-24 shrink-0"
                  />
                ) : null}
                <p
                  className="text-xl sm:text-xl font-light tracking-[0.05em] sm:tracking-[0.1em] uppercase md:text-5xl font-semibold"
                  style={{
                    color:
                      s.id === '828bb8a9-5db4-4007-942a-7cc0a1c3042c'
                        ? 'white'
                        : '#3d3f89',
                  }}
                >
                  {s.subline}
                </p>
                <span
                  className={`hidden h-5 sm:h-6 w-[1px] md:inline-block ${s.id === '828bb8a9-5db4-4007-942a-7cc0a1c3042c' ? 'bg-white/40' : 'bg-[var(--color-text)]/40'}`}
                />
                <p
                  className={`text-lg sm:text-lg font-medium tracking-tight ${s.id === '828bb8a9-5db4-4007-942a-7cc0a1c3042c' ? 'text-white' : 'text-[var(--color-text)]/80'} md:text-3xl text-justify`}
                >
                  {s.brandLine}
                </p>
              </div>
              <a href={getCtaHref(s)} onClick={(e) => handleCtaClick(e, s)}>
                <Button className="cursor-none text-slate-400" id={s.id}>
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-white">
                    {s.cta}
                  </span>
                  <div className="absolute inset-0 z-0 translate-y-full bg-[var(--color-btn)] transition-transform duration-500 ease-expo group-hover:translate-y-0" />
                </Button>
              </a>
            </div>
          </div>
        </div>
        );
      })}

      {/* Navegación: flechas */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors hidden md:block"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors hidden md:block"
            aria-label="Slide siguiente"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'}`}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Decoración lateral */}
      {/* <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 rotate-90 text-[10px] uppercase tracking-[0.5em] text-white/20 md:block pointer-events-none">
        Retinher Centro de Especialidades — 2026
      </div> */}
    </section>
  )
}
