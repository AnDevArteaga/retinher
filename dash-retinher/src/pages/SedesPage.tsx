import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SectionCard } from '../components/layout/SectionCard'
import { Tabs } from '../components/ui/Tabs'

type SedeItem = {
  id: string
  sedes_id: string
  nombre: string
  direccion: string
  barrio: string
  ciudad: string
  horario: string
  mapa_embed_url: string
}

function Input({ label, value, onChange, ...props }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)]" {...props} />
    </div>
  )
}

function Textarea({ label, value, onChange, ...props }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)] min-h-[120px]" {...props} />
    </div>
  )
}

const HORARIO_EJEMPLO = `Lunes a Viernes:
07:30 am - 12:00 pm
01:00 pm - 05:00 pm

Sábados:
08:00 am - 12:00 pm`

const SEDE_DEFAULTS: Omit<SedeItem, 'id' | 'sedes_id'> = {
  nombre: 'Nueva sede',
  direccion: '',
  barrio: '',
  ciudad: '',
  horario: HORARIO_EJEMPLO,
  mapa_embed_url: 'https://maps.google.com/maps?q=Colombia&output=embed',
}

export function SedesPage() {
  const [sedes, setSedes] = useState<{ id: string; titulo: string; subtitulo: string } | null>(null)
  const [sedeList, setSedeList] = useState<SedeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('sedes').select('*').maybeSingle(),
      supabase.from('sede_principal').select('*').order('nombre'),
    ]).then(([s, sp]) => {
      setSedes(s.data ?? null)
      setSedeList((sp.data ?? []) as SedeItem[])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const isTempId = (id: string) => id.startsWith('temp-')

  const save = async (table: string, id: string, data: object) => {
    setSaving(id)
    setMsg('')
    if (table === 'sede_principal' && isTempId(id)) {
      const sede = data as SedeItem
      const { data: inserted, error } = await supabase
        .from('sede_principal')
        .insert({
          sedes_id: sede.sedes_id,
          nombre: sede.nombre,
          direccion: sede.direccion,
          barrio: sede.barrio,
          ciudad: sede.ciudad,
          horario: sede.horario,
          mapa_embed_url: sede.mapa_embed_url,
        })
        .select()
        .single()
      setSaving(null)
      if (error) setMsg(error.message)
      else if (inserted) {
        setMsg('Guardado')
        setSedeList((prev) => prev.map((s) => (s.id === id ? (inserted as SedeItem) : s)))
      } else setMsg('No se pudo crear la sede.')
      return
    }
    const { data: updated, error } = await supabase.from(table).update(data).eq('id', id).select().maybeSingle()
    setSaving(null)
    if (error) setMsg(error.message)
    else if (updated == null) setMsg('No se guardó: sin permisos de administrador.')
    else {
      setMsg('Guardado')
      if (table === 'sedes') setSedes(updated as { id: string; titulo: string; subtitulo: string })
      if (table === 'sede_principal') setSedeList((prev) => prev.map((s) => (s.id === id ? (updated as SedeItem) : s)))
    }
  }

  const addSede = () => {
    if (!sedes?.id) return
    setSedeList((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        sedes_id: sedes.id,
        ...SEDE_DEFAULTS,
      },
    ])
    setMsg('Sede añadida. Rellena y guarda.')
  }

  const updateSede = (index: number, patch: Partial<SedeItem>) => {
    setSedeList((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  const removeSede = async (id: string) => {
    if (sedeList.length <= 1) { setMsg('Debe quedar al menos una sede.'); return }
    if (!isTempId(id)) {
      setSaving(id)
      setMsg('')
      const { error } = await supabase.from('sede_principal').delete().eq('id', id)
      setSaving(null)
      if (error) {
        setMsg(error.message)
        return
      }
    }
    setSedeList((prev) => prev.filter((s) => s.id !== id))
    setMsg('Sede eliminada')
  }

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-500">Cargando…</div>

  const tabs = [
    {
      id: 'titulo',
      label: 'Título de página',
      content: sedes ? (
        <SectionCard title="Título y subtítulo de la página Sedes">
          <form onSubmit={(e) => { e.preventDefault(); save('sedes', sedes.id, sedes); }} className="space-y-4">
            <Input label="Título" value={sedes.titulo} onChange={(v) => setSedes({ ...sedes, titulo: v })} />
            <Input label="Subtítulo" value={sedes.subtitulo} onChange={(v) => setSedes({ ...sedes, subtitulo: v })} />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">Guardar</button>
          </form>
        </SectionCard>
      ) : <p className="text-slate-500 py-4">Sin datos.</p>,
    },
    {
      id: 'ubicaciones',
      label: 'Ubicaciones (sedes)',
      content: (
        <SectionCard title="Ubicaciones (sedes)">
          <div className="space-y-6">
            {sedeList.map((sede, index) => (
              <div key={sede.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{sede.nombre || `Sede ${index + 1}`}</h3>
                  {sedeList.length > 1 && (
                    <button type="button" onClick={() => removeSede(sede.id)} disabled={!!saving} className="text-sm text-red-600 hover:underline disabled:opacity-50">Eliminar</button>
                  )}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); save('sede_principal', sede.id, sedeList[index]); }} className="space-y-4">
                  <Input label="Nombre" value={sede.nombre} onChange={(v) => updateSede(index, { nombre: v })} />
                  <Input label="Dirección" value={sede.direccion} onChange={(v) => updateSede(index, { direccion: v })} />
                  <Input label="Barrio" value={sede.barrio} onChange={(v) => updateSede(index, { barrio: v })} />
                  <Input label="Ciudad" value={sede.ciudad} onChange={(v) => updateSede(index, { ciudad: v })} />
                  <Textarea label="Horario (varias líneas)" value={sede.horario} onChange={(v) => updateSede(index, { horario: v })} placeholder={HORARIO_EJEMPLO} rows={8} />
                  <Input label="URL iframe del mapa (Google Maps embed)" value={sede.mapa_embed_url} onChange={(v) => updateSede(index, { mapa_embed_url: v })} />
                  <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">{saving === sede.id ? 'Guardando…' : 'Guardar esta sede'}</button>
                </form>
              </div>
            ))}
            <button type="button" onClick={addSede} disabled={!sedes?.id} className="w-full rounded-lg border-2 border-dashed border-[var(--color-btn)]/50 py-4 text-[var(--color-btn)] hover:bg-[var(--color-btn)]/5 disabled:opacity-50">+ Añadir otra sede</button>
          </div>
        </SectionCard>
      ),
    },
  ]

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Sedes (página Sedes)</h1>
      <p className="text-sm text-slate-500">Contenido de la página Sedes: título y ubicaciones. El pie de página y WhatsApp se editan en <strong>Footer</strong> (menú lateral).</p>
      {msg && <p className={`text-sm ${/Guardado|Sede añadida|Sede eliminada|Rellena y guarda/.test(msg) ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <Tabs tabs={tabs} defaultTab="titulo" />
    </div>
  )
}
