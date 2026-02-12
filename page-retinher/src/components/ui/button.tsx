export const Button = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <button
      className={`group relative w-sm inline-flex h-16 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:border-blue-4005 ${className} hover:scale-105`}
    >
      <span>{children}</span>
    </button>
  )
}
