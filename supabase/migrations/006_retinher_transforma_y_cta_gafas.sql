-- Página Retinher Transforma: hero propio
CREATE TABLE IF NOT EXISTS retinher_transforma_hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline TEXT NOT NULL,
  subline TEXT NOT NULL,
  brand_line TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'image')) DEFAULT 'image',
  media_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO retinher_transforma_hero (headline, subline, brand_line, media_type, media_url)
SELECT 'Retinher Transforma', 'Ecosistema de impacto', 'Sostenibilidad, bienestar y salud en la región', 'image', NULL
WHERE NOT EXISTS (SELECT 1 FROM retinher_transforma_hero LIMIT 1);

-- Content version para la nueva página
INSERT INTO content_versions (page_slug) VALUES ('retinher_transforma') ON CONFLICT (page_slug) DO NOTHING;

-- CTA opcional en gafas (lente derecho): texto + destino (ruta o sección)
ALTER TABLE que_revisamos
  ADD COLUMN IF NOT EXISTS cta_text TEXT,
  ADD COLUMN IF NOT EXISTS cta_link_type TEXT CHECK (cta_link_type IN ('page', 'section')),
  ADD COLUMN IF NOT EXISTS cta_link_value TEXT;

-- Trigger y RLS para retinher_transforma_hero
CREATE OR REPLACE FUNCTION bump_content_version()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME IN ('hero', 'hero_slides', 'doctor', 'about', 'services', 'sellos_impacto', 'sellos_impacto_items', 'ucad_section', 'que_revisamos', 'gallery', 'gallery_items', 'image_section', 'image_section_items', 'vision_lab', 'footer', 'whatsapp', 'nav_links') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('home', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('nosotros', 'ecosistema_impacto', 'sellos_reconocimientos', 'sellos_reconocimientos_items') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('nosotros', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  IF TG_TABLE_NAME IN ('retinher_transforma_hero', 'ecosistema_impacto', 'sellos_reconocimientos', 'sellos_reconocimientos_items') THEN
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

CREATE TRIGGER retinher_transforma_hero_version AFTER INSERT OR UPDATE OR DELETE ON retinher_transforma_hero FOR EACH ROW EXECUTE FUNCTION bump_content_version();

ALTER TABLE retinher_transforma_hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read all" ON retinher_transforma_hero FOR SELECT USING (true);
CREATE POLICY "Admin all retinher_transforma_hero" ON retinher_transforma_hero FOR ALL USING (is_admin());
