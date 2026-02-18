import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useUploadImage } from '../../hooks/useUploadImage'

type Row = {
  id: string
  nombre: string
  titulo: string
  descripcion: string
  imagen: string
}

export function DoctorPage() {
  const [row, setRow] = useState<Row | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const { upload, uploading, error: uploadError } = useUploadImage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('doctor').select('*').maybeSingle().then(({ data, error }) => {
      if (error) setMessage(error.message)
      else setRow(data ?? null)
      setLoading(false)
    })
  }, [])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !row) return
    const url = await upload(file, 'doctor')
    if (url) setRow((r) => (r ? { ...r, imagen: url } : null))
    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!row) return
    setSaving(true)
    setMessage('')
    const { data: updated, error } = await supabase.from('doctor').update({
      nombre: row.nombre,
      titulo: row.titulo,
      descripcion: row.descripcion,
      imagen: row.imagen,
    }).eq('id', row.id).select().maybeSingle()
    setSaving(false)
    if (error) setMessage(error.message)
    else if (updated == null) setMessage('No se guardó: sin permisos de administrador. Añade tu user_id a la tabla admins en Supabase.')
    else setMessage('Guardado.')
  }

  if (loading) return <p className="text-slate-600">Cargando…</p>
  if (!row) return <p className="text-slate-600">No hay datos.</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Doctor</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input
            value={row.nombre}
            onChange={(e) => setRow((r) => (r ? { ...r, nombre: e.target.value } : null))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
          <input
            value={row.titulo}
            onChange={(e) => setRow((r) => (r ? { ...r, titulo: e.target.value } : null))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
          <textarea
            value={row.descripcion}
            onChange={(e) => setRow((r) => (r ? { ...r, descripcion: e.target.value } : null))}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Imagen</label>
          <input type="hidden" value={row.imagen} readOnly />
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              {uploading ? 'Subiendo…' : 'Subir imagen'}
            </button>
            {row.imagen && (
              <a href={row.imagen} target="_blank" rel="noreferrer" className="text-sm text-sky-600 truncate max-w-[200px]">
                Ver actual
              </a>
            )}
          </div>
          {uploadError && <p className="text-sm text-red-600 mt-1">{uploadError}</p>}
        </div>
        {message && <p className="text-sm text-slate-600">{message}</p>}
        <button type="submit" disabled={saving} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50">
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}
