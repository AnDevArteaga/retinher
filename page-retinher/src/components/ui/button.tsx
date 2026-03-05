export const Button = ({
  children,
  className = '',
  onClick,
  id,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  id?: string
}) => {
  return (
    <button
      className={`group relative w-sm inline-flex h-16 items-center justify-center overflow-hidden rounded-full border bg-white/5 text-sm font-bold uppercase transition-all ${className} hover:scale-105 ${id === '94d1eceb-f884-48bc-b5e7-a5d52ce5dee6' || id === 'ea1515ba-5110-4285-8f14-d85e830ecac1' ? 'text-slate-600 border-slate-600/20' : 'text-white  border-white/20'}`}
      onClick={onClick}
      id={id}
    >
      <span>{children}</span>
    </button>
  )
}
