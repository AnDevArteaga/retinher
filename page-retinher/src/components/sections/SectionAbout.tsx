import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '../shared/RevealText'
import { mockData } from '../../data/MockData'
import { Button } from '../ui/button'

gsap.registerPlugin(ScrollTrigger)

export function SectionAbout() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Efecto de Revelado de Texto con el Scroll (Scrub)
      const words = sectionRef.current?.querySelectorAll('.reveal-unit')

      if (words) {
        gsap.fromTo(
          words,
          { opacity: 0.1, y: 10, filter: 'blur(5px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
            },
          },
        )
      }

      gsap.from(textContentRef.current, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1.5,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--color-title-dark)] flex items-center justify-center overflow-hidden"
      id="que-hacemos"
    >
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--color-btn) 12%, transparent)',
        }}
      />

      <div
        ref={containerRef}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
          <div className="lg:sticky lg:top-32">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] tracking-tighter text-white"
              style={{
                letterSpacing: '-0.02em',
                wordSpacing: '0.1em',
              }}
            >
              <RevealText
                text={mockData.about.title}
                splitBy="words"
                skipAutoAnimate
                className="inline"
              />
            </h2>
          </div>

          <div ref={textContentRef} className="space-y-8 sm:space-y-10 md:space-y-12">
            <div className="space-y-6 sm:space-y-8">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/60 font-light">
                <span
                  dangerouslySetInnerHTML={{ __html: mockData.about.intro }}
                />
              </p>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/60 font-light">
                <span
                  dangerouslySetInnerHTML={{ __html: mockData.about.purpose }}
                />
              </p>
            </div>

            <div className="pt-4">
              <Button>
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white">
                  {mockData.about.ctaPdf}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform group-hover:translate-y-1"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </span>
                <div className="absolute inset-0 z-0 translate-y-full bg-[var(--color-title)] transition-transform duration-500 ease-expo group-hover:translate-y-0" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
