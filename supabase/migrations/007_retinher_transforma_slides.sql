-- Carrusel de slides (imagen/video) en página Retinher Transforma, controlable desde el dash
CREATE TABLE IF NOT EXISTS retinher_transforma_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slide_order INT NOT NULL DEFAULT 0,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'image')) DEFAULT 'image',
  media_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incluir retinher_transforma_slides en el bump de content version
CREATE OR REPLACE FUNCTION bump_content_version()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME IN ('hero', 'hero_slides', 'doctor', 'about', 'services', 'sellos_impacto', 'sellos_impacto_items', 'ucad_section', 'que_revisamos', 'gallery', 'gallery_items', 'image_section', 'image_section_items', 'vision_lab', 'footer', 'whatsapp', 'nav_links') THEN
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

DROP TRIGGER IF EXISTS retinher_transforma_slides_version ON retinher_transforma_slides;
CREATE TRIGGER retinher_transforma_slides_version AFTER INSERT OR UPDATE OR DELETE ON retinher_transforma_slides FOR EACH ROW EXECUTE FUNCTION bump_content_version();

ALTER TABLE retinher_transforma_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read all" ON retinher_transforma_slides FOR SELECT USING (true);
CREATE POLICY "Admin all retinher_transforma_slides" ON retinher_transforma_slides FOR ALL USING (is_admin());
