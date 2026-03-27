-- Contenido del lente derecho en "Qué revisamos" (misma animación, luego zoom al derecho)
ALTER TABLE que_revisamos
  ADD COLUMN IF NOT EXISTS title_right TEXT,
  ADD COLUMN IF NOT EXISTS text_right TEXT;

UPDATE que_revisamos
SET title_right = COALESCE(title_right, 'Y mucho más'),
    text_right  = COALESCE(text_right, 'En Retinher evaluamos tu visión de forma integral para ofrecerte el mejor cuidado.')
WHERE title_right IS NULL OR text_right IS NULL;
