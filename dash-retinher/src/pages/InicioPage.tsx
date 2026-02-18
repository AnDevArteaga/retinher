import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SectionCard } from '../components/layout/SectionCard'
import { ImageField } from '../components/fields/ImageField'
import { Tabs } from '../components/ui/Tabs'

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
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)]"
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
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)]"
        {...props}
      />
    </div>
  )
}

export function InicioPage() {
  const [hero, setHero] = useState<{
    id: string
    headline: string
    subline: string
    brand_line: string
    cta: string
    video_placeholder: string | null
  } | null>(null)
  const [doctor, setDoctor] = useState<{
    id: string
    nombre: string
    titulo: string
    descripcion: string
    imagen: string
  } | null>(null)
  const [about, setAbout] = useState<{
    id: string
    title: string
    intro: string
    purpose: string
    cta_pdf: string
  } | null>(null)
  const [services, setServices] = useState<
    Array<{
      id: string
      slug: string
      title: string
      description: string
      cta: string
      image: string
      section_order: number
    }>
  >([])
  const [ucad, setUcad] = useState<{
    id: string
    titulo: string
    subtitulo: string
    descripcion: string
    cta: string
    logo: string
    ruta: string
  } | null>(null)
  const [queRevisamos, setQueRevisamos] = useState<{
    id: string
    title: string
    text: string
  } | null>(null)
  const [sellosImpacto, setSellosImpacto] = useState<{
    id: string
    titulo: string
    subtitulo: string
  } | null>(null)
  const [sellosImpactoItems, setSellosImpactoItems] = useState<
    Array<{
      id: string
      titulo: string
      logo: string
      descripcion: string
      por_que: string | null
      color: string
    }>
  >([])
  const [gallery, setGallery] = useState<{
    id: string
    title: string
    subtitle: string
  } | null>(null)
  const [galleryItems, setGalleryItems] = useState<
    Array<{ id: string; type: string; src: string; caption: string }>
  >([])
  const [imageSection, setImageSection] = useState<{
    id: string
    title: string
    subtitle: string
  } | null>(null)
  const [imageSectionItems, setImageSectionItems] = useState<
    Array<{ id: string; src: string; alt: string }>
  >([])
  const [visionLab, setVisionLab] = useState<{
    id: string
    title: string
    tagline: string
    calibration: string
    calibration_desc: string
    test_instruction: string
    feedback: { correct: string; incorrect: string }
  } | null>(null)
  const [navLinks, setNavLinks] = useState<
    Array<{ id: string; href: string; label: string }>
  >([])
  const [whatsapp, setWhatsapp] = useState<{
    id: string
    numero: string
    mensaje: string
  } | null>(null)
  const [footer, setFooter] = useState<{
    id: string
    sede1: string
    sede2: string
    pbx: string
    email: string
    city: string
    copyright: string
    privacy: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('hero').select('*').maybeSingle(),
      supabase.from('doctor').select('*').maybeSingle(),
      supabase.from('about').select('*').maybeSingle(),
      supabase.from('services').select('*').order('section_order'),
      supabase.from('ucad_section').select('*').maybeSingle(),
      supabase.from('que_revisamos').select('*').maybeSingle(),
      supabase.from('sellos_impacto').select('*').maybeSingle(),
      supabase.from('sellos_impacto_items').select('*').order('item_order'),
      supabase.from('gallery').select('*').maybeSingle(),
      supabase.from('gallery_items').select('*').order('item_order'),
      supabase.from('image_section').select('*').maybeSingle(),
      supabase.from('image_section_items').select('*').order('item_order'),
      supabase.from('vision_lab').select('*').maybeSingle(),
      supabase.from('nav_links').select('*').order('link_order'),
      supabase.from('whatsapp').select('*').maybeSingle(),
      supabase.from('footer').select('*').maybeSingle(),
    ]).then(([h, d, a, s, u, q, si, sii, g, gi, isec, isi, vl, nl, wa, f]) => {
      setHero(h.data ?? null)
      setDoctor(d.data ?? null)
      setAbout(a.data ?? null)
      setServices(
        (s.data ?? []) as Array<{
          id: string
          slug: string
          title: string
          description: string
          cta: string
          image: string
          section_order: number
        }>,
      )
      setUcad(u.data ?? null)
      setQueRevisamos(q.data ?? null)
      setSellosImpacto(si.data ?? null)
      setSellosImpactoItems(
        (sii.data ?? []).map(
          (x: {
            id: string
            titulo: string
            logo: string
            descripcion: string
            por_que: string | null
            color: string
          }) => ({
            id: x.id,
            titulo: x.titulo,
            logo: x.logo,
            descripcion: x.descripcion,
            por_que: x.por_que,
            color: x.color,
          }),
        ),
      )
      setGallery(g.data ?? null)
      setGalleryItems(
        (gi.data ?? []).map(
          (x: { id: string; type: string; src: string; caption: string }) => ({
            id: x.id,
            type: x.type,
            src: x.src,
            caption: x.caption,
          }),
        ),
      )
      setImageSection(isec.data ?? null)
      setImageSectionItems(
        (isi.data ?? []).map((x: { id: string; src: string; alt: string }) => ({
          id: x.id,
          src: x.src,
          alt: x.alt,
        })),
      )
      setVisionLab(vl.data ?? null)
      setNavLinks(
        (nl.data ?? []).map(
          (x: { id: string; href: string; label: string }) => ({
            id: x.id,
            href: x.href,
            label: x.label,
          }),
        ),
      )
      setWhatsapp(wa.data ?? null)
      setFooter(f.data ?? null)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (table: string, id: string, data: object) => {
    setSaving(table)
    setMsg('')
    const { data: updated, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .maybeSingle()
    setSaving(null)
    if (error) setMsg(error.message)
    else if (updated == null)
      setMsg(
        'No se guardó: el usuario no tiene permisos de administrador. Añade tu user_id a la tabla admins en Supabase.',
      )
    else {
      setMsg('Guardado')
      load()
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        Cargando…
      </div>
    )

  const btn = (label: string, savingKey: string) => (
    <button
      type="submit"
      disabled={!!saving}
      className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
    >
      {saving === savingKey ? 'Guardando…' : label}
    </button>
  )

  const tabs = [
    {
      id: 'hero',
      label: 'Hero',
      content: hero ? (
        <SectionCard title="Hero">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('hero', hero.id, hero)
            }}
            className="space-y-4"
          >
            <Input
              label="Headline"
              value={hero.headline}
              onChange={(v) => setHero({ ...hero, headline: v })}
            />
            <Input
              label="Subline"
              value={hero.subline}
              onChange={(v) => setHero({ ...hero, subline: v })}
            />
            <Input
              label="Brand line"
              value={hero.brand_line}
              onChange={(v) => setHero({ ...hero, brand_line: v })}
            />
            <Input
              label="CTA"
              value={hero.cta}
              onChange={(v) => setHero({ ...hero, cta: v })}
            />
            <ImageField
              label="Video placeholder"
              value={hero.video_placeholder ?? ''}
              onChange={(v) =>
                setHero({ ...hero, video_placeholder: v || null })
              }
              folder="hero"
            />
            {btn('Guardar Hero', 'hero')}
          </form>
        </SectionCard>
      ) : null,
    },
    {
      id: 'reconocimientos',
      label: 'Reconocimientos',
      content: sellosImpacto ? (
        <SectionCard title="Sellos de impacto (Reconocimientos)">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('sellos_impacto', sellosImpacto.id, sellosImpacto)
            }}
            className="space-y-4"
          >
            <Input
              label="Título"
              value={sellosImpacto.titulo}
              onChange={(v) =>
                setSellosImpacto({ ...sellosImpacto, titulo: v })
              }
            />
            <Input
              label="Subtítulo"
              value={sellosImpacto.subtitulo}
              onChange={(v) =>
                setSellosImpacto({ ...sellosImpacto, subtitulo: v })
              }
            />
            {btn('Guardar', 'sellos_impacto')}
          </form>
          <div className="mt-4 space-y-4">
            {sellosImpactoItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-2">
                <Input
                  label="Título"
                  value={item.titulo}
                  onChange={(v) =>
                    setSellosImpactoItems((prev) =>
                      prev.map((x) =>
                        x.id === item.id ? { ...x, titulo: v } : x,
                      ),
                    )
                  }
                />
                <ImageField
                  label="Logo"
                  value={item.logo}
                  onChange={(v) =>
                    setSellosImpactoItems((prev) =>
                      prev.map((x) =>
                        x.id === item.id ? { ...x, logo: v } : x,
                      ),
                    )
                  }
                  folder="sellos"
                />
                <Textarea
                  label="Descripción"
                  value={item.descripcion}
                  onChange={(v) =>
                    setSellosImpactoItems((prev) =>
                      prev.map((x) =>
                        x.id === item.id ? { ...x, descripcion: v } : x,
                      ),
                    )
                  }
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => save('sellos_impacto_items', item.id, item)}
                  disabled={!!saving}
                  className="px-3 py-1.5 text-sm bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null,
    },
    {
      id: 'ucad',
      label: 'UCAD',
      content: ucad ? (
        <SectionCard title="UCAD">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('ucad_section', ucad.id, ucad)
            }}
            className="space-y-4"
          >
            <Input
              label="Título"
              value={ucad.titulo}
              onChange={(v) => setUcad({ ...ucad, titulo: v })}
            />
            <Input
              label="Subtítulo"
              value={ucad.subtitulo}
              onChange={(v) => setUcad({ ...ucad, subtitulo: v })}
            />
            <Textarea
              label="Descripción"
              value={ucad.descripcion}
              onChange={(v) => setUcad({ ...ucad, descripcion: v })}
              rows={3}
            />
            <Input
              label="CTA"
              value={ucad.cta}
              onChange={(v) => setUcad({ ...ucad, cta: v })}
            />
            <Input
              label="Ruta"
              value={ucad.ruta}
              onChange={(v) => setUcad({ ...ucad, ruta: v })}
            />
            <ImageField
              label="Logo"
              value={ucad.logo}
              onChange={(v) => setUcad({ ...ucad, logo: v })}
              folder="ucad"
            />
            {btn('Guardar UCAD', 'ucad_section')}
          </form>
        </SectionCard>
      ) : null,
    },
    {
      id: 'servicios',
      label: 'Servicios',
      content: (
        <SectionCard title="Servicios">
          <div className="space-y-6">
            {services.map((s) => (
              <div
                key={s.id}
                className="p-4 border border-slate-200 rounded-lg space-y-3"
              >
                <div className="text-sm font-medium text-slate-500">
                  Servicio: {s.slug}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    save('services', s.id, s)
                  }}
                  className="space-y-3"
                >
                  <Input
                    label="Título"
                    value={s.title}
                    onChange={(v) =>
                      setServices((prev) =>
                        prev.map((x) =>
                          x.id === s.id ? { ...x, title: v } : x,
                        ),
                      )
                    }
                  />
                  <Textarea
                    label="Descripción"
                    value={s.description}
                    onChange={(v) =>
                      setServices((prev) =>
                        prev.map((x) =>
                          x.id === s.id ? { ...x, description: v } : x,
                        ),
                      )
                    }
                    rows={3}
                  />
                  <Input
                    label="CTA"
                    value={s.cta}
                    onChange={(v) =>
                      setServices((prev) =>
                        prev.map((x) => (x.id === s.id ? { ...x, cta: v } : x)),
                      )
                    }
                  />
                  <ImageField
                    label="Imagen"
                    value={s.image}
                    onChange={(v) =>
                      setServices((prev) =>
                        prev.map((x) =>
                          x.id === s.id ? { ...x, image: v } : x,
                        ),
                      )
                    }
                    folder="services"
                  />
                  <button
                    type="submit"
                    disabled={!!saving}
                    className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50 text-sm"
                  >
                    Guardar
                  </button>
                </form>
              </div>
            ))}
          </div>
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
              save('doctor', doctor.id, doctor)
            }}
            className="space-y-4"
          >
            <Input
              label="Nombre"
              value={doctor.nombre}
              onChange={(v) => setDoctor({ ...doctor, nombre: v })}
            />
            <Input
              label="Título"
              value={doctor.titulo}
              onChange={(v) => setDoctor({ ...doctor, titulo: v })}
            />
            <Textarea
              label="Descripción"
              value={doctor.descripcion}
              onChange={(v) => setDoctor({ ...doctor, descripcion: v })}
              rows={4}
            />
            <ImageField
              label="Imagen"
              value={doctor.imagen}
              onChange={(v) => setDoctor({ ...doctor, imagen: v })}
              folder="doctor"
            />
            {btn('Guardar Doctor', 'doctor')}
          </form>
        </SectionCard>
      ) : null,
    },
    {
      id: 'visionlab',
      label: 'Vision Lab',
      content: visionLab ? (
        <SectionCard title="Vision Lab (test visual)">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('vision_lab', visionLab.id, visionLab)
            }}
            className="space-y-4"
          >
            <Input
              label="Título"
              value={visionLab.title}
              onChange={(v) => setVisionLab({ ...visionLab, title: v })}
            />
            <Input
              label="Tagline"
              value={visionLab.tagline}
              onChange={(v) => setVisionLab({ ...visionLab, tagline: v })}
            />
            <Input
              label="Calibración"
              value={visionLab.calibration}
              onChange={(v) => setVisionLab({ ...visionLab, calibration: v })}
            />
            <Input
              label="Desc calibración"
              value={visionLab.calibration_desc}
              onChange={(v) =>
                setVisionLab({ ...visionLab, calibration_desc: v })
              }
            />
            <Input
              label="Instrucción test"
              value={visionLab.test_instruction}
              onChange={(v) =>
                setVisionLab({ ...visionLab, test_instruction: v })
              }
            />
            <Input
              label="Feedback correcto"
              value={visionLab.feedback?.correct ?? ''}
              onChange={(v) =>
                setVisionLab({
                  ...visionLab,
                  feedback: { ...visionLab.feedback, correct: v },
                })
              }
            />
            <Input
              label="Feedback incorrecto"
              value={visionLab.feedback?.incorrect ?? ''}
              onChange={(v) =>
                setVisionLab({
                  ...visionLab,
                  feedback: { ...visionLab.feedback, incorrect: v },
                })
              }
            />
            {btn('Guardar', 'vision_lab')}
          </form>
        </SectionCard>
      ) : null,
    },
    {
      id: 'about',
      label: 'About',
      content: about ? (
        <SectionCard title="About">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('about', about.id, about)
            }}
            className="space-y-4"
          >
            <Input
              label="Título"
              value={about.title}
              onChange={(v) => setAbout({ ...about, title: v })}
            />
            <Textarea
              label="Intro (HTML)"
              value={about.intro}
              onChange={(v) => setAbout({ ...about, intro: v })}
              rows={4}
            />
            <Textarea
              label="Purpose"
              value={about.purpose}
              onChange={(v) => setAbout({ ...about, purpose: v })}
              rows={3}
            />
            <Input
              label="CTA PDF"
              value={about.cta_pdf}
              onChange={(v) => setAbout({ ...about, cta_pdf: v })}
            />
            {btn('Guardar About', 'about')}
          </form>
        </SectionCard>
      ) : null,
    },
    {
      id: 'galeria',
      label: 'Galería',
      content: gallery ? (
        <SectionCard title="Galería">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('gallery', gallery.id, gallery)
            }}
            className="space-y-4"
          >
            <Input
              label="Título"
              value={gallery.title}
              onChange={(v) => setGallery({ ...gallery, title: v })}
            />
            <Input
              label="Subtítulo"
              value={gallery.subtitle}
              onChange={(v) => setGallery({ ...gallery, subtitle: v })}
            />
            {btn('Guardar', 'gallery')}
          </form>
          <div className="mt-4 space-y-3">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-start p-3 border rounded-lg"
              >
                <div className="w-20 h-14 rounded overflow-hidden bg-slate-100 shrink-0">
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    label="URL"
                    value={item.src}
                    onChange={(v) =>
                      setGalleryItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, src: v } : x,
                        ),
                      )
                    }
                  />
                  <Input
                    label="Caption"
                    value={item.caption}
                    onChange={(v) =>
                      setGalleryItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, caption: v } : x,
                        ),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => save('gallery_items', item.id, item)}
                  disabled={!!saving}
                  className="px-3 py-1.5 text-sm bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null,
    },
    {
      id: 'querevisamos',
      label: 'Qué revisamos',
      content: queRevisamos ? (
        <SectionCard title="Qué revisamos">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('que_revisamos', queRevisamos.id, queRevisamos)
            }}
            className="space-y-4"
          >
            <Input
              label="Título"
              value={queRevisamos.title}
              onChange={(v) => setQueRevisamos({ ...queRevisamos, title: v })}
            />
            <Textarea
              label="Texto"
              value={queRevisamos.text}
              onChange={(v) => setQueRevisamos({ ...queRevisamos, text: v })}
              rows={4}
            />
            {btn('Guardar', 'que_revisamos')}
          </form>
        </SectionCard>
      ) : null,
    },
    {
      id: 'imagenes',
      label: 'Imágenes',
      content: imageSection ? (
        <SectionCard title="Image section">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('image_section', imageSection.id, imageSection)
            }}
            className="space-y-4"
          >
            <Input
              label="Título"
              value={imageSection.title}
              onChange={(v) => setImageSection({ ...imageSection, title: v })}
            />
            <Input
              label="Subtítulo"
              value={imageSection.subtitle}
              onChange={(v) =>
                setImageSection({ ...imageSection, subtitle: v })
              }
            />
            {btn('Guardar', 'image_section')}
          </form>
          <div className="mt-4 space-y-3">
            {imageSectionItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-start p-3 border rounded-lg"
              >
                <div className="w-16 h-16 rounded overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={item.src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    label="URL"
                    value={item.src}
                    onChange={(v) =>
                      setImageSectionItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, src: v } : x,
                        ),
                      )
                    }
                  />
                  <Input
                    label="Alt"
                    value={item.alt}
                    onChange={(v) =>
                      setImageSectionItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, alt: v } : x,
                        ),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => save('image_section_items', item.id, item)}
                  disabled={!!saving}
                  className="px-3 py-1.5 text-sm bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null,
    },
    {
      id: 'menu',
      label: 'Menú y pie',
      content: (
        <div className="space-y-6">
          {navLinks.length > 0 && (
            <SectionCard title="Enlaces del menú">
              <div className="space-y-3">
                {navLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex gap-2 items-center flex-wrap"
                  >
                    <Input
                      label="Href"
                      value={link.href}
                      onChange={(v) =>
                        setNavLinks((prev) =>
                          prev.map((x) =>
                            x.id === link.id ? { ...x, href: v } : x,
                          ),
                        )
                      }
                    />
                    <Input
                      label="Label"
                      value={link.label}
                      onChange={(v) =>
                        setNavLinks((prev) =>
                          prev.map((x) =>
                            x.id === link.id ? { ...x, label: v } : x,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => save('nav_links', link.id, link)}
                      disabled={!!saving}
                      className="px-3 py-1.5 text-sm bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
                    >
                      Guardar
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
          {whatsapp && (
            <SectionCard title="WhatsApp">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  save('whatsapp', whatsapp.id, whatsapp)
                }}
                className="space-y-4"
              >
                <Input
                  label="Número (código país, sin +)"
                  value={whatsapp.numero}
                  onChange={(v) => setWhatsapp({ ...whatsapp, numero: v })}
                />
                <Textarea
                  label="Mensaje por defecto"
                  value={whatsapp.mensaje}
                  onChange={(v) => setWhatsapp({ ...whatsapp, mensaje: v })}
                  rows={2}
                />
                {btn('Guardar', 'whatsapp')}
              </form>
            </SectionCard>
          )}
          {footer && (
            <SectionCard title="Footer">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  save('footer', footer.id, footer)
                }}
                className="space-y-4"
              >
                <Input
                  label="Sede 1"
                  value={footer.sede1}
                  onChange={(v) => setFooter({ ...footer, sede1: v })}
                />
                <Input
                  label="Sede 2"
                  value={footer.sede2}
                  onChange={(v) => setFooter({ ...footer, sede2: v })}
                />
                <Input
                  label="PBX"
                  value={footer.pbx}
                  onChange={(v) => setFooter({ ...footer, pbx: v })}
                />
                <Input
                  label="Email"
                  value={footer.email}
                  onChange={(v) => setFooter({ ...footer, email: v })}
                />
                <Input
                  label="Ciudad"
                  value={footer.city}
                  onChange={(v) => setFooter({ ...footer, city: v })}
                />
                <Input
                  label="Copyright"
                  value={footer.copyright}
                  onChange={(v) => setFooter({ ...footer, copyright: v })}
                />
                <Input
                  label="Privacidad"
                  value={footer.privacy}
                  onChange={(v) => setFooter({ ...footer, privacy: v })}
                />
                {btn('Guardar', 'footer')}
              </form>
            </SectionCard>
          )}
        </div>
      ),
    },
  ].map((t) => ({
    ...t,
    content: t.content ?? (
      <p className="text-slate-500 py-4">Sin datos para esta sección.</p>
    ),
  }))

  return (
    <div className="max-w-full space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">
        Inicio (página de inicio)
      </h1>
      <p className="text-sm text-slate-500">
        Mismo orden que en la web: Hero → Reconocimientos → UCAD → Servicios →
        Doctor → Vision Lab → About → Galería → Qué revisamos.
      </p>
      {msg && (
        <p
          className={`text-sm ${msg === 'Guardado' ? 'text-green-600' : 'text-red-600'}`}
        >
          {msg}
        </p>
      )}
      <Tabs tabs={tabs} defaultTab="hero" />
    </div>
  )
}
