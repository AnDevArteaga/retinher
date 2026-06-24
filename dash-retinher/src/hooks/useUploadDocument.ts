import { useState } from 'react'
import { supabase } from '../lib/supabase'

const BUCKET = 'informes'
const MAX_SIZE = 20 * 1024 * 1024

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

function inferContentType(file: File): string {
  if (file.type && ALLOWED_TYPES.has(file.type)) return file.type
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'doc') return 'application/msword'
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  return file.type || 'application/octet-stream'
}

function isAllowedDocument(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf' || ext === 'doc' || ext === 'docx') return true
  return ALLOWED_TYPES.has(inferContentType(file))
}

export function useUploadDocument() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File, folder = 'archivos'): Promise<string | null> => {
    if (!isAllowedDocument(file)) {
      setError('Solo se permiten archivos PDF o Word (DOC/DOCX).')
      return null
    }
    if (file.size > MAX_SIZE) {
      setError('El archivo es demasiado grande. Máximo 20 MB.')
      return null
    }

    setUploading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Debes iniciar sesión para subir archivos.')
        return null
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
      const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'archivos'
      const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const contentType = inferContentType(file)

      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType, upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
      return urlData.publicUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error subiendo el archivo')
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error }
}
