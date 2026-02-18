import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../contexts/ContentContext'

gsap.registerPlugin(ScrollTrigger)

export function SectionQueRevisamos() {
  const { data } = useContent()
  const queRevisamos = (data as { queRevisamos?: { title: string; text: string } })?.queRevisamos
  const sectionRef = useRef<HTMLElement>(null)
  const glassesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SETEO INICIAL: Empezamos YA dentro del lente
      gsap.set(glassesRef.current, {
        scale: 12,
        xPercent: 180,
        opacity: 1,
      })
      gsap.set(contentRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
        },
      })

      // 1. PAUSA INICIAL: El usuario llega y ve la info dentro del lente
      tl.to({}, { duration: 1.5 })

      // 2. EL "REVEAL": Se quita el zoom; el texto desaparece desde el inicio
      tl.to(
        contentRef.current,
        {
          opacity: 0,
          scale: 0.92,
          y: -30,
          duration: 0.8,
          ease: 'power2.in',
        },
        0,
      )
      tl.to(
        glassesRef.current,
        {
          scale: 1.8,
          xPercent: 0,
          duration: 2.5,
          ease: 'power2.inOut',
        },
        '<',
      )

      // 3. FINAL: La gafa se mantiene un momento y luego sale la sección
      tl.to(glassesRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (!queRevisamos) return null
  const { title, text } = queRevisamos

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden">
      {/* Tu textura de ruido sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0"
        style={{
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
        }}
      ></div>

      <div className="relative flex min-h-screen w-full items-center justify-center px-4 sm:px-6">
        {/* LAS GAFAS - Capa superior */}
        <div
          ref={glassesRef}
          className="absolute z-20 w-[min(90vw,500px)] sm:w-[400px] md:w-[600px] lg:w-[800px] pointer-events-none flex justify-center"
        >
          <img
            src="public/gafas.png"
            alt="Ophthalmology Glasses"
            className="w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
            style={{ filter: 'brightness(1.02)' }}
          />
        </div>

        {/* EL CONTENIDO - Se ve al inicio por el hueco del lente */}
        <div
          ref={contentRef}
          className="relative z-10 max-w-3xl px-4 sm:px-6 md:px-10 text-center sm:text-left"
        >
          <h2
            className="mt-4 sm:mt-6 md:mt-8 text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9]"
            style={{ color: 'var(--color-title)', letterSpacing: '-0.01em' }}
          >
            {title}
          </h2>

          <p className="mt-6 sm:mt-8 md:mt-10 text-base sm:text-lg md:text-xl lg:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
            {text}
          </p>
        </div>
      </div>
    </section>
  )
}
