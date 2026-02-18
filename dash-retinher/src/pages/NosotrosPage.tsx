import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SectionCard } from '../components/layout/SectionCard'
import { ImageField } from '../components/fields/ImageField'
import { Tabs } from '../components/ui/Tabs'

function Input({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)]" {...rest} />
    </div>
  )
}

function Textarea({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)]" {...rest} />
    </div>
  )
}

export function NosotrosPage() {
  const [nosotros, setNosotros] = useState<Record<string, unknown> | null>(null)
  const [ecosistema, setEcosistema] = useState<Record<string, unknown> | null>(null)
  const [sellosRec, setSellosRec] = useState<Record<string, unknown> | null>(null)
  const [sellosRecItems, setSellosRecItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('nosotros').select('*').maybeSingle(),
      supabase.from('ecosistema_impacto').select('*').maybeSingle(),
      supabase.from('sellos_reconocimientos').select('*').maybeSingle(),
      supabase.from('sellos_reconocimientos_items').select('*').order('orden'),
    ]).then(([n, e, s, si]) => {
      setNosotros(n.data ?? null)
      setEcosistema(e.data ?? null)
      setSellosRec(s.data ?? null)
      setSellosRecItems(si.data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const save = async (table: string, id: string, data: object) => {
    setSaving(table)
    setMsg('')
    const { data: updated, error } = await supabase.from(table).update(data).eq('id', id).select().maybeSingle()
    setSaving(null)
    if (error) setMsg(error.message)
    else if (updated == null) setMsg('No se guardó: el usuario no tiene permisos de administrador. Añade tu user_id a la tabla admins en Supabase.')
    else { setMsg('Guardado'); load() }
  }

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-500">Cargando…</div>

  const tabs = [
    {
      id: 'nosotros',
      label: 'Nosotros',
      content: nosotros ? (
        <SectionCard title="Nosotros (hero, intro, misión, visión)">
          <form onSubmit={(e) => { e.preventDefault(); save('nosotros', nosotros.id as string, nosotros); }} className="space-y-4">
            <ImageField label="Hero image" value={String(nosotros.hero_image || '')} onChange={(v) => setNosotros({ ...nosotros, hero_image: v })} folder="nosotros" />
            <Input label="Título" value={String(nosotros.title || '')} onChange={(v) => setNosotros({ ...nosotros, title: v })} />
            <Textarea label="Intro (HTML)" value={String(nosotros.intro || '')} onChange={(v) => setNosotros({ ...nosotros, intro: v })} rows={4} />
            <Textarea label="Misión" value={String(nosotros.mision || '')} onChange={(v) => setNosotros({ ...nosotros, mision: v })} rows={3} />
            <Textarea label="Visión" value={String(nosotros.vision || '')} onChange={(v) => setNosotros({ ...nosotros, vision: v })} rows={3} />
            <Textarea label="Valores (JSON)" value={JSON.stringify(nosotros.valores ?? [], null, 2)} onChange={(v) => { try { setNosotros({ ...nosotros, valores: typeof v === 'string' ? JSON.parse(v || '[]') : nosotros.valores }); } catch {} }} rows={6} />
            <Textarea label="Política calidad (JSON)" value={JSON.stringify(nosotros.politica_calidad ?? [], null, 2)} onChange={(v) => { try { setNosotros({ ...nosotros, politica_calidad: typeof v === 'string' ? JSON.parse(v || '[]') : nosotros.politica_calidad }); } catch {} }} rows={4} />
            <Textarea label="Política seguridad (JSON)" value={JSON.stringify(nosotros.politica_seguridad ?? [], null, 2)} onChange={(v) => { try { setNosotros({ ...nosotros, politica_seguridad: typeof v === 'string' ? JSON.parse(v || '[]') : nosotros.politica_seguridad }); } catch {} }} rows={4} />
            <Textarea label="Service groups (JSON)" value={JSON.stringify(nosotros.service_groups ?? [], null, 2)} onChange={(v) => { try { setNosotros({ ...nosotros, service_groups: typeof v === 'string' ? JSON.parse(v || '[]') : nosotros.service_groups }); } catch {} }} rows={12} />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">Guardar</button>
          </form>
        </SectionCard>
      ) : <p className="text-slate-500 py-4">Sin datos.</p>,
    },
    {
      id: 'ecosistema',
      label: 'Ecosistema impacto',
      content: ecosistema ? (
        <SectionCard title="Ecosistema impacto">
          <form onSubmit={(e) => { e.preventDefault(); save('ecosistema_impacto', ecosistema.id as string, ecosistema); }} className="space-y-4">
            <Input label="Título sección" value={String(ecosistema.titulo_seccion || '')} onChange={(v) => setEcosistema({ ...ecosistema, titulo_seccion: v })} />
            <Input label="Subtítulo sección" value={String(ecosistema.subtitulo_seccion || '')} onChange={(v) => setEcosistema({ ...ecosistema, subtitulo_seccion: v })} />
            <Textarea label="Bloques (JSON)" value={JSON.stringify(ecosistema.bloques ?? [], null, 2)} onChange={(v) => { try { setEcosistema({ ...ecosistema, bloques: typeof v === 'string' ? JSON.parse(v || '[]') : ecosistema.bloques }); } catch {} }} rows={20} />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">Guardar</button>
          </form>
        </SectionCard>
      ) : <p className="text-slate-500 py-4">Sin datos.</p>,
    },
    {
      id: 'sellos',
      label: 'Sellos reconocimientos',
      content: sellosRec ? (
        <SectionCard title="Sellos reconocimientos">
          <form onSubmit={(e) => { e.preventDefault(); save('sellos_reconocimientos', sellosRec.id as string, sellosRec); }} className="space-y-4">
            <Input label="Título" value={String(sellosRec.titulo || '')} onChange={(v) => setSellosRec({ ...sellosRec, titulo: v })} />
            <Input label="Subtítulo" value={String(sellosRec.subtitulo || '')} onChange={(v) => setSellosRec({ ...sellosRec, subtitulo: v })} />
            <Input label="CTA" value={String(sellosRec.cta || '')} onChange={(v) => setSellosRec({ ...sellosRec, cta: v })} />
            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">Guardar</button>
          </form>
          <div className="mt-4 space-y-4">
            {sellosRecItems.map((item: Record<string, unknown>) => (
              <div key={String(item.id)} className="p-4 border rounded-lg space-y-3">
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded overflow-hidden bg-slate-100 shrink-0">
                    <img src={String(item.imagen || '')} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <Input label="Título" value={String(item.titulo || '')} onChange={(v) => setSellosRecItems(prev => prev.map(x => x.id === item.id ? { ...x, titulo: v } : x))} />
                    <Input label="Subtítulo" value={String(item.subtitulo || '')} onChange={(v) => setSellosRecItems(prev => prev.map(x => x.id === item.id ? { ...x, subtitulo: v } : x))} />
                    <Textarea label="Descripción" value={String(item.descripcion || '')} onChange={(v) => setSellosRecItems(prev => prev.map(x => x.id === item.id ? { ...x, descripcion: v } : x))} rows={2} />
                    <Input label="Logros" value={String(item.logros || '')} onChange={(v) => setSellosRecItems(prev => prev.map(x => x.id === item.id ? { ...x, logros: v || null } : x))} />
                    <ImageField label="Imagen" value={String(item.imagen || '')} onChange={(v) => setSellosRecItems(prev => prev.map(x => x.id === item.id ? { ...x, imagen: v } : x))} folder="sellos" />
                  </div>
                </div>
                <button type="button" onClick={() => save('sellos_reconocimientos_items', item.id as string, item)} disabled={!!saving} className="px-3 py-1.5 text-sm bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded hover:bg-[var(--color-btn-hover)] disabled:opacity-50">Guardar</button>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : <p className="text-slate-500 py-4">Sin datos.</p>,
    },
  ]

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Nosotros (página Nosotros)</h1>
      <p className="text-sm text-slate-500">Contenido que se muestra solo en la página Nosotros de la web.</p>
      {msg && <p className={`text-sm ${msg === 'Guardado' ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <Tabs tabs={tabs} defaultTab="nosotros" />
    </div>
  )
}
