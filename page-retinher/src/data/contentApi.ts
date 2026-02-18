import { supabase } from '../lib/supabase'

type CacheEntry = { version: string; data: unknown }
const cache = new Map<string, CacheEntry>()

async function getVersion(slug: string): Promise<string | null> {
  const { data } = await supabase.from('content_versions').select('updated_at').eq('page_slug', slug).maybeSingle()
  return data ? new Date(data.updated_at).toISOString() : null
}

async function fetchHome() {
  const [v, heroR, doctorR, aboutR, servicesR, sellosR, sellosItemsR, ucadR, queR, galleryR, galleryItemsR, imageR, imageItemsR, visionR, footerR, whatsappR, navR] = await Promise.all([
    getVersion('home'),
    supabase.from('hero').select('*').maybeSingle(),
    supabase.from('doctor').select('*').maybeSingle(),
    supabase.from('about').select('*').maybeSingle(),
    supabase.from('services').select('*').order('section_order'),
    supabase.from('sellos_impacto').select('*').maybeSingle(),
    supabase.from('sellos_impacto_items').select('*').order('item_order'),
    supabase.from('ucad_section').select('*').maybeSingle(),
    supabase.from('que_revisamos').select('*').maybeSingle(),
    supabase.from('gallery').select('*').maybeSingle(),
    supabase.from('gallery_items').select('*').order('item_order'),
    supabase.from('image_section').select('*').maybeSingle(),
    supabase.from('image_section_items').select('*').order('item_order'),
    supabase.from('vision_lab').select('*').maybeSingle(),
    supabase.from('footer').select('*').maybeSingle(),
    supabase.from('whatsapp').select('*').maybeSingle(),
    supabase.from('nav_links').select('*').order('link_order'),
  ])

  const hero = heroR.data
  const doctor = doctorR.data
  const about = aboutR.data
  const services = servicesR.data ?? []
  const sellos = sellosR.data
  const sellosItems = sellosItemsR.data ?? []
  const ucad = ucadR.data
  const queRevisamos = queR.data
  const gallery = galleryR.data
  const galleryItems = galleryItemsR.data ?? []
  const imageSection = imageR.data
  const imageSectionItems = imageItemsR.data ?? []
  const visionLab = visionR.data
  const footer = footerR.data
  const whatsapp = whatsappR.data
  const navLinks = navR.data ?? []

  return {
    version: v ?? '',
    data: {
      hero: hero ? { headline: hero.headline, subline: hero.subline, brandLine: hero.brand_line, cta: hero.cta, videoPlaceholder: hero.video_placeholder } : null,
      doctor: doctor ? { nombre: doctor.nombre, titulo: doctor.titulo, descripcion: doctor.descripcion, imagen: doctor.imagen } : null,
      about: about ? { title: about.title, intro: about.intro, purpose: about.purpose, ctaPdf: about.cta_pdf } : null,
      services: services.map((s) => ({ id: s.slug, title: s.title, description: s.description, cta: s.cta, image: s.image })),
      sellosImpacto: sellos ? { titulo: sellos.titulo, subtitulo: sellos.subtitulo, sellos: sellosItems.map((i) => ({ id: i.slug, titulo: i.titulo, logo: i.logo, descripcion: i.descripcion, porQue: i.por_que, queHicieron: i.que_hicieron ?? [], stats: i.stats ?? [], tags: i.tags ?? [], color: i.color })) } : null,
      ucadSection: ucad ? { titulo: ucad.titulo, subtitulo: ucad.subtitulo, descripcion: ucad.descripcion, cta: ucad.cta, logo: ucad.logo, ruta: ucad.ruta } : null,
      queRevisamos: queRevisamos ? { title: queRevisamos.title, text: queRevisamos.text } : null,
      gallery: gallery ? { title: gallery.title, subtitle: gallery.subtitle, items: galleryItems.map((i) => ({ id: i.id, type: i.type, src: i.src, caption: i.caption })) } : null,
      imageSection: imageSection ? { title: imageSection.title, subtitle: imageSection.subtitle, images: imageSectionItems.map((i) => ({ id: i.id, src: i.src, alt: i.alt })) } : null,
      visionLab: visionLab ? { title: visionLab.title, tagline: visionLab.tagline, calibration: visionLab.calibration, calibrationDesc: visionLab.calibration_desc, testInstruction: visionLab.test_instruction, feedback: visionLab.feedback ?? {}, directions: visionLab.directions ?? [] } : null,
      footer: footer ? { sede1: footer.sede1, sede2: footer.sede2, pbx: footer.pbx, email: footer.email, city: footer.city, copyright: footer.copyright, privacy: footer.privacy } : null,
      whatsapp: whatsapp ? { numero: whatsapp.numero, mensaje: whatsapp.mensaje } : null,
      nav: { logo: 'RETINHER', links: navLinks.map((l) => ({ href: l.href, label: l.label })) },
    },
  }
}

async function fetchNosotros() {
  const [versionNosotros, nosotrosR, ecosistemaR, sellosR, sellosItemsR, footerR, whatsappR, navR] = await Promise.all([
    getVersion('nosotros'),
    supabase.from('nosotros').select('*').maybeSingle(),
    supabase.from('ecosistema_impacto').select('*').maybeSingle(),
    supabase.from('sellos_reconocimientos').select('*').maybeSingle(),
    supabase.from('sellos_reconocimientos_items').select('*').order('orden'),
    supabase.from('footer').select('*').maybeSingle(),
    supabase.from('whatsapp').select('*').maybeSingle(),
    supabase.from('nav_links').select('*').order('link_order'),
  ])
  const nosotros = nosotrosR.data
  const ecosistema = ecosistemaR.data
  const sellos = sellosR.data
  const sellosItems = sellosItemsR.data ?? []
  const footer = footerR.data
  const whatsapp = whatsappR.data
  const navLinks = navR.data ?? []

  return {
    version: versionNosotros ?? '',
    data: {
      nosotros: nosotros ? { heroImage: nosotros.hero_image, title: nosotros.title, intro: nosotros.intro, mision: nosotros.mision, vision: nosotros.vision, valores: nosotros.valores ?? [], politicaCalidad: nosotros.politica_calidad ?? [], politicaSeguridad: nosotros.politica_seguridad ?? [], serviceGroups: nosotros.service_groups ?? [] } : null,
      ecosistemaImpacto: ecosistema ? { tituloSeccion: ecosistema.titulo_seccion, subtituloSeccion: ecosistema.subtitulo_seccion, bloques: ecosistema.bloques ?? [] } : null,
      sellosReconocimientos: sellos ? { titulo: sellos.titulo, subtitulo: sellos.subtitulo, cta: sellos.cta, sellos: sellosItems.map((i) => ({ id: i.slug, orden: i.orden, titulo: i.titulo, subtitulo: i.subtitulo, descripcion: i.descripcion, logros: i.logros, imagen: i.imagen, logoPlaceholder: i.logo_placeholder, color: i.color })) } : null,
      footer: footer ? { sede1: footer.sede1, sede2: footer.sede2, pbx: footer.pbx, email: footer.email, city: footer.city, copyright: footer.copyright, privacy: footer.privacy } : null,
      whatsapp: whatsapp ? { numero: whatsapp.numero, mensaje: whatsapp.mensaje } : null,
      nav: { logo: 'RETINHER', links: navLinks.map((l) => ({ href: l.href, label: l.label })) },
    },
  }
}

async function fetchSedes() {
  const [versionSedes, sedesR, sedePrincipalR, footerR, whatsappR, navR] = await Promise.all([
    getVersion('sedes'),
    supabase.from('sedes').select('*').maybeSingle(),
    supabase.from('sede_principal').select('*').order('nombre'),
    supabase.from('footer').select('*').maybeSingle(),
    supabase.from('whatsapp').select('*').maybeSingle(),
    supabase.from('nav_links').select('*').order('link_order'),
  ])
  const sedesRow = sedesR.data
  const sedePrincipalList = (sedePrincipalR.data ?? []) as Array<{ id: string; nombre: string; direccion: string; barrio: string; ciudad: string; horario: string; mapa_embed_url: string }>
  const footer = footerR.data
  const whatsapp = whatsappR.data
  const navLinks = navR.data ?? []

  const sedesPayload = sedesRow
    ? {
        titulo: sedesRow.titulo,
        subtitulo: sedesRow.subtitulo,
        sedes: sedePrincipalList.map((s) => ({
          id: s.id,
          nombre: s.nombre,
          direccion: s.direccion,
          barrio: s.barrio,
          ciudad: s.ciudad,
          horario: s.horario,
          mapaEmbedUrl: s.mapa_embed_url,
        })),
      }
    : null

  return {
    version: versionSedes ?? '',
    data: {
      sedes: sedesPayload,
      footer: footer ? { sede1: footer.sede1, sede2: footer.sede2, pbx: footer.pbx, email: footer.email, city: footer.city, copyright: footer.copyright, privacy: footer.privacy } : null,
      whatsapp: whatsapp ? { numero: whatsapp.numero, mensaje: whatsapp.mensaje } : null,
      nav: { logo: 'RETINHER', links: navLinks.map((l) => ({ href: l.href, label: l.label })) },
    },
  }
}

export type PageSlug = 'home' | 'nosotros' | 'sedes'

export async function getPageContent(slug: PageSlug): Promise<unknown> {
  const version = await getVersion(slug)
  const cached = cache.get(slug)
  if (cached && version && cached.version === version) return cached.data

  let result: { version: string; data: unknown }
  if (slug === 'home') result = await fetchHome()
  else if (slug === 'nosotros') result = await fetchNosotros()
  else if (slug === 'sedes') result = await fetchSedes()
  else return null

  cache.set(slug, { version: result.version, data: result.data })
  return result.data
}
