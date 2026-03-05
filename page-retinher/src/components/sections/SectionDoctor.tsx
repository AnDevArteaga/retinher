import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../contexts/ContentContext'

gsap.registerPlugin(ScrollTrigger)

export function SectionDoctor() {
  const { data } = useContent()
  const doctor = (data as { doctor?: { nombre: string; titulo: string; descripcion: string; imagen: string } })?.doctor
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      gsap.set([imageRef.current, nameRef.current, descRef.current], {
        opacity: 0,
        y: 40,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      tl.to(imageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      })
        .to(
          nameRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.5',
        )
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.4',
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (!doctor) return null
  const { nombre, titulo, descripcion, imagen } = doctor

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-slate-50 py-16 sm:py-20 md:py-24 lg:py-32"
      id="doctor"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center gap-10 sm:gap-12 md:flex-row md:items-center md:gap-16 lg:gap-20">
          {/* Imagen */}
          <div
            ref={imageRef}
            className="flex shrink-0 justify-center md:justify-end w-full md:w-[40%]"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 aspect-[3/4] w-full max-w-sm sm:max-w-md md:max-w-xs lg:max-w-sm">
              <img
                src={imagen}
                alt={nombre}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Nombre y descripción */}
          <div
            ref={contentRef}
            className="flex flex-1 flex-col text-center md:text-left md:max-w-xl lg:max-w-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-btn)] mb-2">
              Quién nos lidera
            </p>
            <h2
              ref={nameRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-slate-900"
              style={{ letterSpacing: '-0.02em' }}
            >
              {nombre}
            </h2>
            <p className="mt-2 text-base sm:text-lg text-slate-500 font-medium text-justify">
              {titulo}
            </p>
            <p
              ref={descRef}
              className="mt-6 sm:mt-8 text-base sm:text-lg text-slate-600 font-light leading-relaxed text-justify"
            >
              {descripcion}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
