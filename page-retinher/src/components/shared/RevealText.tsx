import { type ElementType, useEffect, useRef } from 'react'
import gsap from 'gsap'

type RevealTextProps = {
  text: string
  className?: string
  splitBy?: 'chars' | 'words'
  delay?: number
  stagger?: number
  ease?: string
  as?: ElementType
  /** Si true, no anima al montar (para que el padre controle con GSAP) */
  skipAutoAnimate?: boolean
}

export function RevealText({
  text,
  className = '',
  splitBy = 'words',
  delay = 0,
  stagger = 0.03,
  ease = 'power4.out',
  as: Tag = 'span' as ElementType,
  skipAutoAnimate = false,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (skipAutoAnimate) return
    const ctx = gsap.context(() => {
      const el = containerRef.current
      if (!el) return

      const units = el.querySelectorAll('.reveal-unit')
      gsap.set(units, { opacity: 0, y: 40 })

      gsap.to(units, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        stagger,
        ease,
        overwrite: 'auto',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [text, splitBy, delay, stagger, ease, skipAutoAnimate])

  const content =
    splitBy === 'chars'
      ? text.split('').map((char, i) => (
          <span
            key={i}
            className="reveal-unit inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </span>
        ))
      : text.split(' ').flatMap((word, i, arr) => [
          <span key={`w-${i}`} className="reveal-unit inline-block">
            {word}
          </span>,
          ...(i < arr.length - 1
            ? [
                <span
                  key={`s-${i}`}
                  className="inline-block w-[0.35em]"
                  aria-hidden
                />,
              ]
            : []),
        ])

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLSpanElement>}
      className={className}
    >
      {content}
    </Tag>
  )
}
