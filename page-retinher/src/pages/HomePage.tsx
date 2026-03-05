import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hero } from '../components/sections/Hero'
import { SectionDoctor } from '../components/sections/SectionDoctor'
import { SectionSellosReconocimientosHome } from '../components/sections/SectionSellosReconocimientosHome'
import { SectionUCAD } from '../components/sections/SectionUCAD'
// import { SectionAbout } from '../components/sections/SectionAbout'
import { SectionServicios } from '../components/sections/SectionServicios'
import { SectionQueRevisamos } from '../components/sections/SectionQueRevisamos'
import { GalleryHorizontal } from '../components/sections/GalleryHorizontal'
import { SectionNoticias } from '../components/sections/SectionNoticias'
// import { SectionImagenes } from '../components/sections/SectionImagenes'
import { VisionTest } from '../components/shared/VisionTest'

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
      <VisionTest />
      <SectionQueRevisamos />
      <SectionSellosReconocimientosHome />
      <SectionUCAD />
      <SectionServicios />
      <SectionDoctor />
      {/* <SectionAbout /> */}
      <GalleryHorizontal />
      <SectionNoticias />
      {/* <SectionImagenes /> */}
    </div>
  )
}
