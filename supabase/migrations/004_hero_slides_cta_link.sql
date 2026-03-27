-- CTA del hero: enlace a página (ruta) o a sección (id)
ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS cta_link_type TEXT NOT NULL DEFAULT 'section' CHECK (cta_link_type IN ('page', 'section')),
  ADD COLUMN IF NOT EXISTS cta_link_value TEXT;

-- Valor por defecto: sección vision-lab (test visual)
UPDATE hero_slides SET cta_link_type = 'section', cta_link_value = 'vision-lab' WHERE cta_link_value IS NULL;
