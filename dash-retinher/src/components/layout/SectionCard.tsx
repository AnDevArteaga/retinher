import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

type Props = {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SectionCard({ title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-4 text-left font-semibold text-[var(--color-title)] transition-colors hover:bg-slate-50 sm:px-5"
      >
        {title}
        {open ? <ChevronDown className="h-5 w-5 text-[var(--color-text-muted)]" /> : <ChevronRight className="h-5 w-5 text-[var(--color-text-muted)]" />}
      </button>
      {open && <div className="border-t border-slate-100 px-4 pb-5 pt-0 sm:px-5">{children}</div>}
    </div>
  )
}
