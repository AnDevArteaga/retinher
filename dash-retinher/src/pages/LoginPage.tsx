import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const { error } = await signIn(email, password)
    if (error) {
      setErr(error.message)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-title-dark)] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl shadow-black/20 sm:p-8"
      >
        <div className="mb-6 flex justify-center">
          <img src="/retiner1.png" alt="Retinher" className="h-10 w-auto object-contain brightness-0 invert" />
        </div>
        <h1 className="text-center text-xl font-semibold text-[var(--color-title)]">Retinher CMS</h1>
        <p className="mt-1 text-center text-sm text-[var(--color-text-muted)]">Inicia sesión para editar el contenido</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--color-btn)] focus:ring-2 focus:ring-[var(--color-btn)]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--color-btn)] focus:ring-2 focus:ring-[var(--color-btn)]/30"
            />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--color-btn)] py-2.5 font-medium text-[var(--color-btn-text)] transition-colors hover:bg-[var(--color-btn-hover)]"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  )
}
