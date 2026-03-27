-- Carrusel de imágenes/vídeos por sello (como en noticias/slides)
ALTER TABLE sellos_impacto_items
  ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN sellos_impacto_items.media IS 'Array of { "type": "image"|"video", "url": "..." } for the sello carousel';

-- Bump retinher_transforma cuando se editan sellos_impacto / sellos_impacto_items (se editan desde dash RT)
CREATE OR REPLACE FUNCTION bump_content_version()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME IN ('hero', 'hero_slides', 'doctor', 'about', 'services', 'sellos_impacto', 'sellos_impacto_items', 'ucad_section', 'que_revisamos', 'gallery', 'gallery_items', 'image_section', 'image_section_items', 'vision_lab', 'footer', 'whatsapp', 'nav_links', 'home_news') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('home', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('nosotros', 'ecosistema_impacto', 'sellos_reconocimientos', 'sellos_reconocimientos_items') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('nosotros', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('retinher_transforma_hero', 'retinher_transforma_slides', 'ecosistema_impacto', 'sellos_reconocimientos', 'sellos_reconocimientos_items', 'sellos_impacto', 'sellos_impacto_items') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('retinher_transforma', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('sedes', 'sede_principal') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('sedes', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('footer', 'nav_links', 'whatsapp') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('home', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
