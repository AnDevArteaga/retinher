import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getPageContent, type PageSlug } from '../data/contentApi'

type ContentContextType = {
  data: unknown
  loading: boolean
  error: string | null
}

const ContentContext = createContext<ContentContextType | null>(null)

export function ContentProvider({ slug, children }: { slug: PageSlug; children: ReactNode }) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getPageContent(slug)
      .then((d) => {
        if (!cancelled) {
          setData(d)
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [slug])

  return (
    <ContentContext.Provider value={{ data, loading, error }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent(): ContentContextType {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
