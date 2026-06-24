import { useRef, useState } from 'react'
import { useUploadDocument } from '../../hooks/useUploadDocument'
import { Upload, Link2, FileText } from 'lucide-react'

type Props = {
  value: string
  onChange: (url: string) => void
  onFileNameChange?: (name: string) => void
  onFileTypeChange?: (type: 'pdf' | 'docx') => void
  folder?: string
  label?: string
}

function detectFileType(url: string, fileName?: string): 'pdf' | 'docx' {
  const ref = (fileName || url).toLowerCase()
  if (ref.endsWith('.docx') || ref.endsWith('.doc')) return 'docx'
  return 'pdf'
}

export function FileField({
  value,
  onChange,
  onFileNameChange,
  onFileTypeChange,
  folder = 'informes',
  label = 'Archivo (PDF o DOCX)',
}: Props) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const { upload, uploading, error } = useUploadDocument()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file, folder)
    if (url) {
      onChange(url)
      onFileNameChange?.(file.name)
      onFileTypeChange?.(detectFileType(url, file.name))
    }
    e.target.value = ''
  }

  const applyUrl = () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    onChange(trimmed)
    const name = trimmed.split('/').pop() || 'documento'
    onFileNameChange?.(name)
    onFileTypeChange?.(detectFileType(trimmed, name))
    setUrlInput('')
    setShowUrlInput(false)
  }

  const fileType = value ? detectFileType(value) : null

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {value && (
          <div className="shrink-0 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <FileText className={`h-8 w-8 ${fileType === 'pdf' ? 'text-red-600' : 'text-blue-600'}`} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-slate-500">{fileType === 'pdf' ? 'PDF' : 'Word'}</p>
              <p className="text-sm text-slate-700 truncate max-w-[200px]">{value.split('/').pop()}</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            ref={fileRef}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFile}
            className="sr-only"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => {
              if (fileRef.current) {
                fileRef.current.value = ''
                fileRef.current.click()
              }
            }}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Subiendo…' : 'Subir archivo'}
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <Link2 className="w-4 h-4" />
            Pegar URL
          </button>
        </div>
      </div>
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
          <button type="button" onClick={applyUrl} className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700">
            Aplicar
          </button>
        </div>
      )}
      {value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-xs text-slate-500 border border-slate-200 rounded bg-slate-50"
          placeholder="URL del archivo"
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
