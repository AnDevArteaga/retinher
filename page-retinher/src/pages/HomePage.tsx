import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hero } from '../components/Hero'
import { SectionAbout } from '../components/SectionAbout'
import { SectionServicios } from '../components/SectionServicios'
import { SectionQueRevisamos } from '../components/SectionQueRevisamos'
import { GalleryHorizontal } from '../components/GalleryHorizontal'
import { SectionImagenes } from '../components/SectionImagenes'
import { VisionTest } from '../components/VisionTest'

gsap.registerPlugin(ScrollTrigger)

export function HomePage() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const visionSection = document.getElementById('vision-lab')
      if (!visionSection) return

      ScrollTrigger.create({
        trigger: visionSection,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => document.body.classList.add('body-vision-active'),
        onLeaveBack: () => document.body.classList.remove('body-vision-active'),
        onLeave: () => document.body.classList.remove('body-vision-active'),
        onEnterBack: () => document.body.classList.add('body-vision-active'),
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <Hero />
      <SectionServicios />
      <SectionAbout />
      <SectionQueRevisamos />
      <GalleryHorizontal />
      <SectionImagenes />
      <VisionTest />
    </div>
  )
}
