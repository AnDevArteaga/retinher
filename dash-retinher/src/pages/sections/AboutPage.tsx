import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Row = { id: string; title: string; intro: string; purpose: string; cta_pdf: string }

export function AboutPage() {
  const [row, setRow] = useState<Row | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('about').select('*').maybeSingle().then(({ data, error }) => {
      if (error) setMessage(error.message)
      else setRow(data ?? null)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!row) return
    setSaving(true)
    setMessage('')
    const { data: updated, error } = await supabase.from('about').update(row).eq('id', row.id).select().maybeSingle()
    setSaving(false)
    if (error) setMessage(error.message)
    else if (updated == null) setMessage('No se guardó: sin permisos de administrador. Añade tu user_id a la tabla admins en Supabase.')
    else setMessage('Guardado.')
  }

  if (loading) return <p className="text-slate-600">Cargando…</p>
  if (!row) return <p className="text-slate-600">No hay datos.</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">About</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        {(['title', 'intro', 'purpose', 'cta_pdf'] as const).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{key}</label>
            <input
              value={row[key]}
              onChange={(e) => setRow((r) => (r ? { ...r, [key]: e.target.value } : null))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        ))}
        {message && <p className="text-sm text-slate-600">{message}</p>}
        <button type="submit" disabled={saving} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50">
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}
