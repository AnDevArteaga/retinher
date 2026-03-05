import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../../contexts/ContentContext'
import { Button } from '../ui/button'

type MediaItem = { type: 'image' | 'video'; url: string }

type SelloItem = {
  id: string
  titulo: string
  logo: string
  descripcion: string
  porQue?: string
  queHicieron?: unknown[]
  stats?: unknown[]
  tags?: string[]
  color: string
  media?: MediaItem[]
}

export function SectionReconocimientos() {
  const { data } = useContent()
  const sellosImpacto = (
    data as {
      sellosImpacto?: { titulo: string; subtitulo: string; sellos: SelloItem[] }
    }
  )?.sellosImpacto
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [carouselBySlide, setCarouselBySlide] = useState<
    Record<number, number>
  >({})
  const overlayRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  const openExperience = (index = 0) => {
    setIsOpen(true)
    setCurrentSlide(index)
  }
  const closeExperience = () => setIsOpen(false)

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    // Mover el track
    gsap.to(trackRef.current, {
      x: -currentSlide * window.innerWidth,
      duration: 1,
      ease: 'expo.inOut',
    })

    // Animar elementos del slide actual
    const currentEl = slideRefs.current[currentSlide]
    if (currentEl) {
      gsap.fromTo(
        currentEl.querySelectorAll('.animate-up'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.4,
        },
      )
    }
  }, [currentSlide, isOpen])

  if (!sellosImpacto) return null
  const { titulo, subtitulo, sellos } = sellosImpacto

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-white py-16 sm:py-20 md:py-24 lg:py-32 font-sans">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="mb-12 sm:mb-16 md:mb-20 text-center">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-slate-900"
              style={{ letterSpacing: '-0.02em' }}
            >
              {titulo.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-[var(--color-btn)]">
                {titulo.split(' ').pop()}
              </span>
            </h2>
            <p className="mt-4 sm:mt-6 text-slate-500 text-base sm:text-lg md:text-xl font-light text-center">
              {subtitulo}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {sellos.map((sello, index) => (
              <div
                key={sello.id}
                onClick={() => openExperience(index)}
                className="group cursor-pointer flex flex-col items-center rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border-2 border-slate-100 bg-white p-6 sm:p-8 md:p-10 lg:p-14 transition-all hover:border-[var(--color-btn)]/30 hover:shadow-2xl"
              >
                <div className="mb-4 sm:mb-6 flex h-28 sm:h-36 md:h-40 w-full items-center justify-center lg:h-52">
                  <img
                    src={sello.logo}
                    alt={sello.titulo}
                    className="max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p
                  className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-[var(--color-btn)] transition-colors"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {sello.titulo}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-14 md:mt-16 flex justify-center">
            <Button
              onClick={() => openExperience(0)}
              className="!bg-slate-800 hover:!bg-[var(--color-title)] !border-gray-900"
            >
              <span>Explorar cada sello</span>
            </Button>
          </div>
        </div>
      </section>

      {isOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-[200] bg-white">
          {/* Botón Cerrar */}
          <button
            onClick={closeExperience}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 z-[220] h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-black hover:text-white transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            ref={trackRef}
            className="flex h-full"
            style={{ width: `${sellos.length * 100}vw` }}
          >
            {sellos.map((sello, i) => (
              <div
                key={sello.id}
                ref={(el) => {
                  if (el) slideRefs.current[i] = el
                }}
                className="relative h-full w-screen flex items-center px-4 sm:px-6 md:px-12 lg:px-24 overflow-y-auto pb-28 pr-14 sm:pb-32 sm:pr-16 md:pr-20"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-start w-full max-w-[85rem] mx-auto overflow-y-auto max-h-[calc(100vh-10rem)] py-8 sm:py-12 md:py-16">
                  {/* Columna izquierda: carrusel grande + stats */}

                  <div className="flex flex-col lg:sticky lg:top-8 order-1 w-full">
                    <h3
                      className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-slate-900 min-w-0 mb-4"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {sello.titulo}
                    </h3>
                    {(() => {
                      const mediaList: MediaItem[] =
                        sello.media && sello.media.length > 0
                          ? sello.media
                          : [{ type: 'image', url: sello.logo }]
                      const idx =
                        i === currentSlide ? (carouselBySlide[i] ?? 0) : 0
                      const current = mediaList[idx]
                      const go = (d: number) => {
                        const next =
                          (idx + d + mediaList.length) % mediaList.length
                        setCarouselBySlide((prev) => ({ ...prev, [i]: next }))
                      }
                      const setIdx = (k: number) =>
                        setCarouselBySlide((prev) => ({ ...prev, [i]: k }))
                      return (
                        <>
                          <div className="animate-up w-full">
                            <div
                              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-inner"
                              style={{ aspectRatio: '16/10' }}
                            >
                              {current.type === 'video' ? (
                                <video
                                  src={current.url}
                                  controls
                                  className="h-full w-full"
                                  preload="metadata"
                                />
                              ) : (
                                <img
                                  src={current.url}
                                  alt=""
                                  className={`h-full w-full object-contain transition-opacity duration-300 `}
                                  onError={(e) => {
                                    ;(
                                      e.currentTarget as HTMLImageElement
                                    ).style.background =
                                      'linear-gradient(135deg,#e2e8f0,#cbd5e1)'
                                  }}
                                />
                              )}
                              {mediaList.length > 1 && (
                                <>
                                  <button
                                    type="button"
                                    onClick={(ev) => {
                                      ev.stopPropagation()
                                      go(-1)
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                                    aria-label="Anterior"
                                  >
                                    <ChevronLeft className="h-6 w-6 text-slate-600" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(ev) => {
                                      ev.stopPropagation()
                                      go(1)
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                                    aria-label="Siguiente"
                                  >
                                    <ChevronRight className="h-6 w-6 text-slate-600" />
                                  </button>
                                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {mediaList.map((_, k) => (
                                      <button
                                        key={k}
                                        type="button"
                                        onClick={(ev) => {
                                          ev.stopPropagation()
                                          setIdx(k)
                                        }}
                                        className={`h-2 rounded-full transition-all ${k === idx ? 'w-6 bg-white' : 'w-2 bg-white/60'}`}
                                        aria-label={`Imagen ${k + 1}`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                            {mediaList.length > 1 && (
                              <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                Galería del sello
                              </p>
                            )}
                          </div>
                          <div className="animate-up mt-6 sm:mt-8 grid grid-cols-2 gap-4 sm:gap-6">
                            {(
                              (sello.stats ?? []) as Array<{
                                valor: string
                                unidad: string
                                label: string
                              }>
                            ).map((s, idxStat) => (
                              <div key={idxStat}>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-black">
                                  {s.valor}
                                  <span className="text-[var(--color-btn)] text-xl">
                                    {s.unidad}
                                  </span>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                  {s.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )
                    })()}
                  </div>

                  {/* Columna derecha: logo pequeño + título + texto */}
                  <div className="space-y-5 sm:space-y-6 md:space-y-8 order-2">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mx-auto bg-white rounded-xl overflow-hidden">
                        {/* Lado Izquierdo: Logo (50%) */}

                        <div className="w-full md:w-1/2 flex items-center justify-center">
                          <img
                            src={sello.logo}
                            alt=""
                            className="max-h-48 w-full object-contain"
                          />
                        </div>

                        {/* Lado Derecho: Texto (50%) */}
                        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed text-justify mt-2">
                            {sello.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>

                    {'porQue' in sello && sello.porQue && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                          Por qué lo tenemos
                        </h4>
                        <p className="text-slate-600 font-light leading-relaxed text-justify">
                          {sello.porQue}
                        </p>
                      </div>
                    )}

                    {'queHicieron' in sello &&
                      Array.isArray(sello.queHicieron) && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                            Qué hicimos
                          </h4>
                          <ul className="space-y-3">
                            {(sello.queHicieron ?? []).map(
                              (item: unknown, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex gap-3 items-start"
                                >
                                  <span
                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: sello.color }}
                                  />
                                  <span className="text-slate-600 font-light leading-relaxed text-justify block">
                                    {String(item)}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {(sello.tags ?? []).map((t: string) => (
                        <span
                          key={t}
                          className="px-4 py-1 rounded-full border border-slate-200 text-[10px] font-bold uppercase text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores - espacio reservado a la derecha del contenido */}
          <div className="absolute top-1/2 right-4 sm:right-5 md:right-6 -translate-y-1/2 z-[220] flex flex-col gap-2 sm:gap-3 w-8 sm:w-10">
            {sellos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide
                    ? 'w-8 bg-[var(--color-btn)]'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Nav inferior - barra fija que no solapa el contenido */}
          <div className="absolute bottom-0 left-0 right-0 z-[220] flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 md:px-10 py-4 sm:py-5 bg-white border-t border-slate-100">
            <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.5em] uppercase text-slate-400 order-2 sm:order-1">
              Retinher Transforma // 2025
            </div>
            <div className="flex gap-3 sm:gap-4 order-1 sm:order-2">
              <button
                onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                className="p-3 sm:p-4 rounded-full border hover:bg-black hover:text-white transition-all text-sm"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((s) => Math.min(sellos.length - 1, s + 1))
                }
                className="p-3 sm:p-4 rounded-full border hover:bg-black hover:text-white transition-all text-sm"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
