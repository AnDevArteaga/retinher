import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../contexts/ContentContext'

gsap.registerPlugin(ScrollTrigger)

export function SectionServicios() {
  const { data } = useContent()
  const services = (data as { services?: Array<{ id: string; title: string; description: string; cta: string; image: string }> })?.services ?? []
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isMobile = () => window.innerWidth < 768
    if (isMobile()) return

    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>('.service-card-desktop')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${cardEls.length * 100}%`,
          pin: innerRef.current,
          scrub: 1,
        },
      })

      cardEls.forEach((card, i) => {
        const isLast = i === cardEls.length - 1
        const imgWrapper = card.querySelector('.service-img-wrapper')
        const info = card.querySelector('.service-info-box')
        const isEven = i % 2 === 0

        gsap.set(card, { autoAlpha: 0 })
        gsap.set(imgWrapper, {
          width: '85%',
          height: '80%',
          position: 'absolute',
          left: '50%',
          top: '50%',
          xPercent: -50,
          yPercent: -50,
          borderRadius: '40px',
        })
        gsap.set(info, { opacity: 0, x: isEven ? 80 : -80 })

        tl.to(card, { autoAlpha: 1, duration: 0.5 })

        tl.to(imgWrapper, {
          width: '45%',
          height: '60%',
          xPercent: isEven ? 0 : -100,
          left: '50%',
          duration: 1.5,
          ease: 'expo.inOut',
        }).to(
          info,
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=1',
        )

        tl.to({}, { duration: 0.5 })

        if (!isLast) {
          tl.to(card, { autoAlpha: 0, y: -40, duration: 0.5 })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f8f9fa]" // Un blanco hueso muy sutil
      id="servicios"
    >
      {/* CAPA DE RUIDO Y TEXTURA */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
        }}
      ></div>

      {/* GRADIENTE RADIAL PARA PROFUNDIDAD */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.02)_100%)]"></div>

      <div
        ref={innerRef}
        className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32"
      >
        {/* TITULO FIJO */}
        <div className="relative z-50 w-full text-center px-4">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter"
            style={{
              color: 'var(--color-title)',
              letterSpacing: '-0.01em',
            }}
          >
            Nuestros Servicios
          </h2>
        </div>

        {/* MOBILE: Cards en fila vertical (una arriba de otra) */}
        <div className="flex flex-col gap-8 sm:gap-10 md:hidden w-full max-w-2xl mx-auto px-4">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="flex flex-col gap-4 sm:gap-6 rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 sm:p-6 flex flex-col text-left">
                <span className="text-[var(--color-btn)] font-black text-xs uppercase tracking-[0.4em] mb-2">
                  Servicio 0{i + 1}
                </span>
                <h3
                  className="text-xl sm:text-2xl font-bold tracking-tighter"
                  style={{
                    color: 'var(--color-title)',
                    lineHeight: '0.95',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-500 font-light leading-relaxed">
                  {s.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* DESKTOP: Contenedor con animación pin/scroll */}
        <div className="hidden md:block relative min-h-[50vh] sm:min-h-[60vh] md:h-[70vh] w-full max-w-7xl">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="service-card-desktop absolute inset-0 flex items-center justify-center px-4 sm:px-6"
            >
              <div className="grid h-full w-full grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 md:gap-10">
                <div className="service-img-wrapper z-0 overflow-hidden shadow-2xl rounded-2xl">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div
                  className={`service-info-box z-10 flex flex-col 
                  ${i % 2 === 0 ? 'md:col-start-1 md:text-left' : 'md:col-start-2 md:text-right md:items-end'}`}
                >
                  <span className="text-[var(--color-btn)] font-black text-xs uppercase tracking-[0.4em] mb-4">
                    Servicio 0{i + 1}
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold tracking-tighter"
                    style={{
                      color: 'var(--color-title)',
                      lineHeight: '0.95',
                      letterSpacing: '-0.01em',
                      wordSpacing: '0.1em',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-md">
                    {s.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA - Adaptado a fondo blanco */}
        <div className="relative z-50 w-full flex justify-center mt-8 md:mt-0">
          <a
            href="#"
            className="inline-flex h-14 items-center justify-center rounded-full w-md text-sm font-bold uppercase cursor-none tracking-widest text-white transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'var(--color-btn)' }}
          >
            Agendar Valoración Ahora →
          </a>
        </div>
      </div>
    </section>
  )
}
