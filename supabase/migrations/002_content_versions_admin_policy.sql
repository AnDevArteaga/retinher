-- El trigger bump_content_version() actualiza content_versions cuando un admin
-- modifica hero, doctor, etc. Esa escritura se ejecuta como el usuario actual (admin),
-- por lo que RLS aplica. Sin política de escritura, falla con:
-- "new row violates row-level security policy for table content_versions"

-- Permitir a admins INSERT y UPDATE en content_versions (el trigger hace INSERT ... ON CONFLICT DO UPDATE).
CREATE POLICY "Admin write content_versions" ON content_versions
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
