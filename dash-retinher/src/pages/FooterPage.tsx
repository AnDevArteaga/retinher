import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SectionCard } from '../components/layout/SectionCard'

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

type FooterRow = {
  id: string
  sede1: string
  sede2: string
  pbx: string
  email: string
  city: string
  copyright: string
  privacy: string
  solo_llamadas?: string
  solo_mensaje?: string
  email_gestion?: string
  email_general?: string
}

type WhatsAppRow = { id: string; numero: string; mensaje: string }

export function FooterPage() {
  const [footer, setFooter] = useState<FooterRow | null>(null)
  const [whatsapp, setWhatsapp] = useState<WhatsAppRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('footer').select('*').maybeSingle(),
      supabase.from('whatsapp').select('*').maybeSingle(),
    ]).then(([f, w]) => {
      setFooter((f.data ?? null) as FooterRow | null)
      setWhatsapp(w.data ?? null)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (table: string, id: string, data: object) => {
    setSaving(id)
    setMsg('')
    const { data: updated, error } = await supabase.from(table).update(data).eq('id', id).select().maybeSingle()
    setSaving(null)
    if (error) setMsg(error.message)
    else {
      setMsg('Guardado')
      if (table === 'footer' && updated) setFooter(updated as FooterRow)
      if (table === 'whatsapp' && updated) setWhatsapp(updated as WhatsAppRow)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-24 text-slate-500">Cargando…</div>

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Footer y contacto</h1>
      <p className="text-sm text-slate-500">Datos globales del pie de página y WhatsApp (se muestran en todas las páginas).</p>
      {msg && (
        <p className={`text-sm ${msg === 'Guardado' ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>
      )}

      {footer ? (
        <SectionCard title="Footer (direcciones, contacto, copyright)">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('footer', footer.id, footer)
            }}
            className="space-y-4"
          >
            <Input label="Sede 1 (dirección)" value={footer.sede1} onChange={(v) => setFooter({ ...footer, sede1: v })} />
            <Input label="Sede 2 (dirección)" value={footer.sede2} onChange={(v) => setFooter({ ...footer, sede2: v })} />
            <Input label="PBX" value={footer.pbx} onChange={(v) => setFooter({ ...footer, pbx: v })} />
            <Input label="Email" value={footer.email} onChange={(v) => setFooter({ ...footer, email: v })} />
            <Input label="Ciudad" value={footer.city} onChange={(v) => setFooter({ ...footer, city: v })} />
            <Input label="Copyright" value={footer.copyright} onChange={(v) => setFooter({ ...footer, copyright: v })} />
            <Input label="Texto enlace Privacidad" value={footer.privacy} onChange={(v) => setFooter({ ...footer, privacy: v })} />
            <button
              type="submit"
              disabled={!!saving}
              className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
            >
              {saving === footer.id ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos de footer.</p>
      )}

      {whatsapp ? (
        <SectionCard title="WhatsApp (botón flotante)">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save('whatsapp', whatsapp.id, whatsapp)
            }}
            className="space-y-4"
          >
            <Input label="Número (código país, sin +)" value={whatsapp.numero} onChange={(v) => setWhatsapp({ ...whatsapp, numero: v })} />
            <Input label="Mensaje por defecto" value={whatsapp.mensaje} onChange={(v) => setWhatsapp({ ...whatsapp, mensaje: v })} />
            <button
              type="submit"
              disabled={!!saving}
              className="px-4 py-2 bg-[var(--color-btn)] text-[var(--color-btn-text)] rounded-lg hover:bg-[var(--color-btn-hover)] disabled:opacity-50"
            >
              {saving === whatsapp.id ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </SectionCard>
      ) : (
        <p className="text-slate-500 py-4">Sin datos de WhatsApp.</p>
      )}
    </div>
  )
}
