-- Hero como slider: tabla hero_slides (varios slides con headline, subline, brand_line, cta, video o imagen)
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slide_order INT NOT NULL DEFAULT 0,
  headline TEXT NOT NULL,
  subline TEXT NOT NULL,
  brand_line TEXT NOT NULL,
  cta TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'image')) DEFAULT 'video',
  media_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slide inicial (si existiera la tabla hero se podría migrar desde ahí)
INSERT INTO hero_slides (slide_order, headline, subline, brand_line, cta, media_type, media_url) VALUES
  (0, 'La evolución de tu mirada', 'RETINHER', 'CENTRO DE ESPECIALIDADES', 'Iniciar experiencia', 'video', NULL);

-- Bump content version al cambiar hero_slides
CREATE OR REPLACE FUNCTION bump_content_version()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME IN ('hero', 'hero_slides', 'doctor', 'about', 'services', 'sellos_impacto', 'sellos_impacto_items', 'ucad_section', 'que_revisamos', 'gallery', 'gallery_items', 'image_section', 'image_section_items', 'vision_lab', 'footer', 'whatsapp', 'nav_links') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('home', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('nosotros', 'ecosistema_impacto', 'sellos_reconocimientos', 'sellos_reconocimientos_items') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('nosotros', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
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

CREATE TRIGGER hero_slides_version AFTER INSERT OR UPDATE OR DELETE ON hero_slides FOR EACH ROW EXECUTE FUNCTION bump_content_version();

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read all" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Admin all hero_slides" ON hero_slides FOR ALL USING (is_admin());
