-- CTA opcional para el lente izquierdo (Sección Lente / Qué revisamos)
ALTER TABLE que_revisamos
  ADD COLUMN IF NOT EXISTS cta_text_left TEXT,
  ADD COLUMN IF NOT EXISTS cta_link_type_left TEXT CHECK (cta_link_type_left IN ('page', 'section')),
  ADD COLUMN IF NOT EXISTS cta_link_value_left TEXT;
