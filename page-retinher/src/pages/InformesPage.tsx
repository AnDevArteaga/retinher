import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, FileText, FileType } from 'lucide-react'
import { useContent } from '../contexts/ContentContext'

gsap.registerPlugin(ScrollTrigger)

type InformeItem = {
  id: string
  titulo: string
  descripcion: string
  archivoUrl: string
  archivoNombre: string
  archivoTipo: 'pdf' | 'docx'
  fecha: string | null
}

function formatFecha(fecha: string | null): string {
  if (!fecha) return ''
  const d = new Date(fecha + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return fecha
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

function downloadLabel(item: InformeItem): string {
  if (item.archivoNombre) return item.archivoNombre
  const ext = item.archivoTipo === 'docx' ? '.docx' : '.pdf'
  return `${item.titulo.replace(/\s+/g, '-').toLowerCase()}${ext}`
}

export function InformesPage() {
  const { data } = useContent()
  const informesData = (
    data as {
      informes?: {
        titulo: string
        subtitulo: string
        items: InformeItem[]
      }
    }
  )?.informes

  const heroRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const title = heroRef.current.querySelector('.informes-hero-title')
        const subtitle = heroRef.current.querySelector('.informes-hero-subtitle')
        gsap.fromTo(
          [title, subtitle],
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out' },
        )
      }

      const cards = gridRef.current?.querySelectorAll('.informe-card')
      if (cards?.length) {
        gsap.set(cards, { opacity: 0, y: 36 })
        ScrollTrigger.batch(cards, {
          start: 'top 88%',
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.1,
              ease: 'power2.out',
            }),
        })
      }
    })
    return () => ctx.revert()
  }, [informesData?.items?.length])

  const titulo = informesData?.titulo ?? 'Informes'
  const subtitulo =
    informesData?.subtitulo ??
    'Documentos institucionales y reportes de gestión disponibles para consulta y descarga.'
  const items = (informesData?.items ?? []).filter((i) => i.archivoUrl)

  return (
    <div className="informes-page min-h-screen bg-white">
      <section
        ref={heroRef}
        className="relative overflow-hidden px-6 pb-20 pt-36 md:px-12 md:pb-28 md:pt-44"
        style={{
          background: 'linear-gradient(135deg, #f4f7f9 0%, #ffffff 45%, #eef2ff 100%)',
        }}
      >
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#3d3f89]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[var(--color-btn)]/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#3d3f89]/70">
            Transparencia
          </p>
          <h1
            className="informes-hero-title text-4xl font-bold tracking-tight text-[#3d3f89] md:text-6xl"
            style={{ letterSpacing: '-0.02em' }}
          >
            {titulo}
          </h1>
          <p className="informes-hero-subtitle mx-auto mt-6 max-w-3xl text-lg font-light leading-relaxed text-slate-600 md:text-xl">
            {subtitulo}
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 md:pb-32">
        <div className="mx-auto max-w-6xl">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-8 py-16 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg text-slate-500">No hay informes publicados en este momento.</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const isPdf = item.archivoTipo === 'pdf'
                const Icon = isPdf ? FileText : FileType
                const accent = isPdf ? '#dc2626' : '#2563eb'
                const bgAccent = isPdf ? 'bg-red-50' : 'bg-blue-50'
                const fecha = formatFecha(item.fecha)

                return (
                  <article
                    key={item.id}
                    className="informe-card group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className={`flex items-center gap-4 border-b border-slate-100 px-6 py-5 ${bgAccent}`}>
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm"
                        style={{ color: accent }}
                      >
                        <Icon className="h-7 w-7" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <span
                          className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                          style={{ backgroundColor: accent }}
                        >
                          {isPdf ? 'PDF' : 'Word'}
                        </span>
                        {fecha && <p className="mt-1 text-xs text-slate-500">{fecha}</p>}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-6 py-5">
                      <h2 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-[#3d3f89] transition-colors">
                        {item.titulo}
                      </h2>
                      {item.descripcion && (
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 text-justify">
                          {item.descripcion}
                        </p>
                      )}

                      <a
                        href={item.archivoUrl}
                        download={downloadLabel(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-btn)' }}
                      >
                        <Download className="h-4 w-4" />
                        Descargar informe
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
