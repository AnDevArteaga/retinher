import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useContent } from '../../contexts/ContentContext'

type NoticiaItem = {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  media: Array<{ type: 'image' | 'video'; url: string }>
}

function formatFecha(fecha: string) {
  try {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return fecha
  }
}

function PreviewMedia({ noticia }: { noticia: NoticiaItem }) {
  const first = noticia.media[0]
  if (!first) {
    return (
      <div className="aspect-video w-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
        Sin imagen
      </div>
    )
  }
  if (first.type === 'video') {
    return (
      <div className="aspect-video w-full bg-black relative overflow-hidden rounded-t-xl">
        <video
          src={first.url}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          poster=""
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="aspect-video w-full bg-slate-100 overflow-hidden rounded-t-xl">
      <img src={first.url} alt="" className="w-full h-full object-cover" />
    </div>
  )
}

function ModalNoticia({
  noticia,
  onClose,
}: {
  noticia: NoticiaItem
  onClose: () => void
}) {
  const [mediaIndex, setMediaIndex] = useState(0)
  const media = noticia.media
  const current = media[mediaIndex]
  const hasMultiple = media.length > 1

  const go = (delta: number) => {
    setMediaIndex((i) => (i + delta + media.length) % media.length)
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end p-3 bg-white border-b border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {formatFecha(noticia.fecha)}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            {noticia.titulo}
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed text-justify">
            {noticia.descripcion}
          </p>

          {media.length > 0 && (
            <div className="mt-6">
              {hasMultiple ? (
                <div className="relative rounded-xl overflow-hidden bg-slate-900">
                  {current.type === 'video' ? (
                    <video
                      src={current.url}
                      controls
                      autoPlay
                      className="w-full aspect-video object-contain"
                    />
                  ) : (
                    <img
                      src={current.url}
                      alt=""
                      className="w-full aspect-video object-contain bg-slate-900"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {media.map((_, k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setMediaIndex(k)}
                        className={`h-2 rounded-full transition-all ${
                          k === mediaIndex ? 'w-6 bg-white' : 'w-2 bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : current.type === 'video' ? (
                <video
                  src={current.url}
                  controls
                  autoPlay
                  className="w-full rounded-xl aspect-video object-contain bg-slate-900"
                />
              ) : (
                <img
                  src={current.url}
                  alt=""
                  className="w-full rounded-xl aspect-video object-contain bg-slate-100"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function SectionNoticias() {
  const { data } = useContent()
  const noticias = (data as { noticias?: NoticiaItem[] })?.noticias ?? []
  const [modalNoticia, setModalNoticia] = useState<NoticiaItem | null>(null)

  if (noticias.length === 0) return null

  return (
    <section className="relative w-full bg-slate-50 py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Noticias
          </h2>
          <p className="mt-3 text-slate-600 text-lg">
            Últimas novedades de Retinher
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {noticias.map((noticia) => (
            <button
              key={noticia.id}
              type="button"
              onClick={() => setModalNoticia(noticia)}
              className="text-left bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-btn)] focus:ring-offset-2"
            >
              <PreviewMedia noticia={noticia} />
              <div className="p-5 sm:p-6">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {formatFecha(noticia.fecha)}
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-900 line-clamp-2">
                  {noticia.titulo}
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3 text-justify">
                  {noticia.descripcion}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {modalNoticia && (
        <ModalNoticia noticia={modalNoticia} onClose={() => setModalNoticia(null)} />
      )}
    </section>
  )
}
