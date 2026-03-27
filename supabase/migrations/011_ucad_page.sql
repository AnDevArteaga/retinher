-- Página UCAD Te Veo y Te Ves: sección galería (En imágenes) y metas e indicadores de éxito.
-- Solo estas dos secciones son editables; el resto de la página queda estático.

-- Slug para cache de la página UCAD
INSERT INTO content_versions (page_slug) VALUES ('ucad') ON CONFLICT (page_slug) DO NOTHING;

-- Cabecera de la sección galería (título y subtítulo)
CREATE TABLE ucad_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo_galeria TEXT NOT NULL DEFAULT 'En imágenes',
  subtitulo_galeria TEXT NOT NULL DEFAULT 'UCAD Te Veo y Te Ves en acción',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ucad_page (titulo_galeria, subtitulo_galeria) VALUES
  ('En imágenes', 'UCAD Te Veo y Te Ves en acción');

-- Ítems de la galería de la página UCAD
CREATE TABLE ucad_page_gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ucad_page_id UUID NOT NULL REFERENCES ucad_page(id) ON DELETE CASCADE,
  item_order INT NOT NULL DEFAULT 0,
  src TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT 'UCAD Te Veo y Te Ves',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar imágenes por defecto (rutas actuales de la página)
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 1, '/1.jpeg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 2, '/2.jpeg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 3, '/3.jpeg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 4, '/4.jpeg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 5, '/5.jpeg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 6, '/6.jpeg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 7, '/7.jpeg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 8, '/8.jpg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;
INSERT INTO ucad_page_gallery_items (ucad_page_id, item_order, src, alt)
SELECT id, 9, '/9.jpg', 'UCAD Te Veo y Te Ves' FROM ucad_page LIMIT 1;

-- Metas e indicadores de éxito (valor, label, descripción, icono, color)
CREATE TABLE ucad_metas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_order INT NOT NULL DEFAULT 0,
  valor TEXT NOT NULL,
  label TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Activity' CHECK (icon IN ('Users', 'TrendingUp', 'Activity', 'Zap', 'Award', 'Heart', 'Target')),
  color TEXT NOT NULL DEFAULT 'verdeReti' CHECK (color IN ('verdeReti', 'azulUCAD', 'rojoAlerta')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ucad_metas (item_order, valor, label, descripcion, icon, color) VALUES
  (1, '80%', 'Cobertura', 'Tamizaje anual en población de riesgo identificada', 'Users', 'verdeReti'),
  (2, '90%', 'Seguimiento', 'Efectividad en la Red de Referencia Digital', 'TrendingUp', 'verdeReti'),
  (3, '80%', 'Estabilización', 'Clínica de retinopatía a los 12 meses de manejo', 'Activity', 'verdeReti'),
  (4, '< 7 Días', 'Oportunidad', 'Meta para remisiones de alta prioridad', 'Zap', 'azulUCAD'),
  (5, '-10%', 'Eficiencia', 'Reducción anual en costo operativo por paciente tamizado mediante innovación', 'TrendingUp', 'verdeReti');

-- RLS
ALTER TABLE ucad_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE ucad_page_gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ucad_metas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ucad_page" ON ucad_page FOR SELECT USING (true);
CREATE POLICY "Public read ucad_page_gallery_items" ON ucad_page_gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read ucad_metas" ON ucad_metas FOR SELECT USING (true);

CREATE POLICY "Admin all ucad_page" ON ucad_page FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin all ucad_page_gallery_items" ON ucad_page_gallery_items FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin all ucad_metas" ON ucad_metas FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Bump content_versions (página ucad) al modificar
CREATE OR REPLACE FUNCTION bump_ucad_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO content_versions (page_slug, updated_at) VALUES ('ucad', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ucad_page_version AFTER INSERT OR UPDATE OR DELETE ON ucad_page FOR EACH ROW EXECUTE FUNCTION bump_ucad_version();
CREATE TRIGGER ucad_page_gallery_items_version AFTER INSERT OR UPDATE OR DELETE ON ucad_page_gallery_items FOR EACH ROW EXECUTE FUNCTION bump_ucad_version();
CREATE TRIGGER ucad_metas_version AFTER INSERT OR UPDATE OR DELETE ON ucad_metas FOR EACH ROW EXECUTE FUNCTION bump_ucad_version();
