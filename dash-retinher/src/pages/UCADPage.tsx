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
}: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
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
}: { label: string; value: string; onChange: (v: string) => void } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-btn)]/30 min-h-[80px]"
        {...props}
      />
    </div>
  )
}

type GalleryItem = { id: string; ucad_page_id: string; item_order: number; src: string; alt: string }
type MetaItem = { id: string; item_order: number; valor: string; label: string; descripcion: string; icon: string; color: string }

const ICON_OPTIONS = ['Users', 'TrendingUp', 'Activity', 'Zap', 'Award', 'Heart', 'Target']
const COLOR_OPTIONS = ['verdeReti', 'azulUCAD', 'rojoAlerta']

export function UCADPage() {
  const [ucadPage, setUcadPage] = useState<{ id: string; titulo_galeria: string; subtitulo_galeria: string } | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [metas, setMetas] = useState<MetaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('ucad_page').select('*').maybeSingle(),
      supabase.from('ucad_page_gallery_items').select('*').order('item_order'),
      supabase.from('ucad_metas').select('*').order('item_order'),
    ]).then(([p, g, m]) => {
      setUcadPage(p.data as typeof ucadPage)
      setGalleryItems((g.data ?? []) as GalleryItem[])
      setMetas((m.data ?? []) as MetaItem[])
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const isTempId = (id: string) => id.startsWith('temp-')
  const setMsgOk = (m: string) => setMsg(m)
  const setMsgErr = (m: string) => setMsg(m)

  // ——— Galería: cabecera + ítems
  const saveGaleriaCabecera = async () => {
    if (!ucadPage) return
    setSaving('ucad_page')
    setMsg('')
    const { error } = await supabase
      .from('ucad_page')
      .update({ titulo_galeria: ucadPage.titulo_galeria, subtitulo_galeria: ucadPage.subtitulo_galeria })
      .eq('id', ucadPage.id)
    setSaving(null)
    if (error) setMsgErr(error.message)
    else setMsgOk('Títulos guardados')
  }

  const addGalleryItem = () => {
    if (!ucadPage?.id) return
    setGalleryItems((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        ucad_page_id: ucadPage.id,
        item_order: prev.length,
        src: '',
        alt: 'UCAD Te Veo y Te Ves',
      },
    ])
    setMsg('Ítem añadido. Rellena y guarda.')
  }

  const removeGalleryItem = async (id: string) => {
    if (!isTempId(id)) {
      setSaving(id)
      setMsg('')
      const { error } = await supabase.from('ucad_page_gallery_items').delete().eq('id', id)
      setSaving(null)
      if (error) {
        setMsgErr(error.message)
        return
      }
    }
    setGalleryItems((prev) => prev.filter((x) => x.id !== id))
    setMsgOk('Ítem eliminado')
  }

  const updateGalleryItem = (id: string, patch: Partial<GalleryItem>) => {
    setGalleryItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  const saveGaleriaItems = async () => {
    if (!ucadPage?.id) return
    setSaving('gallery_items')
    setMsg('')
    let list = [...galleryItems]
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (isTempId(item.id)) {
        const { data: inserted, error: errInsert } = await supabase
          .from('ucad_page_gallery_items')
          .insert({
            ucad_page_id: ucadPage.id,
            item_order: item.item_order,
            src: item.src || '',
            alt: item.alt || 'UCAD Te Veo y Te Ves',
          })
          .select()
          .single()
        if (errInsert) {
          setSaving(null)
          setMsgErr(errInsert.message)
          return
        }
        list = list.map((x) => (x.id === item.id ? (inserted as GalleryItem) : x))
      }
    }
    list.forEach((item, i) => { item.item_order = i })
    for (const item of list) {
      const { error } = await supabase
        .from('ucad_page_gallery_items')
        .update({ src: item.src, alt: item.alt, item_order: item.item_order })
        .eq('id', item.id)
      if (error) {
        setSaving(null)
        setMsgErr(error.message)
        return
      }
    }
    setGalleryItems(list)
    setSaving(null)
    setMsgOk('Galería guardada')
  }

  // ——— Metas
  const addMeta = () => {
    setMetas((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        item_order: prev.length,
        valor: '',
        label: '',
        descripcion: '',
        icon: 'Activity',
        color: 'verdeReti',
      },
    ])
    setMsg('Meta añadida. Rellena y guarda.')
  }

  const removeMeta = async (id: string) => {
    if (!isTempId(id)) {
      setSaving(id)
      setMsg('')
      const { error } = await supabase.from('ucad_metas').delete().eq('id', id)
      setSaving(null)
      if (error) {
        setMsgErr(error.message)
        return
      }
    }
    setMetas((prev) => prev.filter((x) => x.id !== id))
    setMsgOk('Meta eliminada')
  }

  const updateMeta = (id: string, patch: Partial<MetaItem>) => {
    setMetas((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  const saveMetas = async () => {
    setSaving('metas')
    setMsg('')
    let list = [...metas]
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (isTempId(item.id)) {
        const { data: inserted, error: errInsert } = await supabase
          .from('ucad_metas')
          .insert({
            item_order: item.item_order,
            valor: item.valor || '',
            label: item.label || '',
            descripcion: item.descripcion || '',
            icon: item.icon || 'Activity',
            color: item.color || 'verdeReti',
          })
          .select()
          .single()
        if (errInsert) {
          setSaving(null)
          setMsgErr(errInsert.message)
          return
        }
        list = list.map((x) => (x.id === item.id ? (inserted as MetaItem) : x))
      }
    }
    list.forEach((item, i) => { item.item_order = i })
    for (const item of list) {
      const { error } = await supabase
        .from('ucad_metas')
        .update({
          valor: item.valor,
          label: item.label,
          descripcion: item.descripcion,
          icon: item.icon,
          color: item.color,
          item_order: item.item_order,
        })
        .eq('id', item.id)
      if (error) {
        setSaving(null)
        setMsgErr(error.message)
        return
      }
    }
    setMetas(list)
    setSaving(null)
    setMsgOk('Metas guardadas')
  }

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-500">Cargando…</div>

  const tabs = [
    {
      id: 'galeria',
      label: 'Galería (En imágenes)',
      content: ucadPage ? (
        <SectionCard title="Sección galería — página UCAD Te Veo y Te Ves">
          <form onSubmit={(e) => { e.preventDefault(); saveGaleriaCabecera(); }} className="space-y-4 mb-8">
            <Input label="Título de la sección" value={ucadPage.titulo_galeria} onChange={(v) => setUcadPage({ ...ucadPage, titulo_galeria: v })} />
            <Input label="Subtítulo" value={ucadPage.subtitulo_galeria} onChange={(v) => setUcadPage({ ...ucadPage, subtitulo_galeria: v })} />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">Guardar títulos</button>
          </form>
          <div className="space-y-6">
            {galleryItems.map((item, index) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Imagen {index + 1}</span>
                  <button type="button" onClick={() => removeGalleryItem(item.id)} disabled={!!saving} className="text-sm text-red-600 hover:underline disabled:opacity-50">Eliminar</button>
                </div>
                <ImageField label="URL o subir" value={item.src} onChange={(v) => updateGalleryItem(item.id, { src: v })} folder="ucad" />
                <Input label="Texto alternativo (alt)" value={item.alt} onChange={(v) => updateGalleryItem(item.id, { alt: v })} className="mt-2" />
              </div>
            ))}
            <button type="button" onClick={addGalleryItem} className="w-full rounded-lg border-2 border-dashed border-[var(--color-btn)]/50 py-4 text-[var(--color-btn)] hover:bg-[var(--color-btn)]/5">+ Añadir imagen</button>
          </div>
          <button type="button" onClick={saveGaleriaItems} disabled={!!saving} className="mt-6 px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">{saving === 'gallery_items' ? 'Guardando…' : 'Guardar galería'}</button>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos.</p>
      ),
    },
    {
      id: 'metas',
      label: 'Metas e indicadores de éxito',
      content: (
        <SectionCard title="Metas e indicadores de éxito — 2025-2026">
          <div className="space-y-6">
            {metas.map((meta, index) => (
              <div key={meta.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Meta {index + 1}</span>
                  <button type="button" onClick={() => removeMeta(meta.id)} disabled={!!saving} className="text-sm text-red-600 hover:underline disabled:opacity-50">Eliminar</button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Valor (ej. 80%, &lt; 7 Días)" value={meta.valor} onChange={(v) => updateMeta(meta.id, { valor: v })} />
                  <Input label="Label (ej. Cobertura)" value={meta.label} onChange={(v) => updateMeta(meta.id, { label: v })} />
                </div>
                <Textarea label="Descripción" value={meta.descripcion} onChange={(v) => updateMeta(meta.id, { descripcion: v })} rows={2} className="mt-2" />
                <div className="mt-2 flex gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Icono</label>
                    <select value={meta.icon} onChange={(e) => updateMeta(meta.id, { icon: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                    <select value={meta.color} onChange={(e) => updateMeta(meta.id, { color: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                      {COLOR_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addMeta} className="w-full rounded-lg border-2 border-dashed border-[var(--color-btn)]/50 py-4 text-[var(--color-btn)] hover:bg-[var(--color-btn)]/5">+ Añadir meta</button>
          </div>
          <button type="button" onClick={saveMetas} disabled={!!saving} className="mt-6 px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">{saving === 'metas' ? 'Guardando…' : 'Guardar metas'}</button>
        </SectionCard>
      ),
    },
  ]

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">UCAD Te Veo y Te Ves (página)</h1>
      <p className="text-sm text-slate-500">Gestiona la galería «En imágenes» y la sección «Metas e indicadores de éxito». El resto de la página es estático.</p>
      {msg && <p className={`text-sm ${/guardad|añadid|eliminad|Rellena y guarda/.test(msg) ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <Tabs tabs={tabs} defaultTab="galeria" />
    </div>
  )
}
