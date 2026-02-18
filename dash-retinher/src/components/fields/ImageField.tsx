import { useRef, useState } from 'react'
import { useUploadImage } from '../../hooks/useUploadImage'
import { Upload, Link2 } from 'lucide-react'

type Props = {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

export function ImageField({ value, onChange, folder = 'uploads', label = 'Imagen' }: Props) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const { upload, uploading, error } = useUploadImage()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file, folder)
    if (url) onChange(url)
    e.target.value = ''
  }

  const applyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setShowUrlInput(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {value && (
          <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
            {value.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={value} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={value} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <input type="file" ref={fileRef} accept="image/*,video/*" onChange={handleFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Subiendo…' : 'Subir'}
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
          placeholder="URL"
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
