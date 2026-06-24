import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SectionCard } from '../components/layout/SectionCard'
import { FileField } from '../components/fields/FileField'
import { useUploadDocument } from '../hooks/useUploadDocument'

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

type InformeItem = {
  id: string
  informes_page_id: string
  item_order: number
  titulo: string
  descripcion: string
  archivo_url: string
  archivo_nombre: string
  archivo_tipo: 'pdf' | 'docx'
  fecha: string | null
}

function detectFileType(name: string): 'pdf' | 'docx' {
  const ref = name.toLowerCase()
  if (ref.endsWith('.docx') || ref.endsWith('.doc')) return 'docx'
  return 'pdf'
}

export function InformesPage() {
  const [page, setPage] = useState<{ id: string; titulo: string; subtitulo: string } | null>(null)
  const [items, setItems] = useState<InformeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const addFileRef = useRef<HTMLInputElement>(null)
  const { upload, uploading } = useUploadDocument()

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('informes_page').select('*').maybeSingle(),
      supabase.from('informes_items').select('*').order('item_order'),
    ]).then(([p, itemsR]) => {
      setPage(p.data as typeof page)
      setItems(
        (itemsR.data ?? []).map((x: InformeItem) => ({
          ...x,
          fecha: x.fecha || null,
        })),
      )
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const isTempId = (id: string) => id.startsWith('temp-')

  const saveCabecera = async () => {
    if (!page) return
    setSaving('cabecera')
    setMsg('')
    const { error } = await supabase
      .from('informes_page')
      .update({ titulo: page.titulo, subtitulo: page.subtitulo })
      .eq('id', page.id)
    setSaving(null)
    if (error) setMsg(error.message)
    else setMsg('Cabecera guardada')
  }

  const addItem = () => {
    if (!page?.id) {
      setMsg('No hay datos de la página Informes. Ejecuta la migración 013_informes.sql en Supabase.')
      return
    }
    setItems((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        informes_page_id: page.id,
        item_order: prev.length,
        titulo: 'Nuevo informe',
        descripcion: '',
        archivo_url: '',
        archivo_nombre: '',
        archivo_tipo: 'pdf',
        fecha: new Date().toISOString().slice(0, 10),
      },
    ])
    setMsg('Informe añadido. Usa «Subir archivo» o pega la URL, luego guarda.')
  }

  const openAddFilePicker = () => {
    if (!page?.id) {
      setMsg('No hay datos de la página Informes. Ejecuta la migración 013_informes.sql en Supabase.')
      return
    }
    if (addFileRef.current) {
      addFileRef.current.value = ''
      addFileRef.current.click()
    }
  }

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !page?.id) return

    setMsg('Subiendo archivo…')
    const url = await upload(file, 'informes')
    if (!url) {
      setMsg('No se pudo subir el archivo. Comprueba que el bucket «informes» existe en Supabase Storage o usa «Pegar URL».')
      return
    }

    const baseName = file.name.replace(/\.[^.]+$/, '')
    const newId = `temp-${Date.now()}`
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        informes_page_id: page.id,
        item_order: prev.length,
        titulo: baseName || 'Nuevo informe',
        descripcion: '',
        archivo_url: url,
        archivo_nombre: file.name,
        archivo_tipo: detectFileType(file.name),
        fecha: new Date().toISOString().slice(0, 10),
      },
    ])
    setMsg('Archivo subido. Revisa el título y pulsa «Guardar informes».')
    requestAnimationFrame(() => {
      document.getElementById(`informe-${newId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const removeItem = async (id: string) => {
    if (!isTempId(id)) {
      setSaving(id)
      setMsg('')
      const { error } = await supabase.from('informes_items').delete().eq('id', id)
      setSaving(null)
      if (error) {
        setMsg(error.message)
        return
      }
    }
    setItems((prev) => prev.filter((x) => x.id !== id))
    setMsg('Informe eliminado')
  }

  const updateItem = (id: string, patch: Partial<InformeItem>) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  const saveItems = async () => {
    if (!page?.id) return
    setSaving('items')
    setMsg('')
    let list = [...items]
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (isTempId(item.id)) {
        const { data: inserted, error: errInsert } = await supabase
          .from('informes_items')
          .insert({
            informes_page_id: page.id,
            item_order: item.item_order,
            titulo: item.titulo || 'Sin título',
            descripcion: item.descripcion || '',
            archivo_url: item.archivo_url || '',
            archivo_nombre: item.archivo_nombre || '',
            archivo_tipo: item.archivo_tipo || 'pdf',
            fecha: item.fecha || null,
          })
          .select()
          .single()
        if (errInsert) {
          setSaving(null)
          setMsg(errInsert.message)
          return
        }
        list = list.map((x) => (x.id === item.id ? (inserted as InformeItem) : x))
      }
    }
    list.forEach((item, i) => { item.item_order = i })
    for (const item of list) {
      const { error } = await supabase
        .from('informes_items')
        .update({
          titulo: item.titulo,
          descripcion: item.descripcion,
          archivo_url: item.archivo_url,
          archivo_nombre: item.archivo_nombre,
          archivo_tipo: item.archivo_tipo,
          fecha: item.fecha || null,
          item_order: item.item_order,
        })
        .eq('id', item.id)
      if (error) {
        setSaving(null)
        setMsg(error.message)
        return
      }
    }
    setItems(list)
    setSaving(null)
    setMsg('Informes guardados')
  }

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-500">Cargando…</div>

  if (!page) {
    return (
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Informes</h1>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Falta configurar la página en la base de datos.</p>
          <p className="mt-2 text-sm">
            Ejecuta la migración <code className="bg-white/80 px-1 rounded">013_informes.sql</code> en Supabase y recarga esta pantalla.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Informes</h1>
      <p className="text-sm text-slate-500">
        Gestiona los documentos PDF y Word que se muestran en la página pública de Informes. Los archivos se alojan en Supabase Storage.
      </p>
      {msg && (
        <p className={`text-sm ${/guardad|añadid|eliminad|Completa/.test(msg) ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>
      )}

      {page && (
        <SectionCard title="Cabecera de la página">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              saveCabecera()
            }}
            className="space-y-4"
          >
            <Input label="Título" value={page.titulo} onChange={(v) => setPage({ ...page, titulo: v })} />
            <Textarea label="Subtítulo" value={page.subtitulo} onChange={(v) => setPage({ ...page, subtitulo: v })} rows={2} />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">
              {saving === 'cabecera' ? 'Guardando…' : 'Guardar cabecera'}
            </button>
          </form>
        </SectionCard>
      )}

      <SectionCard title="Listado de informes">
        <input
          ref={addFileRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleAddFile}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
        />
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} id={`informe-${item.id}`} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Informe {index + 1}</span>
                <button type="button" onClick={() => removeItem(item.id)} disabled={!!saving} className="text-sm text-red-600 hover:underline disabled:opacity-50">
                  Eliminar
                </button>
              </div>
              <Input label="Título" value={item.titulo} onChange={(v) => updateItem(item.id, { titulo: v })} />
              <Textarea label="Descripción (opcional)" value={item.descripcion} onChange={(v) => updateItem(item.id, { descripcion: v })} rows={2} />
              <Input label="Fecha" type="date" value={item.fecha ?? ''} onChange={(v) => updateItem(item.id, { fecha: v || null })} />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de archivo</label>
                <select
                  value={item.archivo_tipo}
                  onChange={(e) => updateItem(item.id, { archivo_tipo: e.target.value as 'pdf' | 'docx' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="pdf">PDF</option>
                  <option value="docx">Word (DOCX)</option>
                </select>
              </div>
              <FileField
                label="Archivo (subir o pegar URL)"
                value={item.archivo_url}
                onChange={(v) => updateItem(item.id, { archivo_url: v })}
                onFileNameChange={(name) => updateItem(item.id, { archivo_nombre: name })}
                onFileTypeChange={(type) => updateItem(item.id, { archivo_tipo: type })}
                folder="informes"
              />
              <Input
                label="Nombre para descarga (opcional)"
                value={item.archivo_nombre}
                onChange={(v) => updateItem(item.id, { archivo_nombre: v })}
                placeholder="Ej: Informe-anual-2025.pdf"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={openAddFilePicker}
            disabled={uploading || !!saving}
            className="w-full rounded-lg border-2 border-dashed border-[var(--color-btn)]/50 py-4 text-[var(--color-btn)] hover:bg-[var(--color-btn)]/5 disabled:opacity-50"
          >
            {uploading ? 'Subiendo archivo…' : '+ Añadir informe (subir PDF o Word)'}
          </button>
          <button
            type="button"
            onClick={addItem}
            disabled={uploading || !!saving}
            className="w-full py-2.5 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 hover:border-[var(--color-btn)] hover:text-[var(--color-btn)] disabled:opacity-50"
          >
            Añadir informe vacío (sin archivo)
          </button>
        </div>
        <button
          type="button"
          onClick={saveItems}
          disabled={!!saving}
          className="mt-6 px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
        >
          {saving === 'items' ? 'Guardando…' : 'Guardar informes'}
        </button>
      </SectionCard>
    </div>
  )
}
