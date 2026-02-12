import { mockData } from '../data/MockData'

const {
  heroImage,
  title,
  intro,
  mision,
  vision,
  valores,
  politicaCalidad,
  politicaSeguridad,
  serviceGroups,
} = mockData.nosotros

export function NosotrosPage() {
  return (
    <div className="nosotros-page min-h-screen bg-white">
      {/* 1. HERO */}
      <header className="relative h-[55vh] w-full overflow-hidden bg-black">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 flex h-full items-end px-10 pb-16 md:px-24">
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white leading-none">
            {title}
            <span className="text-[var(--color-btn)]">.</span>
          </h1>
        </div>
      </header>

      {/* 2. INTRO + MISIÓN Y VISIÓN */}
      <section className="mx-auto max-w-7xl px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div className="space-y-6">
            <span className="text-[var(--color-btn)] font-black text-xs uppercase tracking-[0.4em]">
              Propósito
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-title)]">
              Misión
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              {mision}
            </p>
          </div>
          <div className="space-y-6 md:pt-20">
            <span className="text-[var(--color-btn)] font-black text-xs uppercase tracking-[0.4em]">
              Futuro
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-title)]">
              Visión
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              {vision}
            </p>
          </div>
        </div>
      </section>

      {/* 3. VALORES CORPORATIVOS */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[var(--color-title)]">
              Valores corporativos
            </h2>
            <div className="h-px flex-1 bg-slate-200 mx-10 hidden md:block mb-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valores.map((pair, i) => (
              <div
                key={i}
                className="border-l-4 border-[var(--color-btn)] pl-6 py-4"
              >
                <p className="text-lg font-bold text-[var(--color-title)]">
                  {pair.left}
                </p>
                <p className="text-slate-500 mt-1">{pair.right}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POLÍTICAS */}
      <section className="mx-auto max-w-7xl px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-12 rounded-[3rem] bg-[var(--color-title)] text-white shadow-xl">
            <h3 className="text-3xl font-bold mb-6">Política de calidad</h3>
            <div className="space-y-4 opacity-90 leading-relaxed font-light text-lg">
              {politicaCalidad.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="p-12 rounded-[3rem] border border-slate-200 bg-white shadow-sm">
            <h3 className="text-3xl font-bold mb-6 text-[var(--color-title)]">
              Política de seguridad del paciente
            </h3>
            <div className="space-y-4 text-slate-500 leading-relaxed font-light text-lg">
              {politicaSeguridad.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ESPECIALIDADES (DOS Y DOS - CARDS) */}
      <section className="bg-[#f8f9fa] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-10">
          <div className="mb-20 text-center">
            <h2 className="text-5xl mb-10 md:text-7xl font-bold tracking-tighter text-[var(--color-title)]">
              Nuestros Servicios
            </h2>
            <p className="mb-20 text-lg text-center text-slate-500 leading-relaxed">
              {intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {serviceGroups.map((group, index) => (
              <div
                key={group.id}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-12 transition-all hover:shadow-2xl"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-[var(--color-btn)] font-black text-xl group-hover:bg-[var(--color-btn)] group-hover:text-white transition-colors duration-500">
                  0{index + 1}
                </div>

                <h3 className="mb-8 text-3xl font-bold text-[var(--color-title)] uppercase tracking-tight">
                  {group.title}
                </h3>

                <ul className="grid grid-cols-1 gap-4">
                  {group.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-slate-500 font-light"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-btn)]" />
                      <span className="text-base md:text-lg leading-tight">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
