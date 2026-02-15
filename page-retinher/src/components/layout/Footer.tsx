import { mockData } from "../../data/MockData";

export function Footer() {
  const f = mockData.footer;

  return (
    <footer className="border-t border-[var(--color-text-muted)]/20 bg-[var(--color-bg-primary)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-12 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-title)" }}
            >
              Sede 1
            </h3>
            <p className="mt-2 text-[var(--color-text-muted)]">{f.sede1}</p>
          </div>
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-title)" }}
            >
              Sede 2
            </h3>
            <p className="mt-2 text-[var(--color-text-muted)]">{f.sede2}</p>
          </div>
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-title)" }}
            >
              Contacto
            </h3>
            <p className="mt-2 text-[var(--color-text-muted)]">
              PBX: {f.pbx}
              <br />
              <a
                href={`mailto:${f.email}`}
                className="text-[var(--color-btn)] underline-offset-4 hover:opacity-90"
              >
                {f.email}
              </a>
            </p>
          </div>
        </div>
        <p className="mt-10 text-center text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {f.city}
        </p>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-text-muted)]/20 pt-10 md:flex-row">
          <p className="text-center text-xs text-[var(--color-text-muted)] md:text-left">
            {f.copyright}
          </p>
          <a
            href="#"
            className="text-xs text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-text)]"
          >
            {f.privacy}
          </a>
        </div>
      </div>
    </footer>
  );
}
