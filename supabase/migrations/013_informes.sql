-- Página Informes: documentos PDF/DOCX gestionados desde el dash y alojados en R2.

INSERT INTO content_versions (page_slug) VALUES ('informes') ON CONFLICT (page_slug) DO NOTHING;

CREATE TABLE informes_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL DEFAULT 'Informes',
  subtitulo TEXT NOT NULL DEFAULT 'Documentos institucionales y reportes de gestión disponibles para consulta y descarga.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO informes_page (titulo, subtitulo) VALUES
  ('Informes', 'Documentos institucionales y reportes de gestión disponibles para consulta y descarga.');

CREATE TABLE informes_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  informes_page_id UUID NOT NULL REFERENCES informes_page(id) ON DELETE CASCADE,
  item_order INT NOT NULL DEFAULT 0,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  archivo_url TEXT NOT NULL,
  archivo_nombre TEXT NOT NULL DEFAULT '',
  archivo_tipo TEXT NOT NULL DEFAULT 'pdf' CHECK (archivo_tipo IN ('pdf', 'docx')),
  fecha DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE informes_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE informes_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read informes_page" ON informes_page FOR SELECT USING (true);
CREATE POLICY "Public read informes_items" ON informes_items FOR SELECT USING (true);
CREATE POLICY "Admin all informes_page" ON informes_page FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin all informes_items" ON informes_items FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION bump_informes_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO content_versions (page_slug, updated_at) VALUES ('informes', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER informes_page_version AFTER INSERT OR UPDATE OR DELETE ON informes_page FOR EACH ROW EXECUTE FUNCTION bump_informes_version();
CREATE TRIGGER informes_items_version AFTER INSERT OR UPDATE OR DELETE ON informes_items FOR EACH ROW EXECUTE FUNCTION bump_informes_version();
