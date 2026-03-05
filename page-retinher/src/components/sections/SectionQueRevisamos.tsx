import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../contexts/ContentContext'

gsap.registerPlugin(ScrollTrigger)

export function SectionQueRevisamos() {
  const { data } = useContent()
  const queRevisamos = (
    data as {
      queRevisamos?: {
        title: string
        text: string
        titleRight?: string
        textRight?: string
        ctaText?: string | null
        ctaLinkType?: 'page' | 'section' | null
        ctaLinkValue?: string | null
        ctaTextLeft?: string | null
        ctaLinkTypeLeft?: 'page' | 'section' | null
        ctaLinkValueLeft?: string | null
      }
    }
  )?.queRevisamos
  const sectionRef = useRef<HTMLElement>(null)
  const glassesRef = useRef<HTMLDivElement>(null)
  const contentLeftRef = useRef<HTMLDivElement>(null)
  const contentRightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const glasses = glassesRef.current
      const left = contentLeftRef.current
      const right = contentRightRef.current
      if (!glasses || !left) return

      // --- OPTIMIZACIÓN DE RENDIMIENTO ---
      // Usamos force3D para que la gafa use la GPU
      gsap.set(glasses, {
        scale: 12,
        xPercent: 180,
        opacity: 1,
        force3D: true, // Crucial para eliminar el lag
        transformOrigin: 'center center',
      })

      gsap.set(left, { opacity: 1, scale: 1, y: 0, force3D: true })
      if (right)
        gsap.set(right, { opacity: 0, scale: 0.8, y: 40, force3D: true })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%', // Distancia corta para que sea ágil
          pin: true,
          scrub: 0.5, // Un scrub bajo (0.5) responde más rápido que 1
        },
      })

      // Animaciones más directas y cortas
      tl.to(left, { opacity: 0, scale: 0.9, duration: 0.4 })

      tl.to(
        glasses,
        {
          scale: 1.8,
          xPercent: 0,
          duration: 0.8,
          ease: 'none', // "none" en scrub se siente más conectado al dedo/ratón
        },
        '-=0.2',
      )

      tl.to({}, { duration: 0.2 }) // Pausa mínima

      tl.to(glasses, {
        scale: 12,
        xPercent: -180,
        duration: 0.8,
        ease: 'none',
      })

      if (right) {
        tl.to(right, { opacity: 1, scale: 1, y: 0, duration: 0.4 }, '-=0.4')
      }

      tl.to({}, { duration: 0.3 })

      tl.to(right, { opacity: 0, duration: 0.3 })

      tl.to(
        glasses,
        {
          scale: 1.8,
          xPercent: 0,
          duration: 0.8,
          ease: 'none',
        },
        '-=0.2',
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (!queRevisamos) return null
  const {
    title,
    text,
    titleRight = '',
    textRight = '',
    ctaText,
    ctaLinkType,
    ctaLinkValue,
    ctaTextLeft,
    ctaLinkTypeLeft,
    ctaLinkValueLeft,
  } = queRevisamos

  const getCtaHref = (linkType: 'page' | 'section' | null | undefined, linkValue: string | null | undefined): string | null => {
    if (!linkType || !linkValue) return null
    return linkType === 'page'
      ? linkValue.startsWith('/')
        ? linkValue
        : `/${linkValue}`
      : `#${String(linkValue).replace(/^#/, '')}`
  }
  const ctaHrefRight = ctaText ? getCtaHref(ctaLinkType ?? 'page', ctaLinkValue ?? '/retinher-transforma') : null
  const ctaHrefLeft = ctaTextLeft ? getCtaHref(ctaLinkTypeLeft ?? 'page', ctaLinkValueLeft ?? '/') : null

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden">
      {/* QUITAMOS filtros pesados del fondo si los hubiera */}
      <div className="relative flex min-h-screen w-full items-center justify-center">
        {/* IZQUIERDO */}
        <div
          ref={contentLeftRef}
          className="absolute z-30 max-w-4xl px-10 text-center pointer-events-none"
        >
          <h2
            className="text-5xl md:text-8xl font-bold tracking-tighter text-slate-900"
            style={{
              color: '#3d3f89',
              letterSpacing: '-0.00em',
              wordSpacing: '0.1em',
            }}
          >
            {title}
          </h2>
          <p className="mt-8 text-xl text-slate-700 font-light text-justify">
            {text}
          </p>
          {ctaTextLeft && ctaHrefLeft && (
            <div className="mt-10 pointer-events-auto">
              <a
                href={ctaHrefLeft}
                className="inline-block px-8 py-4 rounded-xl font-bold text-white bg-[var(--color-btn)] hover:opacity-90 transition-opacity"
              >
                {ctaTextLeft}
              </a>
            </div>
          )}
        </div>

        {/* GAFAS - en móvil ancho para que se vean completas, en desktop tamaño fijo */}
        <div
          ref={glassesRef}
          className="absolute z-20 w-[88vw] max-w-[600px] lg:w-[900px] pointer-events-none flex justify-center items-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <img
            src="/gafas.png"
            alt="Gafas"
            className="w-full h-auto object-contain max-h-[70vh] md:max-h-none"
            // Evita sombras muy complejas que causen lag al escalar
            style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}
          />
        </div>

        {/* DERECHO */}
        <div
          ref={contentRightRef}
          className="absolute z-30 max-w-4xl px-10 text-center pointer-events-none"
        >
          <h2
            className="text-5xl md:text-8xl font-bold tracking-tighter text-slate-900"
            style={{
              color: '#3d3f89',
              letterSpacing: '-0.00em',
              wordSpacing: '0.1em',
            }}
          >
            {titleRight}
          </h2>
          <p className="mt-8 text-xl text-slate-700 font-light text-justify">
            {textRight}
          </p>

          {ctaText && ctaHrefRight && (
            <div className="mt-10 pointer-events-auto">
              <a
                href={ctaHrefRight}
                className="inline-block px-8 py-4 rounded-xl font-bold text-white bg-[var(--color-btn)] hover:opacity-90 transition-opacity"
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
