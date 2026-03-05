import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSEOForPath } from '../../constants/seo'

const OG_IMAGE_PATH = '/cropped-Icono.png'

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attribute, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function PageSEO() {
  const { pathname } = useLocation()
  const { title, description } = getSEOForPath(pathname)

  useEffect(() => {
    document.title = title
    setMeta('description', description)

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const canonicalUrl = `${baseUrl}${pathname}`.replace(/\?.*$/, '')
    const imageUrl = baseUrl ? new URL(OG_IMAGE_PATH, baseUrl).href : OG_IMAGE_PATH

    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:image', imageUrl, 'property')
    setMeta('og:url', canonicalUrl, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:locale', 'es_CO', 'property')
  }, [pathname, title, description])

  return null
}
