import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SectionCard } from '../components/layout/SectionCard'
import { ImageField } from '../components/fields/ImageField'
import { Plus, Trash2 } from 'lucide-react'

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

/** Lista de strings: cada ítem editable (textarea) + Quitar; input + Añadir */
function ListOfStrings({
  label,
  items,
  onChange,
  placeholder = 'Escriba y pulse Añadir',
  multiline = true,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  multiline?: boolean
}) {
  const [input, setInput] = useState('')
  const add = () => {
    const t = input.trim()
    if (!t) return
    onChange([...items, t])
    setInput('')
  }
  const update = (index: number, value: string) => {
    onChange(items.map((it, i) => (i === index ? value : it)))
  }
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index))
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <ul className="space-y-2 mb-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 overflow-hidden">
            {multiline ? (
              <textarea
                value={item}
                onChange={(e) => update(i, e.target.value)}
                rows={2}
                className="flex-1 min-w-0 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-[var(--color-btn)]/20 rounded resize-y"
              />
            ) : (
              <input
                type="text"
                value={item}
                onChange={(e) => update(i, e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 text-sm border-0 bg-transparent focus:ring-2 focus:ring-[var(--color-btn)]/20 rounded"
              />
            )}
            <button type="button" onClick={() => remove(i)} className="p-2 text-slate-400 hover:text-red-600 rounded shrink-0" aria-label="Quitar">
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-btn)]/30 focus:border-[var(--color-btn)]"
        />
        <button type="button" onClick={add} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:opacity-90 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>
    </div>
  )
}

/** Lista de pares valor — valor (ambos son valores) */
type ValorItem = { left: string; right: string }
function ListOfValores({ label, items, onChange }: { label: string; items: ValorItem[]; onChange: (items: ValorItem[]) => void }) {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const add = () => {
    if (!left.trim() && !right.trim()) return
    onChange([...items, { left: left.trim(), right: right.trim() }])
    setLeft('')
    setRight('')
  }
  const update = (index: number, field: 'left' | 'right', value: string) => {
    onChange(items.map((it, i) => (i === index ? { ...it, [field]: value } : it)))
  }
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index))
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <ul className="space-y-2 mb-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2">
            <input value={item.left} onChange={(e) => update(i, 'left', e.target.value)} placeholder="Valor" className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-slate-200 rounded" />
            <span className="text-slate-400 shrink-0">—</span>
            <input value={item.right} onChange={(e) => update(i, 'right', e.target.value)} placeholder="Valor" className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-slate-200 rounded" />
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-slate-400 hover:text-red-600 rounded shrink-0" aria-label="Quitar">
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 items-end">
        <input type="text" value={left} onChange={(e) => setLeft(e.target.value)} placeholder="Valor" className="w-40 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
        <span className="text-slate-400">—</span>
        <input type="text" value={right} onChange={(e) => setRight(e.target.value)} placeholder="Valor" className="w-40 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
        <button type="button" onClick={add} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:opacity-90 text-sm">
          <Plus className="w-4 h-4" /> Añadir valor
        </button>
      </div>
    </div>
  )
}

/** Grupos de servicio: cada grupo tiene título e ítems (strings). Añadir grupo, añadir ítem por grupo. */
type ServiceGroup = { id: string; title: string; items: string[] }
function ListOfServiceGroups({ label, groups, onChange }: { label: string; groups: ServiceGroup[]; onChange: (groups: ServiceGroup[]) => void }) {
  const addGroup = () => {
    const id = `grupo-${Date.now()}`
    onChange([...groups, { id, title: 'Nuevo grupo', items: [] }])
  }
  const updateGroup = (index: number, patch: Partial<ServiceGroup>) => {
    onChange(groups.map((g, i) => (i === index ? { ...g, ...patch } : g)))
  }
  const updateGroupItems = (index: number, items: string[]) => {
    updateGroup(index, { items })
  }
  const removeGroup = (index: number) => onChange(groups.filter((_, i) => i !== index))
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="space-y-4">
        {groups.map((group, gIdx) => (
          <div key={group.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                value={group.title}
                onChange={(e) => updateGroup(gIdx, { title: e.target.value })}
                placeholder="Título del grupo (ej. Consultas externas en)"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-medium"
              />
              <button type="button" onClick={() => removeGroup(gIdx)} className="p-2 text-slate-400 hover:text-red-600 rounded" aria-label="Quitar grupo">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <ListOfStrings
              label="Ítems del grupo"
              items={group.items}
              onChange={(items) => updateGroupItems(gIdx, items)}
              placeholder="Añadir ítem (ej. Oftalmología general.)"
              multiline={false}
            />
          </div>
        ))}
        <button type="button" onClick={addGroup} className="w-full py-2.5 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-[var(--color-btn)] hover:text-[var(--color-btn)] inline-flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Añadir grupo de servicios
        </button>
      </div>
    </div>
  )
}

export function NosotrosPage() {
  const [nosotros, setNosotros] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    supabase.from('nosotros').select('*').maybeSingle().then(({ data }) => {
      setNosotros(data ?? null)
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
    else { setMsg('Guardado'); setNosotros(updated as Record<string, unknown>) }
  }

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-500">Cargando…</div>

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Nosotros</h1>
      <p className="text-sm text-slate-500">Contenido de la página Nosotros: hero, intro, misión, visión, valores, políticas y grupos de servicios.</p>
      {msg && <p className={`text-sm ${msg === 'Guardado' ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      {nosotros ? (
        <SectionCard title="Nosotros (hero, intro, misión, visión, valores, políticas, servicios)">
          <form onSubmit={(e) => { e.preventDefault(); save('nosotros', nosotros.id as string, nosotros); }} className="space-y-6">
            <ImageField label="Imagen hero" value={String(nosotros.hero_image || '')} onChange={(v) => setNosotros({ ...nosotros, hero_image: v })} folder="nosotros" />
            <Input label="Título" value={String(nosotros.title || '')} onChange={(v) => setNosotros({ ...nosotros, title: v })} />
            <Textarea label="Intro (puede incluir HTML)" value={String(nosotros.intro || '')} onChange={(v) => setNosotros({ ...nosotros, intro: v })} rows={4} />
            <Textarea label="Misión" value={String(nosotros.mision || '')} onChange={(v) => setNosotros({ ...nosotros, mision: v })} rows={3} />
            <Textarea label="Visión" value={String(nosotros.vision || '')} onChange={(v) => setNosotros({ ...nosotros, vision: v })} rows={3} />

            <ListOfValores
              label="Valores (valor — valor)"
              items={Array.isArray(nosotros.valores) ? (nosotros.valores as ValorItem[]).map((v) => (typeof v === 'object' && v !== null && 'left' in v && 'right' in v ? { left: String((v as ValorItem).left), right: String((v as ValorItem).right) } : { left: '', right: '' })) : []}
              onChange={(valores) => setNosotros({ ...nosotros, valores })}
            />

            <ListOfStrings
              label="Política de calidad (cada párrafo es un ítem)"
              items={Array.isArray(nosotros.politica_calidad) ? (nosotros.politica_calidad as string[]).map(String) : []}
              onChange={(politica_calidad) => setNosotros({ ...nosotros, politica_calidad })}
              placeholder="Escriba un párrafo y pulse Añadir"
            />

            <ListOfStrings
              label="Política de seguridad (cada párrafo es un ítem)"
              items={Array.isArray(nosotros.politica_seguridad) ? (nosotros.politica_seguridad as string[]).map(String) : []}
              onChange={(politica_seguridad) => setNosotros({ ...nosotros, politica_seguridad })}
              placeholder="Escriba un párrafo y pulse Añadir"
            />

            <ListOfServiceGroups
              label="Grupos de servicios (cada grupo tiene título e ítems)"
              groups={Array.isArray(nosotros.service_groups)
                ? (nosotros.service_groups as ServiceGroup[]).map((g) => ({
                    id: typeof g.id === 'string' ? g.id : String(g.id ?? ''),
                    title: typeof g.title === 'string' ? g.title : String(g.title ?? ''),
                    items: Array.isArray(g.items) ? g.items.map(String) : [],
                  }))
                : []}
              onChange={(service_groups) => setNosotros({ ...nosotros, service_groups })}
            />

            <button type="submit" disabled={!!saving} className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50">
              {saving === 'nosotros' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos.</p>
      )}
    </div>
  )
}
