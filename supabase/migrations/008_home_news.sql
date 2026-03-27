-- Noticias del Home: controladas desde el dash (titulo, descripcion, fecha, media: imágenes/vídeos)
CREATE TABLE IF NOT EXISTS home_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN home_news.media IS 'Array of { "type": "image"|"video", "url": "..." }';

-- Bump content version home al cambiar noticias
CREATE OR REPLACE FUNCTION bump_content_version()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME IN ('hero', 'hero_slides', 'doctor', 'about', 'services', 'sellos_impacto', 'sellos_impacto_items', 'ucad_section', 'que_revisamos', 'gallery', 'gallery_items', 'image_section', 'image_section_items', 'vision_lab', 'footer', 'whatsapp', 'nav_links', 'home_news') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('home', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('nosotros', 'ecosistema_impacto', 'sellos_reconocimientos', 'sellos_reconocimientos_items') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('nosotros', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('retinher_transforma_hero', 'retinher_transforma_slides', 'ecosistema_impacto', 'sellos_reconocimientos', 'sellos_reconocimientos_items') THEN
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

DROP TRIGGER IF EXISTS home_news_version ON home_news;
CREATE TRIGGER home_news_version AFTER INSERT OR UPDATE OR DELETE ON home_news FOR EACH ROW EXECUTE FUNCTION bump_content_version();

ALTER TABLE home_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read home_news" ON home_news FOR SELECT USING (true);
CREATE POLICY "Admin all home_news" ON home_news FOR ALL USING (is_admin());
