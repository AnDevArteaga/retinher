import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { getUploadFunctionUrl } from '../lib/supabase'

const UPLOAD_TIMEOUT_MS = 60000

export function useUploadImage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File, folder = 'uploads'): Promise<string | null> => {
    const url = getUploadFunctionUrl()
    if (!url) {
      setError('Configura VITE_UPLOAD_FUNCTION_URL o usa "Pegar URL"')
      return null
    }
    setUploading(true)
    setError(null)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const form = new FormData()
      form.set('file', file)
      form.set('folder', folder)
      const res = await fetch(url, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al subir')
      return json.url ?? null
    } catch (e) {
      clearTimeout(timeout)
      if ((e as Error).name === 'AbortError') setError('Tiempo de espera agotado. Usa "Pegar URL" para la imagen.')
      else setError(e instanceof Error ? e.message : 'Error subiendo')
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error }
}
