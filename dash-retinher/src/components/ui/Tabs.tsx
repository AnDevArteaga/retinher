import { useState } from 'react'

type TabItem = {
  id: string
  label: string
  content: React.ReactNode
}

export function Tabs({
  tabs,
  defaultTab,
}: {
  tabs: TabItem[]
  defaultTab?: string
}) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? '')
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${
              activeId === t.id
                ? 'bg-[var(--color-btn)] text-[var(--color-btn-text)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:bg-white hover:text-[var(--color-text)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {active && <div className="min-h-0">{active.content}</div>}
    </div>
  )
}
