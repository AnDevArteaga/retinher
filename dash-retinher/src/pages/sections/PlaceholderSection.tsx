type Props = { title: string; table?: string }

export function PlaceholderSection({ title, table }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">{title}</h1>
      <p className="text-slate-600">
        Formulario de esta sección. Los datos se editan en Supabase
        {table && ` (tabla: ${table}).`}
      </p>
    </div>
  )
}
