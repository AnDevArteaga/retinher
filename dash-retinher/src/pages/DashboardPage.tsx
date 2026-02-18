import { LayoutDashboard, ExternalLink } from 'lucide-react'

export function DashboardPage() {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://retinher.example.com'

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
        <LayoutDashboard className="w-7 h-7" />
        Panel
      </h1>
      <p className="mt-2 text-slate-600">
        Elige una sección en el menú para editar el contenido de la página web.
      </p>
      <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
        <h2 className="font-medium text-slate-800">Sitio público</h2>
        <a
          href={siteUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-sky-600 hover:underline"
        >
          {siteUrl}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
