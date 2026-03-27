-- Agregar campos editables a la tabla ucad_page
ALTER TABLE ucad_page
  ADD COLUMN IF NOT EXISTS infografia_url TEXT DEFAULT '/infografia.jpeg',
  ADD COLUMN IF NOT EXISTS alcance_titulo TEXT DEFAULT 'Zona de Influencia',
  ADD COLUMN IF NOT EXISTS alcance_texto TEXT DEFAULT 'Departamento de Córdoba (Sede principal en Montería + Unidad Móvil).',
  ADD COLUMN IF NOT EXISTS poblacion_titulo TEXT DEFAULT 'Grupos Prioritarios',
  ADD COLUMN IF NOT EXISTS poblacion_texto TEXT DEFAULT 'Pacientes Diabéticos Tipo I y II
Gestantes con diabetes (Alto riesgo de progresión)
Pacientes sin tamizaje reciente (>1 año sin fondo de ojo)';
