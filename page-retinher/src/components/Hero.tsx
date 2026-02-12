import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { RevealText } from './RevealText'
import { mockData } from '../data/MockData'
import { Button } from './ui/button'
import video from '../assets/hero.mp4'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      // Seteo inicial
      const words = titleRef.current?.querySelectorAll('.reveal-unit')
      gsap.set(words, { opacity: 0, y: 80, filter: 'blur(15px)' })
      gsap.set(infoRef.current, { opacity: 0, x: -20 })
      gsap.set(overlayRef.current, { opacity: 0 })

      tl.to(overlayRef.current, { opacity: 1, duration: 2 })
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
        .to(
          infoRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 1,
          },
          '-=0.8',
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      id="hero"
    >
      {/* Video de Fondo con Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-60"
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent"
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex h-full flex-col justify-center items-center px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px]">
          {/* Headline - Corregido alineación y tracking */}
          <h1
            ref={titleRef}
            className="text-left text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[1] text-white"
            style={{
              letterSpacing: '-0.02em', // Espaciado entre letras premium
              wordSpacing: '0.1em', // Espaciado entre palabras
            }}
          >
            <RevealText
              text={mockData.hero.headline}
              splitBy="words"
              skipAutoAnimate
              className="inline-block"
            />
          </h1>

          {/* Línea Combinada: Subline + Brandline */}
          <div
            ref={infoRef}
            className="mt-10 mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-left"
          >
            <img
              src="public/cropped-Icono.png"
              alt="icon"
              className="w-16 h-16"
            />
            <p
              className="text-xl font-light tracking-[0.2em] uppercase md:text-2xl font-semibold "
              style={{ color: '#3d3f89' }}
            >
              {mockData.hero.subline}
            </p>
            <span className="hidden h-6 w-[1px] bg-white/30 md:block" />
            <p className="text-lg font-medium tracking-tight text-white/80 md:text-xl">
              {mockData.hero.brandLine}
            </p>
          </div>

          {/* CTA - Botón Pro */}
          <a href="#que-hacemos">
            <Button className="cursor-none">
              <span className="relative z-10 flex items-center gap-3 group-hover:text-white">
                {mockData.hero.cta}
              </span>
              <div className="absolute inset-0 z-0 translate-y-full bg-[var(--color-btn)] transition-transform duration-500 ease-expo group-hover:translate-y-0" />
            </Button>
          </a>
        </div>
      </div>

      {/* Decoración lateral (Opcional) */}
      <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 rotate-90 text-[10px] uppercase tracking-[0.5em] text-white/20 md:block">
        Retinher Centro de Especialidades — 2026
      </div>
    </section>
  )
}
