import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SectionCard } from '../components/layout/SectionCard'
import { ImageField } from '../components/fields/ImageField'
import { Tabs } from '../components/ui/Tabs'
import { Plus, Trash2 } from 'lucide-react'

function Input({
  label,
  value,
  onChange,
  ...props
}: {
  label: string
  value: string
  onChange: (v: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
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
}: {
  label: string
  value: string
  onChange: (v: string) => void
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>) {
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

type HeroRow = {
  id: string
  headline: string
  subline: string
  brand_line: string | null
  media_type: 'video' | 'image'
  media_url: string | null
}

type EcosistemaBloque = { id: string; titulo: string; sello: string; parrafos: string[]; highlights: string[] }

type SellosImpactoSection = { id: string; titulo: string; subtitulo: string }

type SelloItemRow = {
  id: string
  section_id: string
  slug: string
  titulo: string
  logo: string
  descripcion: string
  por_que: string | null
  que_hicieron: string[]
  stats: Array<{ valor: string; unidad: string; label: string }>
  tags: string[]
  color: string
  item_order: number
  media: Array<{ type: string; url: string }>
}

const SELLO_OPTIONS = [
  { value: 'verde', label: 'Verde' },
  { value: 'azul', label: 'Azul' },
  { value: 'morado', label: 'Morado' },
]

export function RetinherTransformaPage() {
  const [hero, setHero] = useState<HeroRow | null>(null)
  const [ecosistema, setEcosistema] = useState<{ id: string; titulo_seccion: string; subtitulo_seccion: string; bloques: EcosistemaBloque[] } | null>(null)
  const [sellosSection, setSellosSection] = useState<SellosImpactoSection | null>(null)
  const [sellosItems, setSellosItems] = useState<SelloItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('retinher_transforma_hero').select('*').maybeSingle(),
      supabase.from('ecosistema_impacto').select('*').maybeSingle(),
      supabase.from('sellos_impacto').select('*').maybeSingle(),
      supabase.from('sellos_impacto_items').select('*').order('item_order'),
    ]).then(([heroRes, ecoRes, sellosSecRes, sellosItemsRes]) => {
      setHero(heroRes.data as HeroRow | null)
      const eco = ecoRes.data as { id: string; titulo_seccion: string; subtitulo_seccion: string; bloques: unknown } | null
      if (eco) {
        const bloques = Array.isArray(eco.bloques)
          ? (eco.bloques as Array<{ id?: string; titulo?: string; sello?: string; parrafos?: unknown; highlights?: unknown }>).map((b) => ({
              id: typeof b.id === 'string' ? b.id : `bloque-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              titulo: typeof b.titulo === 'string' ? b.titulo : '',
              sello: typeof b.sello === 'string' ? b.sello : 'verde',
              parrafos: Array.isArray(b.parrafos) ? (b.parrafos as string[]).map(String) : [],
              highlights: Array.isArray(b.highlights) ? (b.highlights as string[]).map(String) : [],
            }))
          : []
        setEcosistema({ ...eco, bloques })
      } else setEcosistema(null)
      const sec = sellosSecRes.data as { id: string; titulo: string; subtitulo: string } | null
      setSellosSection(sec)
      const raw = (sellosItemsRes.data ?? []) as Array<{
        id: string
        section_id: string
        slug: string
        titulo: string
        logo: string
        descripcion: string
        por_que: string | null
        que_hicieron: unknown
        stats: unknown
        tags: unknown
        color: string
        item_order: number
        media?: Array<{ type: string; url: string }>
      }>
      setSellosItems(
        raw.map((i) => ({
          id: i.id,
          section_id: i.section_id,
          slug: i.slug,
          titulo: i.titulo,
          logo: i.logo,
          descripcion: i.descripcion,
          por_que: i.por_que ?? null,
          que_hicieron: Array.isArray(i.que_hicieron) ? (i.que_hicieron as string[]) : [],
          stats: Array.isArray(i.stats) ? (i.stats as Array<{ valor: string; unidad: string; label: string }>) : [],
          tags: Array.isArray(i.tags) ? (i.tags as string[]) : [],
          color: i.color || '#2980B9',
          item_order: i.item_order ?? 0,
          media: Array.isArray(i.media) ? i.media : [],
        })),
      )
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const saveHero = async () => {
    if (!hero?.id) return
    setSaving(hero.id)
    setMsg('')
    const { error } = await supabase
      .from('retinher_transforma_hero')
      .update({
        headline: hero.headline,
        subline: hero.subline,
        brand_line: hero.brand_line || null,
        media_type: hero.media_type,
        media_url: hero.media_url || null,
      })
      .eq('id', hero.id)
    setSaving(null)
    if (error) setMsg(error.message)
    else setMsg('Guardado')
  }

  const saveEcosistema = async () => {
    if (!ecosistema?.id) return
    setSaving('ecosistema')
    setMsg('')
    const { error } = await supabase
      .from('ecosistema_impacto')
      .update({
        titulo_seccion: ecosistema.titulo_seccion,
        subtitulo_seccion: ecosistema.subtitulo_seccion,
        bloques: ecosistema.bloques,
      })
      .eq('id', ecosistema.id)
    setSaving(null)
    if (error) setMsg(error.message)
    else setMsg('Ecosistema guardado')
  }

  const updateEcosistemaBloque = (index: number, patch: Partial<EcosistemaBloque>) => {
    if (!ecosistema) return
    setEcosistema({
      ...ecosistema,
      bloques: ecosistema.bloques.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    })
  }

  const addEcosistemaBloque = () => {
    if (!ecosistema) return
    setEcosistema({
      ...ecosistema,
      bloques: [
        ...ecosistema.bloques,
        { id: `bloque-${Date.now()}`, titulo: 'Nuevo bloque', sello: 'verde', parrafos: [], highlights: [] },
      ],
    })
  }

  const removeEcosistemaBloque = (index: number) => {
    if (!ecosistema) return
    setEcosistema({ ...ecosistema, bloques: ecosistema.bloques.filter((_, i) => i !== index) })
  }

  const saveSellosSection = async () => {
    if (!sellosSection?.id) return
    setSaving('sellos_section')
    setMsg('')
    const { error } = await supabase
      .from('sellos_impacto')
      .update({ titulo: sellosSection.titulo, subtitulo: sellosSection.subtitulo })
      .eq('id', sellosSection.id)
    setSaving(null)
    if (error) setMsg(error.message)
    else setMsg('Sección guardada')
  }

  const updateSello = (id: string, patch: Partial<SelloItemRow>) => {
    setSellosItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const saveSello = async (item: SelloItemRow) => {
    setSaving(item.id)
    setMsg('')
    const { error } = await supabase
      .from('sellos_impacto_items')
      .update({
        slug: item.slug,
        titulo: item.titulo,
        logo: item.logo,
        descripcion: item.descripcion,
        por_que: item.por_que || null,
        que_hicieron: item.que_hicieron,
        stats: item.stats,
        tags: item.tags,
        color: item.color,
        media: item.media,
      })
      .eq('id', item.id)
    setSaving(null)
    if (error) setMsg(error.message)
    else setMsg('Sello guardado')
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        Cargando…
      </div>
    )

  /** Lista de strings editable (para párrafos y highlights en ecosistema) */
  const EditableList = ({
    items,
    onChange,
    placeholder,
    multiline,
  }: {
    items: string[]
    onChange: (items: string[]) => void
    placeholder?: string
    multiline?: boolean
  }) => {
    const [input, setInput] = useState('')
    const add = () => {
      const t = input.trim()
      if (!t) return
      onChange([...items, t])
      setInput('')
    }
    const update = (i: number, v: string) => onChange(items.map((it, idx) => (idx === i ? v : it)))
    const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
    return (
      <div>
        <ul className="space-y-2 mb-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50/50 overflow-hidden">
              {multiline ? (
                <textarea value={item} onChange={(e) => update(i, e.target.value)} rows={2} className="flex-1 min-w-0 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-[var(--color-btn)]/20 rounded resize-y" />
              ) : (
                <input type="text" value={item} onChange={(e) => update(i, e.target.value)} className="flex-1 min-w-0 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-[var(--color-btn)]/20 rounded" />
              )}
              <button type="button" onClick={() => remove(i)} className="p-2 text-slate-400 hover:text-red-600 shrink-0" aria-label="Quitar">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())} placeholder={placeholder} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          <button type="button" onClick={add} className="inline-flex items-center gap-1.5 px-3 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:opacity-90 text-sm">
            <Plus className="w-4 h-4" /> Añadir
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      id: 'hero',
      label: 'Hero',
      content: hero ? (
        <SectionCard title="Hero">
          <form onSubmit={(e) => { e.preventDefault(); saveHero(); }} className="space-y-4">
            <Input label="Headline" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} />
            <Input label="Subline" value={hero.subline} onChange={(v) => setHero({ ...hero, subline: v })} />
            <Input label="Brand line (opcional)" value={hero.brand_line ?? ''} onChange={(v) => setHero({ ...hero, brand_line: v || null })} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de medio</label>
              <select value={hero.media_type} onChange={(e) => setHero({ ...hero, media_type: e.target.value as 'video' | 'image' })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-btn)]/30">
                <option value="video">Video</option>
                <option value="image">Imagen</option>
              </select>
            </div>
            <ImageField label={hero.media_type === 'video' ? 'URL del video' : 'Imagen de fondo'} value={hero.media_url ?? ''} onChange={(v) => setHero({ ...hero, media_url: v || null })} folder="hero" />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : <p className="text-slate-500 py-4">Sin datos.</p>,
    },
    {
      id: 'ecosistema',
      label: 'Ecosistema impacto',
      content: ecosistema ? (
        <SectionCard title="Ecosistema de impacto">
          <form onSubmit={(e) => { e.preventDefault(); saveEcosistema(); }} className="space-y-6">
            <Input label="Título de la sección" value={ecosistema.titulo_seccion} onChange={(v) => setEcosistema({ ...ecosistema, titulo_seccion: v })} />
            <Input label="Subtítulo de la sección" value={ecosistema.subtitulo_seccion} onChange={(v) => setEcosistema({ ...ecosistema, subtitulo_seccion: v })} />
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-3">Bloques</label>
              <div className="space-y-6">
                {ecosistema.bloques.map((bloque, bIdx) => (
                  <div key={bloque.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Input label="Título del bloque" value={bloque.titulo} onChange={(v) => updateEcosistemaBloque(bIdx, { titulo: v })} className="flex-1 min-w-[200px]" />
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600">Sello:</label>
                        <select value={bloque.sello} onChange={(e) => updateEcosistemaBloque(bIdx, { sello: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                          {SELLO_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => removeEcosistemaBloque(bIdx)} className="p-2 text-slate-400 hover:text-red-600" aria-label="Quitar bloque">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Párrafos</label>
                      <EditableList items={bloque.parrafos} onChange={(parrafos) => updateEcosistemaBloque(bIdx, { parrafos })} placeholder="Añadir párrafo" multiline />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Highlights (palabras o frases destacadas)</label>
                      <EditableList items={bloque.highlights} onChange={(highlights) => updateEcosistemaBloque(bIdx, { highlights })} placeholder="Añadir highlight" multiline={false} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addEcosistemaBloque} className="w-full py-2.5 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-[var(--color-btn)] hover:text-[var(--color-btn)] inline-flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Añadir bloque
                </button>
              </div>
            </div>
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">
              {saving === 'ecosistema' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : <p className="text-slate-500 py-4">Sin datos de Ecosistema impacto. Comprueba que exista un registro en la tabla ecosistema_impacto.</p>,
    },
    {
      id: 'reconocimientos',
      label: 'Reconocimientos',
      content: sellosSection ? (
        <SectionCard title="Reconocimientos (Sellos de Impacto)">
          <p className="text-sm text-slate-500 mb-4">
            Título de la sección y cada sello: logo, título, descripción, por qué, qué hicimos, highlights, tags, color y carrusel de medios.
          </p>
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Título de la sección</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Título"
                  value={sellosSection.titulo}
                  onChange={(v) => setSellosSection({ ...sellosSection, titulo: v })}
                />
                <Input
                  label="Subtítulo"
                  value={sellosSection.subtitulo}
                  onChange={(v) => setSellosSection({ ...sellosSection, subtitulo: v })}
                />
              </div>
              <button
                type="button"
                onClick={saveSellosSection}
                disabled={!!saving}
                className="mt-3 px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
              >
                {saving === 'sellos_section' ? 'Guardando…' : 'Guardar título'}
              </button>
            </div>

            {sellosItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
                <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">{item.titulo || item.slug || 'Sello'}</h3>
                <Input label="Slug (id interno)" value={item.slug} onChange={(v) => updateSello(item.id, { slug: v })} />
                <Input label="Título del sello" value={item.titulo} onChange={(v) => updateSello(item.id, { titulo: v })} />
                <ImageField label="Logo del sello" value={item.logo} onChange={(v) => updateSello(item.id, { logo: v })} folder="sellos" />
                <Textarea label="Descripción" value={item.descripcion} onChange={(v) => updateSello(item.id, { descripcion: v })} rows={3} />
                <Textarea label="Por qué lo tenemos" value={item.por_que ?? ''} onChange={(v) => updateSello(item.id, { por_que: v || null })} rows={2} />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qué hicimos (cada línea = un ítem)</label>
                  <textarea
                    value={item.que_hicieron.join('\n')}
                    onChange={(e) => updateSello(item.id, { que_hicieron: e.target.value.split('\n').filter(Boolean) })}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Highlights (stats) — valor, unidad, label</label>
                  {item.stats.map((s, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2 flex-wrap">
                      <input
                        placeholder="Valor"
                        value={s.valor}
                        onChange={(e) => {
                          const next = [...item.stats]
                          next[idx] = { ...next[idx], valor: e.target.value }
                          updateSello(item.id, { stats: next })
                        }}
                        className="w-24 px-2 py-1.5 border rounded text-sm"
                      />
                      <input
                        placeholder="Unidad"
                        value={s.unidad}
                        onChange={(e) => {
                          const next = [...item.stats]
                          next[idx] = { ...next[idx], unidad: e.target.value }
                          updateSello(item.id, { stats: next })
                        }}
                        className="w-20 px-2 py-1.5 border rounded text-sm"
                      />
                      <input
                        placeholder="Label"
                        value={s.label}
                        onChange={(e) => {
                          const next = [...item.stats]
                          next[idx] = { ...next[idx], label: e.target.value }
                          updateSello(item.id, { stats: next })
                        }}
                        className="flex-1 min-w-[100px] px-2 py-1.5 border rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => updateSello(item.id, { stats: item.stats.filter((_, i) => i !== idx) })}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateSello(item.id, { stats: [...item.stats, { valor: '', unidad: '', label: '' }] })}
                    className="text-sm text-[var(--color-btn)] hover:underline"
                  >
                    + Añadir highlight
                  </button>
                </div>

                <Input
                  label="Tags (separados por comas)"
                  value={item.tags.join(', ')}
                  onChange={(v) => updateSello(item.id, { tags: v.split(',').map((t) => t.trim()).filter(Boolean) })}
                />
                <Input label="Color (hex)" value={item.color} onChange={(v) => updateSello(item.id, { color: v })} />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Carrusel (imágenes o vídeos)</label>
                  <p className="text-xs text-slate-500 mb-2">Añadir URL o subir. Se muestra en el carrusel de cada sello.</p>
                  {(item.media || []).map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-start flex-wrap rounded-lg border border-slate-200 bg-white p-3 mb-2">
                      <select
                        value={m.type}
                        onChange={(e) => {
                          const next = [...(item.media || [])]
                          next[idx] = { ...next[idx], type: e.target.value }
                          updateSello(item.id, { media: next })
                        }}
                        className="px-2 py-1.5 border border-slate-300 rounded text-sm"
                      >
                        <option value="image">Imagen</option>
                        <option value="video">Vídeo</option>
                      </select>
                      <div className="flex-1 min-w-[200px]">
                        <ImageField
                          label="URL o subir"
                          value={m.url}
                          onChange={(url) => {
                          const next = [...(item.media || [])]
                          next[idx] = { ...next[idx], url }
                          updateSello(item.id, { media: next })
                        }}
                          folder="sellos-media"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSello(item.id, { media: (item.media || []).filter((_, i) => i !== idx) })}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateSello(item.id, { media: [...(item.media || []), { type: 'image', url: '' }] })}
                    className="text-sm text-[var(--color-btn)] hover:underline"
                  >
                    + Añadir imagen o vídeo
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => saveSello(item)}
                  disabled={!!saving}
                  className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
                >
                  {saving === item.id ? 'Guardando…' : 'Guardar sello'}
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos de Reconocimientos.</p>
      ),
    },
  ]

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Retinher Transforma</h1>
      <p className="text-sm text-slate-500">Hero, Ecosistema de impacto y Reconocimientos (sellos de impacto).</p>
      {msg && <p className={`text-sm ${msg === 'Guardado' || msg.includes('guardado') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <Tabs tabs={tabs} defaultTab="hero" />
    </div>
  )
}
