import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SectionCard } from '../components/layout/SectionCard'
import { ImageField } from '../components/fields/ImageField'
import { Tabs } from '../components/ui/Tabs'

// ——— Helpers ———
function Input({
  label,
  value,
  onChange,
  ...props
}: { label: string; value: string; onChange: (v: string) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)]"
        {...props}
      />
    </div>
  )
}

function Textarea({
  label,
  value,
  onChange,
  ...props
}: { label: string; value: string; onChange: (v: string) => void } & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value'
>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)]"
        {...props}
      />
    </div>
  )
}

const CTA_PAGE_OPTIONS: { value: string; label: string }[] = [
  { value: '/', label: 'Inicio' },
  { value: '/nosotros', label: 'Nosotros' },
  { value: '/ucad-te-veo-te-ves', label: 'UCAD Te Veo y Te Ves' },
  { value: '/retinher-transforma', label: 'Retinher Transforma' },
  { value: '/sedes', label: 'Sedes' },
  { value: '/informes', label: 'Informes' },
  { value: '/contacto', label: 'Contacto' },
]

const CTA_SECTION_OPTIONS: { value: string; label: string }[] = [
  { value: 'vision-lab', label: 'Test visual (vision-lab)' },
  { value: 'que-hacemos', label: '¿Qué hacemos? (que-hacemos)' },
  { value: 'gallery', label: 'Galería (gallery)' },
  { value: 'doctor', label: 'Doctor (doctor)' },
  { value: 'servicios', label: 'Servicios (servicios)' },
  { value: 'hero', label: 'Hero (arriba)' },
]

type HeroSlideItem = {
  id: string
  slide_order: number
  headline: string
  subline: string
  brand_line: string
  cta: string
  cta_link_type: 'page' | 'section'
  cta_link_value: string | null
  media_type: 'video' | 'image'
  media_url: string | null
}

type QueRevisamosItem = {
  id: string
  title: string
  text: string
  title_right: string | null
  text_right: string | null
  cta_text: string | null
  cta_link_type: 'page' | 'section' | null
  cta_link_value: string | null
  cta_text_left: string | null
  cta_link_type_left: 'page' | 'section' | null
  cta_link_value_left: string | null
}

type SellosReconSection = { id: string; titulo: string; subtitulo: string; cta: string }
type SellosReconItem = {
  id: string
  section_id: string
  slug: string
  orden: number
  titulo: string
  subtitulo: string
  descripcion: string
  imagen: string
}

export function InicioPage() {
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>([])
  const [queRevisamos, setQueRevisamos] = useState<QueRevisamosItem | null>(null)
  const [sellosRecon, setSellosRecon] = useState<SellosReconSection | null>(null)
  const [sellosReconItems, setSellosReconItems] = useState<SellosReconItem[]>([])
  const [ucad, setUcad] = useState<{
    id: string
    titulo: string
    subtitulo: string
    descripcion: string
    cta: string
    logo: string
    ruta: string
  } | null>(null)
  const [services, setServices] = useState<
    Array<{ id: string; slug: string; title: string; description: string; cta: string; image: string; section_order: number }>
  >([])
  const [doctor, setDoctor] = useState<{
    id: string
    nombre: string
    titulo: string
    descripcion: string
    imagen: string
  } | null>(null)
  const [gallery, setGallery] = useState<{ id: string; title: string; subtitle: string } | null>(null)
  const [galleryItems, setGalleryItems] = useState<
    Array<{ id: string; gallery_id: string; type: string; src: string; caption: string; item_order: number }>
  >([])
  const [homeNews, setHomeNews] = useState<
    Array<{ id: string; titulo: string; descripcion: string; fecha: string; media: Array<{ type: string; url: string }> }>
  >([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('hero_slides').select('*').order('slide_order'),
      supabase.from('que_revisamos').select('*').maybeSingle(),
      supabase.from('sellos_reconocimientos').select('*').maybeSingle(),
      supabase.from('sellos_reconocimientos_items').select('*').order('orden'),
      supabase.from('ucad_section').select('*').maybeSingle(),
      supabase.from('services').select('*').order('section_order'),
      supabase.from('doctor').select('*').maybeSingle(),
      supabase.from('gallery').select('*').maybeSingle(),
      supabase.from('gallery_items').select('*').order('item_order'),
      supabase.from('home_news').select('*').order('fecha', { ascending: false }),
    ]).then(
      ([hSlides, qR, sR, sRI, ucadR, servR, docR, galR, galIR, newsR]) => {
        setHeroSlides((hSlides.data ?? []) as HeroSlideItem[])
        setQueRevisamos((qR.data ?? null) as QueRevisamosItem | null)
        setSellosRecon((sR.data ?? null) as SellosReconSection | null)
        setSellosReconItems((sRI.data ?? []) as SellosReconItem[])
        setUcad(ucadR.data ?? null)
        setServices(
          (servR.data ?? []).map((s: { id: string; slug: string; title: string; description: string; cta: string; image: string; section_order: number }) => ({
            id: s.id,
            slug: s.slug,
            title: s.title,
            description: s.description,
            cta: s.cta,
            image: s.image,
            section_order: s.section_order,
          })),
        )
        setDoctor(docR.data ?? null)
        setGallery(galR.data ?? null)
        setGalleryItems(
          (galIR.data ?? []).map((x: { id: string; gallery_id: string; type: string; src: string; caption: string; item_order: number }) => ({
            id: x.id,
            gallery_id: x.gallery_id,
            type: x.type,
            src: x.src,
            caption: x.caption,
            item_order: x.item_order ?? 0,
          })),
        )
        setHomeNews(
          (newsR.data ?? []).map(
            (x: { id: string; titulo: string; descripcion: string; fecha: string; media: Array<{ type: string; url: string }> }) => ({
              id: x.id,
              titulo: x.titulo,
              descripcion: x.descripcion,
              fecha: x.fecha || new Date().toISOString().slice(0, 10),
              media: Array.isArray(x.media) ? x.media : [],
            }),
          ),
        )
        setLoading(false)
      },
    )
  }

  useEffect(() => {
    load()
  }, [])

  const setMsgOk = (m: string) => setMsg(m)
  const setMsgErr = (m: string) => setMsg(m)

  const isTempId = (id: string) => typeof id === 'string' && id.startsWith('temp-')

  // ——— Hero ———
  const addHeroSlide = () => {
    const nextOrder = heroSlides.length
    setHeroSlides((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        slide_order: nextOrder,
        headline: 'Nuevo slide',
        subline: 'RETINHER',
        brand_line: 'CENTRO DE ESPECIALIDADES',
        cta: 'Iniciar experiencia',
        cta_link_type: 'section' as const,
        cta_link_value: 'vision-lab',
        media_type: 'video' as const,
        media_url: null,
      },
    ])
    setMsg('Slide añadido. Rellena y guarda.')
  }

  const removeHeroSlide = async (id: string) => {
    if (heroSlides.length <= 1) {
      setMsgErr('Debe quedar al menos un slide.')
      return
    }
    if (!isTempId(id)) {
      setSaving(id)
      setMsg('')
      const { error } = await supabase.from('hero_slides').delete().eq('id', id)
      setSaving(null)
      if (error) {
        setMsgErr(error.message)
        return
      }
    }
    setHeroSlides((prev) => prev.filter((s) => s.id !== id))
    setMsgOk('Slide eliminado')
  }

  const saveHeroSlide = async (slide: HeroSlideItem, index: number) => {
    setSaving(slide.id)
    setMsg('')
    if (isTempId(slide.id)) {
      const { data: inserted, error } = await supabase
        .from('hero_slides')
        .insert({
          slide_order: index,
          headline: slide.headline,
          subline: slide.subline,
          brand_line: slide.brand_line,
          cta: slide.cta,
          cta_link_type: slide.cta_link_type ?? 'section',
          cta_link_value: slide.cta_link_value || null,
          media_type: slide.media_type,
          media_url: slide.media_url || null,
        })
        .select()
        .single()
      setSaving(null)
      if (error) {
        setMsgErr(error.message)
        return
      }
      setHeroSlides((prev) => prev.map((s) => (s.id === slide.id ? (inserted as HeroSlideItem) : s)))
      setMsgOk('Slide guardado')
      return
    }
    const { error } = await supabase
      .from('hero_slides')
      .update({
        slide_order: index,
        headline: slide.headline,
        subline: slide.subline,
        brand_line: slide.brand_line,
        cta: slide.cta,
        cta_link_type: slide.cta_link_type ?? 'section',
        cta_link_value: slide.cta_link_value || null,
        media_type: slide.media_type,
        media_url: slide.media_url || null,
      })
      .eq('id', slide.id)
    setSaving(null)
    if (error) setMsgErr(error.message)
    else setMsgOk('Slide guardado')
  }

  const updateHeroSlide = (index: number, patch: Partial<HeroSlideItem>) => {
    setHeroSlides((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  // ——— Lente (Qué revisamos) — guardado por lote (un solo registro)
  const saveLente = async () => {
    if (!queRevisamos) return
    setSaving('que_revisamos')
    setMsg('')
    const { error } = await supabase
      .from('que_revisamos')
      .update({
        title: queRevisamos.title,
        text: queRevisamos.text,
        title_right: queRevisamos.title_right || null,
        text_right: queRevisamos.text_right || null,
        cta_text: queRevisamos.cta_text || null,
        cta_link_type: queRevisamos.cta_link_type || null,
        cta_link_value: queRevisamos.cta_link_value || null,
        cta_text_left: queRevisamos.cta_text_left || null,
        cta_link_type_left: queRevisamos.cta_link_type_left || null,
        cta_link_value_left: queRevisamos.cta_link_value_left || null,
      })
      .eq('id', queRevisamos.id)
    setSaving(null)
    if (error) setMsgErr(error.message)
    else setMsgOk('Sección Lente guardada')
  }

  // ——— Reconocimientos (Nuestros reconocimientos) — sellos_reconocimientos + items, guardado por lote
  const saveReconocimientos = async () => {
    if (!sellosRecon) return
    setSaving('reconocimientos')
    setMsg('')
    const { error: errSection } = await supabase
      .from('sellos_reconocimientos')
      .update({ titulo: sellosRecon.titulo, subtitulo: sellosRecon.subtitulo, cta: sellosRecon.cta })
      .eq('id', sellosRecon.id)
    if (errSection) {
      setSaving(null)
      setMsgErr(errSection.message)
      return
    }
    let itemsToUpdate = [...sellosReconItems]
    for (let i = 0; i < itemsToUpdate.length; i++) {
      const item = itemsToUpdate[i]
      if (isTempId(item.id)) {
        const { data: inserted, error: errInsert } = await supabase
          .from('sellos_reconocimientos_items')
          .insert({
            section_id: sellosRecon.id,
            slug: item.slug || `recon-${Date.now()}`,
            orden: item.orden,
            titulo: item.titulo,
            subtitulo: item.subtitulo,
            descripcion: item.descripcion,
            imagen: item.imagen,
          })
          .select()
          .single()
        if (errInsert) {
          setSaving(null)
          setMsgErr(errInsert.message)
          return
        }
        itemsToUpdate = itemsToUpdate.map((x) => (x.id === item.id ? (inserted as SellosReconItem) : x))
      }
    }
    for (const item of itemsToUpdate) {
      const { error: errItem } = await supabase
        .from('sellos_reconocimientos_items')
        .update({
          titulo: item.titulo,
          subtitulo: item.subtitulo,
          descripcion: item.descripcion,
          imagen: item.imagen,
          orden: item.orden,
        })
        .eq('id', item.id)
      if (errItem) {
        setSaving(null)
        setMsgErr(errItem.message)
        return
      }
    }
    setSellosReconItems(itemsToUpdate)
    setSaving(null)
    setMsgOk('Reconocimientos guardados')
  }

  const addReconocimientoItem = () => {
    if (!sellosRecon?.id) return
    const nextOrden = sellosReconItems.length
    setSellosReconItems((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        section_id: sellosRecon!.id,
        slug: `recon-${Date.now()}`,
        orden: nextOrden,
        titulo: 'Nuevo reconocimiento',
        subtitulo: 'Subtítulo',
        descripcion: 'Descripción.',
        imagen: '',
      },
    ])
    setMsg('Reconocimiento añadido. Rellena y guarda.')
  }

  const removeReconocimientoItem = async (id: string) => {
    if (!isTempId(id)) {
      setSaving(id)
      setMsg('')
      const { error } = await supabase.from('sellos_reconocimientos_items').delete().eq('id', id)
      setSaving(null)
      if (error) {
        setMsgErr(error.message)
        return
      }
    }
    setSellosReconItems((prev) => prev.filter((x) => x.id !== id))
    setMsgOk('Reconocimiento eliminado')
  }

  const updateSellosReconItem = (id: string, patch: Partial<SellosReconItem>) => {
    setSellosReconItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  // ——— UCAD — un solo Guardar
  const saveUcad = async () => {
    if (!ucad) return
    setSaving('ucad_section')
    setMsg('')
    const { error } = await supabase.from('ucad_section').update(ucad).eq('id', ucad.id)
    setSaving(null)
    if (error) setMsgErr(error.message)
    else setMsgOk('UCAD guardado')
  }

  // ——— Servicios — guardado por lote + añadir otro
  const saveServicios = async () => {
    setSaving('services')
    setMsg('')
    let list = [...services]
    for (let i = 0; i < list.length; i++) {
      const s = list[i]
      if (isTempId(s.id)) {
        const { data: inserted, error: errInsert } = await supabase
          .from('services')
          .insert({
            slug: s.slug || `servicio-${Date.now()}`,
            section_order: s.section_order,
            title: s.title,
            description: s.description,
            cta: s.cta,
            image: s.image,
          })
          .select()
          .single()
        if (errInsert) {
          setSaving(null)
          setMsgErr(errInsert.message)
          return
        }
        list = list.map((x) => (x.id === s.id ? { ...inserted, section_order: (inserted as { section_order: number }).section_order } : x))
      }
    }
    for (const s of list) {
      const { error } = await supabase
        .from('services')
        .update({
          slug: s.slug,
          title: s.title,
          description: s.description,
          cta: s.cta,
          image: s.image,
          section_order: s.section_order,
        })
        .eq('id', s.id)
      if (error) {
        setSaving(null)
        setMsgErr(error.message)
        return
      }
    }
    setServices(list)
    setSaving(null)
    setMsgOk('Servicios guardados')
  }

  const addService = () => {
    const nextOrder = services.length
    setServices((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        slug: `servicio-${Date.now()}`,
        title: 'Nuevo servicio',
        description: 'Descripción.',
        cta: 'Más información',
        image: '',
        section_order: nextOrder,
      },
    ])
    setMsg('Servicio añadido. Rellena y guarda.')
  }

  const updateService = (id: string, patch: Partial<(typeof services)[0]>) => {
    setServices((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  // ——— Doctor — un solo Guardar
  const saveDoctor = async () => {
    if (!doctor) return
    setSaving('doctor')
    setMsg('')
    const { error } = await supabase.from('doctor').update(doctor).eq('id', doctor.id)
    setSaving(null)
    if (error) setMsgErr(error.message)
    else setMsgOk('Doctor guardado')
  }

  // ——— Galería — cabecera + ítems por lote; opción pegar URL y subir
  const saveGaleria = async () => {
    if (!gallery) return
    setSaving('gallery')
    setMsg('')
    const { error: errGal } = await supabase.from('gallery').update({ title: gallery.title, subtitle: gallery.subtitle }).eq('id', gallery.id)
    if (errGal) {
      setSaving(null)
      setMsgErr(errGal.message)
      return
    }
    let itemsToUpdate = [...galleryItems]
    for (let i = 0; i < itemsToUpdate.length; i++) {
      const item = itemsToUpdate[i]
      if (isTempId(item.id)) {
        const { data: inserted, error: errInsert } = await supabase
          .from('gallery_items')
          .insert({
            gallery_id: gallery.id,
            type: item.type || 'image',
            src: item.src || '',
            caption: item.caption || 'Nueva imagen',
            item_order: item.item_order,
          })
          .select()
          .single()
        if (errInsert) {
          setSaving(null)
          setMsgErr(errInsert.message)
          return
        }
        itemsToUpdate = itemsToUpdate.map((x) =>
          x.id === item.id
            ? { id: (inserted as { id: string }).id, gallery_id: gallery.id, type: (inserted as { type: string }).type, src: (inserted as { src: string }).src, caption: (inserted as { caption: string }).caption, item_order: (inserted as { item_order: number }).item_order }
            : x
        )
      }
    }
    for (const item of itemsToUpdate) {
      const { error: errItem } = await supabase
        .from('gallery_items')
        .update({
          type: item.type,
          src: item.src,
          caption: item.caption,
          item_order: item.item_order,
        })
        .eq('id', item.id)
      if (errItem) {
        setSaving(null)
        setMsgErr(errItem.message)
        return
      }
    }
    setGalleryItems(itemsToUpdate)
    setSaving(null)
    setMsgOk('Galería guardada')
  }

  const addGalleryItem = () => {
    if (!gallery?.id) return
    const nextOrder = galleryItems.length
    setGalleryItems((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        gallery_id: gallery.id,
        type: 'image',
        src: '',
        caption: 'Nueva imagen',
        item_order: nextOrder,
      },
    ])
    setMsg('Ítem añadido. Rellena y guarda.')
  }

  const removeGalleryItem = async (id: string) => {
    if (!isTempId(id)) {
      setSaving(id)
      setMsg('')
      const { error } = await supabase.from('gallery_items').delete().eq('id', id)
      setSaving(null)
      if (error) {
        setMsgErr(error.message)
        return
      }
    }
    setGalleryItems((prev) => prev.filter((x) => x.id !== id))
    setMsgOk('Ítem eliminado')
  }

  const updateGalleryItem = (id: string, patch: Partial<{ type: string; src: string; caption: string }>) => {
    setGalleryItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  // ——— Noticias — guardar por noticia; añadir en estado, guardar después
  const saveNews = async (id: string, item: { titulo: string; descripcion: string; fecha: string; media: Array<{ type: string; url: string }> }) => {
    setSaving(id)
    setMsg('')
    if (isTempId(id)) {
      const { data: inserted, error } = await supabase
        .from('home_news')
        .insert({
          titulo: item.titulo,
          descripcion: item.descripcion,
          fecha: item.fecha,
          media: item.media ?? [],
        })
        .select()
        .single()
      setSaving(null)
      if (error) {
        setMsgErr(error.message)
        return
      }
      setHomeNews((prev) => prev.map((n) => (n.id === id ? { ...(inserted as (typeof homeNews)[0]) } : n)))
      setMsgOk('Noticia guardada')
      return
    }
    const { error } = await supabase
      .from('home_news')
      .update({ titulo: item.titulo, descripcion: item.descripcion, fecha: item.fecha, media: item.media })
      .eq('id', id)
    setSaving(null)
    if (error) setMsgErr(error.message)
    else setMsgOk('Noticia guardada')
  }

  const addNews = () => {
    setHomeNews((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        titulo: 'Nueva noticia',
        descripcion: 'Descripción.',
        fecha: new Date().toISOString().slice(0, 10),
        media: [],
      },
    ])
    setMsg('Noticia añadida. Rellena y guarda.')
  }

  const removeNews = async (id: string) => {
    if (!isTempId(id)) {
      setSaving(id)
      setMsg('')
      const { error } = await supabase.from('home_news').delete().eq('id', id)
      setSaving(null)
      if (error) {
        setMsgErr(error.message)
        return
      }
    }
    setHomeNews((prev) => prev.filter((n) => n.id !== id))
    setMsgOk('Noticia eliminada')
  }

  const updateNews = (id: string, patch: Partial<(typeof homeNews)[0]>) => {
    setHomeNews((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        Cargando…
      </div>
    )

  const tabs = [
    {
      id: 'hero',
      label: 'Hero (slider)',
      content: (
        <SectionCard title="Hero — Slider">
          <div className="space-y-6">
            {heroSlides.map((slide, index) => (
              <div key={slide.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Slide {index + 1}</h3>
                  {heroSlides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHeroSlide(slide.id)}
                      disabled={!!saving}
                      className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <Input label="Headline" value={slide.headline} onChange={(v) => updateHeroSlide(index, { headline: v })} />
                  <Input label="Subline" value={slide.subline} onChange={(v) => updateHeroSlide(index, { subline: v })} />
                  <Input label="Brand line" value={slide.brand_line} onChange={(v) => updateHeroSlide(index, { brand_line: v })} />
                  <Input label="CTA (texto del botón)" value={slide.cta} onChange={(v) => updateHeroSlide(index, { cta: v })} />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Destino del CTA</label>
                    <select
                      value={slide.cta_link_type ?? 'section'}
                      onChange={(e) =>
                        updateHeroSlide(index, {
                          cta_link_type: e.target.value as 'page' | 'section',
                          cta_link_value: e.target.value === 'page' ? '/' : (slide.cta_link_value || 'vision-lab'),
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-btn)]/30"
                    >
                      <option value="section">Sección (id)</option>
                      <option value="page">Página (ruta)</option>
                    </select>
                  </div>
                  {(slide.cta_link_type ?? 'section') === 'page' ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ruta</label>
                      <select
                        value={slide.cta_link_value ?? '/'}
                        onChange={(e) => updateHeroSlide(index, { cta_link_value: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        {CTA_PAGE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label} — {opt.value}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sección (id)</label>
                      <select
                        value={CTA_SECTION_OPTIONS.some((o) => o.value === (slide.cta_link_value || 'vision-lab')) ? (slide.cta_link_value || 'vision-lab') : '__otro__'}
                        onChange={(e) => updateHeroSlide(index, { cta_link_value: e.target.value === '__otro__' ? '' : e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        {CTA_SECTION_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                        <option value="__otro__">Otro</option>
                      </select>
                      {(!slide.cta_link_value || CTA_SECTION_OPTIONS.every((o) => o.value !== slide.cta_link_value)) && (
                        <input
                          type="text"
                          placeholder="Ej: vision-lab"
                          value={slide.cta_link_value ?? ''}
                          onChange={(e) => updateHeroSlide(index, { cta_link_value: e.target.value || null })}
                          className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de medio</label>
                    <select
                      value={slide.media_type}
                      onChange={(e) => updateHeroSlide(index, { media_type: e.target.value as 'video' | 'image' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="video">Video</option>
                      <option value="image">Imagen</option>
                    </select>
                  </div>
                  <ImageField
                    label={slide.media_type === 'video' ? 'URL del video' : 'Imagen de fondo'}
                    value={slide.media_url ?? ''}
                    onChange={(v) => updateHeroSlide(index, { media_url: v || null })}
                    folder="hero"
                  />
                  <button
                    type="button"
                    onClick={() => saveHeroSlide(slide, index)}
                    disabled={!!saving}
                    className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
                  >
                    {saving === slide.id ? 'Guardando…' : 'Guardar este slide'}
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addHeroSlide}
              className="w-full rounded-lg border-2 border-dashed border-[var(--color-btn)]/50 py-4 text-[var(--color-btn)] hover:bg-[var(--color-btn)]/5"
            >
              + Añadir slide
            </button>
          </div>
        </SectionCard>
      ),
    },
    {
      id: 'lente',
      label: 'Sección Lente',
      content: queRevisamos ? (
        <SectionCard title="Sección Lente (qué revisamos) — solo textos y CTAs">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              saveLente()
            }}
            className="space-y-4"
          >
            <p className="text-sm font-medium text-slate-600 border-b border-slate-200 pb-2">Lente izquierdo</p>
            <Input label="Título" value={queRevisamos.title} onChange={(v) => setQueRevisamos({ ...queRevisamos, title: v })} />
            <Textarea label="Texto" value={queRevisamos.text} onChange={(v) => setQueRevisamos({ ...queRevisamos, text: v })} rows={4} />
            <p className="text-sm font-medium text-slate-600 border-b border-slate-200 pb-2 pt-2">CTA lente izquierdo (opcional)</p>
            <Input
              label="Texto del botón"
              value={queRevisamos.cta_text_left ?? ''}
              onChange={(v) => setQueRevisamos({ ...queRevisamos, cta_text_left: v || null })}
              placeholder="Dejar vacío = sin CTA"
            />
            {(queRevisamos.cta_text_left ?? '').trim() && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
                  <select
                    value={queRevisamos.cta_link_type_left ?? 'page'}
                    onChange={(e) =>
                      setQueRevisamos({
                        ...queRevisamos,
                        cta_link_type_left: e.target.value as 'page' | 'section',
                        cta_link_value_left: e.target.value === 'page' ? '/' : (queRevisamos.cta_link_value_left || 'vision-lab'),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="section">Sección</option>
                    <option value="page">Página</option>
                  </select>
                </div>
                {(queRevisamos.cta_link_type_left ?? 'page') === 'page' ? (
                  <select
                    value={queRevisamos.cta_link_value_left ?? '/'}
                    onChange={(e) => setQueRevisamos({ ...queRevisamos, cta_link_value_left: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {CTA_PAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <select
                      value={CTA_SECTION_OPTIONS.some((o) => o.value === (queRevisamos.cta_link_value_left || 'vision-lab')) ? (queRevisamos.cta_link_value_left || 'vision-lab') : '__otro__'}
                      onChange={(e) => setQueRevisamos({ ...queRevisamos, cta_link_value_left: e.target.value === '__otro__' ? '' : e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      {CTA_SECTION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                      <option value="__otro__">Otro</option>
                    </select>
                    {(!queRevisamos.cta_link_value_left || CTA_SECTION_OPTIONS.every((o) => o.value !== queRevisamos.cta_link_value_left)) && (
                      <input
                        type="text"
                        placeholder="Ej: vision-lab"
                        value={queRevisamos.cta_link_value_left ?? ''}
                        onChange={(e) => setQueRevisamos({ ...queRevisamos, cta_link_value_left: e.target.value || null })}
                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    )}
                  </div>
                )}
              </>
            )}
            <p className="text-sm font-medium text-slate-600 border-b border-slate-200 pb-2 pt-4">Lente derecho</p>
            <Input label="Título (derecho)" value={queRevisamos.title_right ?? ''} onChange={(v) => setQueRevisamos({ ...queRevisamos, title_right: v || null })} />
            <Textarea label="Texto (derecho)" value={queRevisamos.text_right ?? ''} onChange={(v) => setQueRevisamos({ ...queRevisamos, text_right: v || null })} rows={4} />
            <p className="text-sm font-medium text-slate-600 border-b border-slate-200 pb-2 pt-2">CTA lente derecho (opcional)</p>
            <Input label="Texto del botón" value={queRevisamos.cta_text ?? ''} onChange={(v) => setQueRevisamos({ ...queRevisamos, cta_text: v || null })} placeholder="Ej: Conocer Retinher Transforma" />
            {(queRevisamos.cta_text ?? '').trim() && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
                  <select
                    value={queRevisamos.cta_link_type ?? 'page'}
                    onChange={(e) =>
                      setQueRevisamos({
                        ...queRevisamos,
                        cta_link_type: e.target.value as 'page' | 'section',
                        cta_link_value: e.target.value === 'page' ? '/retinher-transforma' : (queRevisamos.cta_link_value || 'vision-lab'),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="section">Sección</option>
                    <option value="page">Página</option>
                  </select>
                </div>
                {(queRevisamos.cta_link_type ?? 'page') === 'page' ? (
                  <select
                    value={queRevisamos.cta_link_value ?? '/retinher-transforma'}
                    onChange={(e) => setQueRevisamos({ ...queRevisamos, cta_link_value: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {CTA_PAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <select
                      value={CTA_SECTION_OPTIONS.some((o) => o.value === (queRevisamos.cta_link_value || 'vision-lab')) ? (queRevisamos.cta_link_value || 'vision-lab') : '__otro__'}
                      onChange={(e) => setQueRevisamos({ ...queRevisamos, cta_link_value: e.target.value === '__otro__' ? '' : e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      {CTA_SECTION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                      <option value="__otro__">Otro</option>
                    </select>
                    {(!queRevisamos.cta_link_value || CTA_SECTION_OPTIONS.every((o) => o.value !== queRevisamos.cta_link_value)) && (
                      <input
                        type="text"
                        placeholder="Ej: vision-lab"
                        value={queRevisamos.cta_link_value ?? ''}
                        onChange={(e) => setQueRevisamos({ ...queRevisamos, cta_link_value: e.target.value || null })}
                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    )}
                  </div>
                )}
              </>
            )}
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">
              {saving === 'que_revisamos' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos de la sección Lente.</p>
      ),
    },
    {
      id: 'reconocimientos',
      label: 'Reconocimientos',
      content: sellosRecon ? (
        <SectionCard title="Nuestros reconocimientos (logo, título, subtítulo, descripción)">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              saveReconocimientos()
            }}
            className="space-y-4"
          >
            <Input label="Título de la sección" value={sellosRecon.titulo} onChange={(v) => setSellosRecon({ ...sellosRecon, titulo: v })} />
            <Input label="Subtítulo de la sección" value={sellosRecon.subtitulo} onChange={(v) => setSellosRecon({ ...sellosRecon, subtitulo: v })} />
            <Input label="Texto del botón (CTA)" value={sellosRecon.cta} onChange={(v) => setSellosRecon({ ...sellosRecon, cta: v })} />
            <div className="border-t border-slate-200 pt-4 space-y-4">
              {sellosReconItems.map((item, idx) => (
                <div key={item.id} className="p-4 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Reconocimiento {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeReconocimientoItem(item.id)}
                      disabled={!!saving}
                      className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                  <ImageField label="Logo" value={item.imagen} onChange={(v) => updateSellosReconItem(item.id, { imagen: v })} folder="sellos" />
                  <Input label="Título" value={item.titulo} onChange={(v) => updateSellosReconItem(item.id, { titulo: v })} />
                  <Input label="Subtítulo" value={item.subtitulo} onChange={(v) => updateSellosReconItem(item.id, { subtitulo: v })} />
                  <Textarea label="Descripción" value={item.descripcion} onChange={(v) => updateSellosReconItem(item.id, { descripcion: v })} rows={2} />
                </div>
              ))}
              <button
                type="button"
                onClick={addReconocimientoItem}
                className="w-full py-2.5 text-sm border border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-[var(--color-btn)] hover:text-[var(--color-btn)]"
              >
                + Añadir otro reconocimiento
              </button>
            </div>
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">
              {saving === 'reconocimientos' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos de reconocimientos.</p>
      ),
    },
    {
      id: 'ucad',
      label: 'UCAD',
      content: ucad ? (
        <SectionCard title="UCAD">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              saveUcad()
            }}
            className="space-y-4"
          >
            <Input label="Título" value={ucad.titulo} onChange={(v) => setUcad({ ...ucad, titulo: v })} />
            <Input label="Subtítulo" value={ucad.subtitulo} onChange={(v) => setUcad({ ...ucad, subtitulo: v })} />
            <Textarea label="Descripción" value={ucad.descripcion} onChange={(v) => setUcad({ ...ucad, descripcion: v })} rows={3} />
            <Input label="CTA" value={ucad.cta} onChange={(v) => setUcad({ ...ucad, cta: v })} />
            <Input label="Ruta" value={ucad.ruta} onChange={(v) => setUcad({ ...ucad, ruta: v })} />
            <ImageField label="Logo" value={ucad.logo} onChange={(v) => setUcad({ ...ucad, logo: v })} folder="ucad" />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">
              {saving === 'ucad_section' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos UCAD.</p>
      ),
    },
    {
      id: 'servicios',
      label: 'Servicios',
      content: (
        <SectionCard title="Servicios">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              saveServicios()
            }}
            className="space-y-4"
          >
            <div className="space-y-6">
              {services.map((s, idx) => (
                <div key={s.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                  <div className="text-sm font-medium text-slate-500">Servicio {idx + 1} — slug: {s.slug}</div>
                  <Input label="Título" value={s.title} onChange={(v) => updateService(s.id, { title: v })} />
                  <Textarea label="Descripción" value={s.description} onChange={(v) => updateService(s.id, { description: v })} rows={3} />
                  <Input label="CTA" value={s.cta} onChange={(v) => updateService(s.id, { cta: v })} />
                  <ImageField label="Imagen" value={s.image} onChange={(v) => updateService(s.id, { image: v })} folder="services" />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addService}
              className="w-full py-2.5 text-sm border border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-[var(--color-btn)] hover:text-[var(--color-btn)] disabled:opacity-50"
            >
              + Añadir otro servicio
            </button>
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50 mt-4">
              {saving === 'services' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ),
    },
    {
      id: 'doctor',
      label: 'Doctor',
      content: doctor ? (
        <SectionCard title="Doctor">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              saveDoctor()
            }}
            className="space-y-4"
          >
            <Input label="Nombre" value={doctor.nombre} onChange={(v) => setDoctor({ ...doctor, nombre: v })} />
            <Input label="Título" value={doctor.titulo} onChange={(v) => setDoctor({ ...doctor, titulo: v })} />
            <Textarea label="Descripción" value={doctor.descripcion} onChange={(v) => setDoctor({ ...doctor, descripcion: v })} rows={4} />
            <ImageField label="Imagen" value={doctor.imagen} onChange={(v) => setDoctor({ ...doctor, imagen: v })} folder="doctor" />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">
              {saving === 'doctor' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos Doctor.</p>
      ),
    },
    {
      id: 'galeria',
      label: 'Galería',
      content: gallery ? (
        <SectionCard title="Galería">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              saveGaleria()
            }}
            className="space-y-4"
          >
            <Input label="Título" value={gallery.title} onChange={(v) => setGallery({ ...gallery, title: v })} />
            <Input label="Subtítulo" value={gallery.subtitle} onChange={(v) => setGallery({ ...gallery, subtitle: v })} />
            <p className="text-sm font-medium text-slate-600 border-b border-slate-200 pb-2 pt-4">Imágenes / vídeos (URL o subir)</p>
            <div className="mt-2 space-y-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="flex flex-wrap gap-4 items-start p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="w-24 h-16 rounded overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                    {item.src ? (
                      item.type === 'video' ? (
                        <video src={item.src} className="w-full h-full object-cover max-h-[72px]" muted />
                      ) : (
                        <img src={item.src} alt="" className="w-full h-full object-cover max-h-[72px]" />
                      )
                    ) : (
                      <span className="text-slate-400 text-xs">Sin URL</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                      <select
                        value={item.type}
                        onChange={(e) => updateGalleryItem(item.id, { type: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      >
                        <option value="image">Imagen</option>
                        <option value="video">Vídeo</option>
                      </select>
                    </div>
                    <ImageField label="URL o subir" value={item.src} onChange={(v) => updateGalleryItem(item.id, { src: v })} folder="gallery" />
                    <Input label="Caption" value={item.caption} onChange={(v) => updateGalleryItem(item.id, { caption: v })} placeholder="Descripción" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(item.id)}
                    disabled={!!saving}
                    className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addGalleryItem}
                className="w-full py-2.5 text-sm border border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-[var(--color-btn)] hover:text-[var(--color-btn)] disabled:opacity-50"
              >
                + Añadir imagen o vídeo
              </button>
            </div>
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50 mt-4">
              {saving === 'gallery' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos Galería.</p>
      ),
    },
    {
      id: 'noticias',
      label: 'Noticias',
      content: (
        <SectionCard title="Noticias (Home)">
          <div className="space-y-6">
            {homeNews.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{item.titulo || 'Sin título'}</h3>
                  <button type="button" onClick={() => removeNews(item.id)} disabled={!!saving} className="text-sm text-red-600 hover:underline disabled:opacity-50">
                    Eliminar
                  </button>
                </div>
                <div className="space-y-4">
                  <Input label="Título" value={item.titulo} onChange={(v) => updateNews(item.id, { titulo: v })} />
                  <Textarea label="Descripción" value={item.descripcion} onChange={(v) => updateNews(item.id, { descripcion: v })} rows={3} />
                  <Input label="Fecha" type="date" value={item.fecha} onChange={(v) => updateNews(item.id, { fecha: v })} />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Medios (URL)</label>
                    <div className="space-y-3">
                      {(item.media || []).map((m, idx) => (
                        <div key={idx} className="flex gap-2 items-start flex-wrap rounded-lg border border-slate-200 bg-white p-3">
                          <select
                            value={m.type}
                            onChange={(e) => {
                              const next = [...(item.media || [])]
                              next[idx] = { ...next[idx], type: e.target.value }
                              updateNews(item.id, { media: next })
                            }}
                            className="px-2 py-1.5 border border-slate-300 rounded text-sm"
                          >
                            <option value="image">Imagen</option>
                            <option value="video">Vídeo</option>
                          </select>
                          {m.type === 'video' ? (
                            <input
                              type="url"
                              value={m.url}
                              onChange={(e) => {
                                const next = [...(item.media || [])]
                                next[idx] = { ...next[idx], url: e.target.value }
                                updateNews(item.id, { media: next })
                              }}
                              placeholder="https://..."
                              className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                          ) : (
                            <div className="flex-1 min-w-[200px]">
                              <ImageField
                                label=""
                                value={m.url}
                                onChange={(v) => {
                                  const next = [...(item.media || [])]
                                  next[idx] = { ...next[idx], url: v }
                                  updateNews(item.id, { media: next })
                                }}
                                folder="news"
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => updateNews(item.id, { media: (item.media || []).filter((_, i) => i !== idx) })}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateNews(item.id, { media: [...(item.media || []), { type: 'image', url: '' }] })}
                        className="text-sm text-[var(--color-btn)] hover:underline"
                      >
                        + Añadir imagen o vídeo (URL)
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => saveNews(item.id, { titulo: item.titulo, descripcion: item.descripcion, fecha: item.fecha, media: item.media || [] })}
                    disabled={!!saving}
                    className="px-3 py-1.5 text-sm bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
                  >
                    {saving === item.id ? 'Guardando…' : 'Guardar noticia'}
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addNews}
              className="w-full py-2.5 text-sm border border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-[var(--color-btn)] hover:text-[var(--color-btn)] disabled:opacity-50"
            >
              + Crear noticia
            </button>
          </div>
        </SectionCard>
      ),
    },
  ]

  return (
    <div className="max-w-full space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Inicio</h1>
      <p className="text-sm text-slate-500">
        Hero → Lente → Reconocimientos → UCAD → Servicios → Doctor → Galería → Noticias. Cada pestaña modifica solo su sección. Un solo botón Guardar por sección (o por slide en Hero, por noticia en Noticias).
      </p>
      {msg && (
        <p className={`text-sm ${/guardad|añadido|creada|eliminado|Rellena y guarda/i.test(msg) ? 'text-green-600' : 'text-red-600'}`}>
          {msg}
        </p>
      )}
      <Tabs tabs={tabs} defaultTab="hero" />
    </div>
  )
}
