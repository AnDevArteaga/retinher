import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../contexts/ContentContext'

gsap.registerPlugin(ScrollTrigger)

export function GalleryHorizontal() {
  const { data } = useContent()
  const gallery = (
    data as {
      gallery?: {
        title: string
        subtitle: string
        items: Array<{ id: string; type: string; src: string; caption: string }>
      }
    }
  )?.gallery
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const track = trackRef.current
      const title = titleRef.current
      if (!section || !track) return

      const trackWidth = track.scrollWidth
      const distance = -(trackWidth - window.innerWidth)

      gsap.to(track, {
        x: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${trackWidth}`,
          pin: true,
          scrub: 1,
        },
      })

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0.3, y: 20 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              end: 'top 20%',
              scrub: 0.5,
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (!gallery) return null

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)]"
      id="gallery"
    >
      <div className="absolute left-0 top-0 z-10 px-4 sm:px-6 md:px-12 pt-20 sm:pt-24">
        <h2
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter"
          style={{ color: 'var(--color-title)' }}
        >
          {gallery.title}
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] text-justify">
          {gallery.subtitle}
        </p>
      </div>
      <div
        ref={trackRef}
        className="absolute left-0 top-0 flex h-full items-center gap-4 sm:gap-6 md:gap-8 pl-4 sm:pl-6 md:pl-12 pt-28 sm:pt-32"
        style={{ width: 'max-content' }}
      >
        {gallery.items.map((item) => (
          <div
            key={item.id}
            className="relative flex h-[60vh] sm:h-[65vh] md:h-[70vh] w-[80vw] sm:w-[82vw] md:w-[70vw] lg:w-[55vw] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--color-text-muted)]/20 bg-[var(--color-bg-secondary)]"
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <img
                src={item.src}
                alt={item.caption}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-sm font-medium text-white text-justify">{item.caption}</p>
            </div>
          </div>
        ))}
        <div
          className="h-[60vh] sm:h-[65vh] md:h-[70vh] w-4 sm:w-5 flex-shrink-0"
          aria-hidden
        />
      </div>
    </section>
  )
}
