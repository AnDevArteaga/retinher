import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { mockData } from '../data/MockData'

const { titulo, subtitulo, sellos } = mockData.sellosImpacto

export function SectionReconocimientos() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  // Abrir/Cerrar
  const openExperience = () => {
    setIsOpen(true)
    setCurrentSlide(0)
    document.body.style.overflow = 'hidden'
  }
  const closeExperience = () => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }

  // GSAP: Animación de transiciones
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

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-[#050505] py-32 font-sans">
        {/* Luces de fondo */}
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-8">
          <div className="mb-24 text-center">
            <h2
              className="text-6xl md:text-8xl font-bold tracking-tighter text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              {titulo.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-[var(--color-btn)]">
                {titulo.split(' ').pop()}
              </span>
            </h2>
            <p className="mt-6 text-white/50 text-xl font-light">{subtitulo}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {sellos.map((sello) => (
              <div
                key={sello.id}
                onClick={openExperience}
                className="group cursor-pointer rounded-[2rem] border border-white/5 bg-white/5 p-8 transition-all hover:bg-white/10"
              >
                <img
                  src={sello.logo}
                  className="h-24 w-full object-contain mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <p
                  className="text-center text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-[var(--color-btn)]"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {sello.titulo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-[200] bg-white">
          {/* Botón Cerrar */}
          <button
            onClick={closeExperience}
            className="absolute top-10 right-10 z-[220] h-14 w-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-black hover:text-white transition-all"
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
                className="relative h-full w-screen flex items-center px-8 md:px-24"
              >
                <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
                  {/* Visual */}
                  <div className="flex flex-col items-center">
                    <div className="animate-up h-64 w-64 md:h-96 md:w-96 rounded-[3rem] bg-slate-50 flex items-center justify-center p-12 shadow-2xl">
                      <img
                        src={sello.logo}
                        className="max-h-full object-contain"
                      />
                    </div>
                    <div className="animate-up mt-12 grid grid-cols-2 gap-12">
                      {sello.stats.map((s, idx) => (
                        <div key={idx}>
                          <div className="text-5xl font-black">
                            {s.valor}
                            <span className="text-[var(--color-btn)] text-2xl">
                              {s.unidad}
                            </span>
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Texto */}
                  <div className="space-y-6">
                    <div className="animate-up h-1 w-20 bg-[var(--color-btn)]" />
                    <h3
                      className="animate-up text-5xl md:text-7xl font-bold tracking-tighter text-slate-900"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {sello.titulo}
                    </h3>
                    <p className="animate-up text-xl text-slate-500 font-light leading-relaxed">
                      {sello.descripcion}
                    </p>
                    <div className="animate-up flex flex-wrap gap-2">
                      {sello.tags.map((t) => (
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

          {/* Nav inferior */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center">
            <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-slate-300">
              Retinher Transforma // 2025
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                className="p-4 rounded-full border hover:bg-black hover:text-white transition-all"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((s) => Math.min(sellos.length - 1, s + 1))
                }
                className="p-4 rounded-full border hover:bg-black hover:text-white transition-all"
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
