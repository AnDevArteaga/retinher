import { supabase } from '../lib/supabase'

type CacheEntry = { version: string; data: unknown }
const cache = new Map<string, CacheEntry>()

async function getVersion(slug: string): Promise<string | null> {
  const { data } = await supabase.from('content_versions').select('updated_at').eq('page_slug', slug).maybeSingle()
  return data ? new Date(data.updated_at).toISOString() : null
}

async function fetchHome() {
  const [v, heroSlidesR, doctorR, aboutR, servicesR, sellosR, sellosItemsR, sellosReconR, sellosReconItemsR, ucadR, queR, galleryR, galleryItemsR, imageR, imageItemsR, visionR, footerR, whatsappR, navR, newsR] = await Promise.all([
    getVersion('home'),
    supabase.from('hero_slides').select('*').order('slide_order'),
    supabase.from('doctor').select('*').maybeSingle(),
    supabase.from('about').select('*').maybeSingle(),
    supabase.from('services').select('*').order('section_order'),
    supabase.from('sellos_impacto').select('*').maybeSingle(),
    supabase.from('sellos_impacto_items').select('*').order('item_order'),
    supabase.from('sellos_reconocimientos').select('*').maybeSingle(),
    supabase.from('sellos_reconocimientos_items').select('*').order('orden'),
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
    supabase.from('home_news').select('*').order('fecha', { ascending: false }),
  ])

  const heroSlidesRaw = (heroSlidesR.data ?? []) as Array<{ id: string; slide_order: number; headline: string; subline: string; brand_line: string; cta: string; cta_link_type?: string; cta_link_value?: string | null; media_type: string; media_url: string | null }>
  const doctor = doctorR.data
  const about = aboutR.data
  const services = servicesR.data ?? []
  const sellos = sellosR.data
  const sellosItems = sellosItemsR.data ?? []
  const sellosRecon = sellosReconR.data
  const sellosReconItems = (sellosReconItemsR.data ?? []) as Array<{ slug: string; orden: number; titulo: string; subtitulo: string; descripcion: string; logros: string | null; imagen: string; logo_placeholder: string | null; color: string }>
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
  const newsRows = (newsR.data ?? []) as Array<{ id: string; titulo: string; descripcion: string; fecha: string; media: Array<{ type: string; url: string }> }>

  return {
    version: v ?? '',
    data: {
      heroSlides: heroSlidesRaw.map((s) => ({ id: s.id, headline: s.headline, subline: s.subline, brandLine: s.brand_line, cta: s.cta, ctaLinkType: (s.cta_link_type === 'page' ? 'page' : 'section') as 'page' | 'section', ctaLinkValue: s.cta_link_value ?? (s.cta_link_type === 'page' ? '/' : 'vision-lab'), mediaType: s.media_type as 'video' | 'image', mediaUrl: s.media_url ?? '' })),
      doctor: doctor ? { nombre: doctor.nombre, titulo: doctor.titulo, descripcion: doctor.descripcion, imagen: doctor.imagen } : null,
      about: about ? { title: about.title, intro: about.intro, purpose: about.purpose, ctaPdf: about.cta_pdf } : null,
      services: services.map((s) => ({ id: s.slug, title: s.title, description: s.description, cta: s.cta, image: s.image })),
      sellosImpacto: sellos ? { titulo: sellos.titulo, subtitulo: sellos.subtitulo, sellos: sellosItems.map((i) => ({ id: i.slug, titulo: i.titulo, logo: i.logo, descripcion: i.descripcion, porQue: i.por_que, queHicieron: i.que_hicieron ?? [], stats: i.stats ?? [], tags: i.tags ?? [], color: i.color })) } : null,
      sellosReconocimientos: sellosRecon ? { titulo: (sellosRecon as { titulo: string }).titulo, subtitulo: (sellosRecon as { subtitulo: string }).subtitulo, cta: (sellosRecon as { cta: string }).cta, sellos: sellosReconItems.map((i) => ({ id: i.slug, titulo: i.titulo, subtitulo: i.subtitulo, descripcion: i.descripcion, logros: i.logros, imagen: i.imagen, logoPlaceholder: i.logo_placeholder, color: i.color })) } : null,
      ucadSection: ucad ? { titulo: ucad.titulo, subtitulo: ucad.subtitulo, descripcion: ucad.descripcion, cta: ucad.cta, logo: ucad.logo, ruta: ucad.ruta } : null,
      queRevisamos: queRevisamos ? { title: queRevisamos.title, text: queRevisamos.text, titleRight: (queRevisamos as { title_right?: string | null }).title_right ?? '', textRight: (queRevisamos as { text_right?: string | null }).text_right ?? '', ctaText: (queRevisamos as { cta_text?: string | null }).cta_text ?? null, ctaLinkType: (queRevisamos as { cta_link_type?: string | null }).cta_link_type === 'section' ? 'section' : 'page', ctaLinkValue: (queRevisamos as { cta_link_value?: string | null }).cta_link_value ?? null, ctaTextLeft: (queRevisamos as { cta_text_left?: string | null }).cta_text_left ?? null, ctaLinkTypeLeft: (queRevisamos as { cta_link_type_left?: string | null }).cta_link_type_left === 'section' ? 'section' : 'page', ctaLinkValueLeft: (queRevisamos as { cta_link_value_left?: string | null }).cta_link_value_left ?? null } : null,
      gallery: gallery ? { title: gallery.title, subtitle: gallery.subtitle, items: galleryItems.map((i) => ({ id: i.id, type: i.type, src: i.src, caption: i.caption })) } : null,
      imageSection: imageSection ? { title: imageSection.title, subtitle: imageSection.subtitle, images: imageSectionItems.map((i) => ({ id: i.id, src: i.src, alt: i.alt })) } : null,
      visionLab: visionLab ? { title: visionLab.title, tagline: visionLab.tagline, calibration: visionLab.calibration, calibrationDesc: visionLab.calibration_desc, testInstruction: visionLab.test_instruction, feedback: visionLab.feedback ?? {}, directions: visionLab.directions ?? [] } : null,
      footer: footer ? { sede1: footer.sede1, sede2: footer.sede2, pbx: footer.pbx, email: footer.email, soloLlamadas: (footer as { solo_llamadas?: string }).solo_llamadas, soloMensaje: (footer as { solo_mensaje?: string }).solo_mensaje, emailGestion: (footer as { email_gestion?: string }).email_gestion, emailGeneral: (footer as { email_general?: string }).email_general, city: footer.city, copyright: footer.copyright, privacy: footer.privacy } : null,
      whatsapp: whatsapp ? { numero: whatsapp.numero, mensaje: whatsapp.mensaje } : null,
      nav: { logo: 'RETINHER', links: navLinks.map((l) => ({ href: l.href, label: l.label })) },
      noticias: newsRows.map((n) => ({ id: n.id, titulo: n.titulo, descripcion: n.descripcion, fecha: n.fecha, media: (n.media ?? []).map((m) => ({ type: m.type as 'image' | 'video', url: m.url })) })),
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
      footer: footer ? { sede1: footer.sede1, sede2: footer.sede2, pbx: footer.pbx, email: footer.email, soloLlamadas: (footer as { solo_llamadas?: string }).solo_llamadas, soloMensaje: (footer as { solo_mensaje?: string }).solo_mensaje, emailGestion: (footer as { email_gestion?: string }).email_gestion, emailGeneral: (footer as { email_general?: string }).email_general, city: footer.city, copyright: footer.copyright, privacy: footer.privacy } : null,
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
      footer: footer ? { sede1: footer.sede1, sede2: footer.sede2, pbx: footer.pbx, email: footer.email, soloLlamadas: (footer as { solo_llamadas?: string }).solo_llamadas, soloMensaje: (footer as { solo_mensaje?: string }).solo_mensaje, emailGestion: (footer as { email_gestion?: string }).email_gestion, emailGeneral: (footer as { email_general?: string }).email_general, city: footer.city, copyright: footer.copyright, privacy: footer.privacy } : null,
      whatsapp: whatsapp ? { numero: whatsapp.numero, mensaje: whatsapp.mensaje } : null,
      nav: { logo: 'RETINHER', links: navLinks.map((l) => ({ href: l.href, label: l.label })) },
    },
  }
}

async function fetchRetinherTransforma() {
  const [v, heroR, slidesR, ecosistemaR, sellosR, sellosItemsR, sellosImpactoR, sellosImpactoItemsR, footerR, whatsappR, navR] = await Promise.all([
    getVersion('retinher_transforma'),
    supabase.from('retinher_transforma_hero').select('*').maybeSingle(),
    supabase.from('retinher_transforma_slides').select('*').order('slide_order'),
    supabase.from('ecosistema_impacto').select('*').maybeSingle(),
    supabase.from('sellos_reconocimientos').select('*').maybeSingle(),
    supabase.from('sellos_reconocimientos_items').select('*').order('orden'),
    supabase.from('sellos_impacto').select('*').maybeSingle(),
    supabase.from('sellos_impacto_items').select('*').order('item_order'),
    supabase.from('footer').select('*').maybeSingle(),
    supabase.from('whatsapp').select('*').maybeSingle(),
    supabase.from('nav_links').select('*').order('link_order'),
  ])
  const hero = heroR.data as { headline: string; subline: string; brand_line?: string; media_type: string; media_url?: string | null } | null
  const slidesRaw = (slidesR.data ?? []) as Array<{ id: string; slide_order: number; media_type: string; media_url: string | null }>
  const ecosistema = ecosistemaR.data
  const sellos = sellosR.data
  const sellosItems = (sellosItemsR.data ?? []) as Array<{ slug: string; orden: number; titulo: string; subtitulo: string; descripcion: string; logros: string | null; imagen: string; logo_placeholder: string | null; color: string }>
  const sellosImpacto = sellosImpactoR.data
  const sellosImpactoItems = (sellosImpactoItemsR.data ?? []) as Array<{ slug: string; titulo: string; logo: string; descripcion: string; por_que: string | null; que_hicieron: unknown; stats: unknown; tags: string[] | null; color: string; media?: Array<{ type: string; url: string }> }>
  const footer = footerR.data
  const whatsapp = whatsappR.data
  const navLinks = navR.data ?? []

  return {
    version: v ?? '',
    data: {
      retinherTransformaHero: hero ? { headline: hero.headline, subline: hero.subline, brandLine: hero.brand_line ?? '', mediaType: hero.media_type as 'video' | 'image', mediaUrl: hero.media_url ?? '' } : null,
      retinherTransformaSlides: slidesRaw.map((s) => ({ id: s.id, slideOrder: s.slide_order, mediaType: s.media_type as 'video' | 'image', mediaUrl: s.media_url ?? '' })),
      ecosistemaImpacto: ecosistema ? { tituloSeccion: (ecosistema as { titulo_seccion: string }).titulo_seccion, subtituloSeccion: (ecosistema as { subtitulo_seccion: string }).subtitulo_seccion, bloques: (ecosistema as { bloques?: unknown[] }).bloques ?? [] } : null,
      sellosImpacto: sellosImpacto ? { titulo: (sellosImpacto as { titulo: string }).titulo, subtitulo: (sellosImpacto as { subtitulo: string }).subtitulo, sellos: sellosImpactoItems.map((i) => ({ id: i.slug, titulo: i.titulo, logo: i.logo, descripcion: i.descripcion, porQue: i.por_que, queHicieron: i.que_hicieron ?? [], stats: i.stats ?? [], tags: i.tags ?? [], color: i.color, media: (i.media ?? []).map((m) => ({ type: m.type as 'image' | 'video', url: m.url })) })) } : null,
      sellosReconocimientos: sellos ? { titulo: (sellos as { titulo: string }).titulo, subtitulo: (sellos as { subtitulo: string }).subtitulo, cta: (sellos as { cta: string }).cta, sellos: sellosItems.map((i) => ({ id: i.slug, orden: i.orden, titulo: i.titulo, subtitulo: i.subtitulo, descripcion: i.descripcion, logros: i.logros, imagen: i.imagen, logoPlaceholder: i.logo_placeholder, color: i.color })) } : null,
      footer: footer ? { sede1: (footer as { sede1: string }).sede1, sede2: (footer as { sede2: string }).sede2, pbx: (footer as { pbx: string }).pbx, email: (footer as { email: string }).email, city: (footer as { city: string }).city, copyright: (footer as { copyright: string }).copyright, privacy: (footer as { privacy: string }).privacy } : null,
      whatsapp: whatsapp ? { numero: (whatsapp as { numero: string }).numero, mensaje: (whatsapp as { mensaje: string }).mensaje } : null,
      nav: { logo: 'RETINHER', links: (navLinks as Array<{ href: string; label: string }>).map((l) => ({ href: l.href, label: l.label })) },
    },
  }
}

async function fetchUcad() {
  const [v, pageR, itemsR, metasR, footerR, whatsappR, navR] = await Promise.all([
    getVersion('ucad'),
    supabase.from('ucad_page').select('*').maybeSingle(),
    supabase.from('ucad_page_gallery_items').select('*').order('item_order'),
    supabase.from('ucad_metas').select('*').order('item_order'),
    supabase.from('footer').select('*').maybeSingle(),
    supabase.from('whatsapp').select('*').maybeSingle(),
    supabase.from('nav_links').select('*').order('link_order'),
  ])
  const page = pageR.data as { id: string; titulo_galeria: string; subtitulo_galeria: string; infografia_url?: string; alcance_titulo?: string; alcance_texto?: string; poblacion_titulo?: string; poblacion_texto?: string } | null
  const items = (itemsR.data ?? []) as Array<{ id: string; src: string; alt: string; item_order: number }>
  const metas = (metasR.data ?? []) as Array<{ id: string; valor: string; label: string; descripcion: string; icon: string; color: string; item_order: number }>
  const footer = footerR.data
  const whatsapp = whatsappR.data
  const navLinks = (navR.data ?? []) as Array<{ href: string; label: string }>

  return {
    version: v ?? '',
    data: {
      ucadPage: page
        ? {
            tituloGaleria: page.titulo_galeria,
            subtituloGaleria: page.subtitulo_galeria,
            infografiaUrl: page.infografia_url ?? '/infografia.jpeg',
            alcanceTitulo: page.alcance_titulo ?? 'Zona de Influencia',
            alcanceTexto: page.alcance_texto ?? 'Departamento de Córdoba (Sede principal en Montería + Unidad Móvil).',
            poblacionTitulo: page.poblacion_titulo ?? 'Grupos Prioritarios',
            poblacionTexto: page.poblacion_texto ?? 'Pacientes Diabéticos Tipo I y II\nGestantes con diabetes (Alto riesgo de progresión)\nPacientes sin tamizaje reciente (>1 año sin fondo de ojo)',
            galleryItems: items.map((i) => ({ id: i.id, src: i.src, alt: i.alt })),
            metas: metas.map((m) => ({ id: m.id, valor: m.valor, label: m.label, descripcion: m.descripcion, icon: m.icon, color: m.color })),
          }
        : null,
      footer: footer ? { sede1: (footer as { sede1: string }).sede1, sede2: (footer as { sede2: string }).sede2, pbx: (footer as { pbx: string }).pbx, email: (footer as { email: string }).email, city: (footer as { city: string }).city, copyright: (footer as { copyright: string }).copyright, privacy: (footer as { privacy: string }).privacy } : null,
      whatsapp: whatsapp ? { numero: (whatsapp as { numero: string }).numero, mensaje: (whatsapp as { mensaje: string }).mensaje } : null,
      nav: { logo: 'RETINHER', links: navLinks.map((l) => ({ href: l.href, label: l.label })) },
    },
  }
}

export type PageSlug = 'home' | 'nosotros' | 'sedes' | 'retinher_transforma' | 'ucad'

export async function getPageContent(slug: PageSlug): Promise<unknown> {
  const version = await getVersion(slug)
  const cached = cache.get(slug)
  if (cached && version && cached.version === version) return cached.data

  let result: { version: string; data: unknown }
  if (slug === 'home') result = await fetchHome()
  else if (slug === 'nosotros') result = await fetchNosotros()
  else if (slug === 'sedes') result = await fetchSedes()
  else if (slug === 'retinher_transforma') result = await fetchRetinherTransforma()
  else if (slug === 'ucad') result = await fetchUcad()
  else return null

  cache.set(slug, { version: result.version, data: result.data })
  return result.data
}
