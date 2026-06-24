-- Bucket de Supabase Storage para PDF y Word de la página Informes

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'informes',
  'informes',
  true,
  20971520,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lectura pública (descarga en la web)
CREATE POLICY "Public read informes storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'informes');

-- Solo admins pueden subir, actualizar y borrar
CREATE POLICY "Admin insert informes storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'informes' AND is_admin());

CREATE POLICY "Admin update informes storage"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'informes' AND is_admin())
WITH CHECK (bucket_id = 'informes' AND is_admin());

CREATE POLICY "Admin delete informes storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'informes' AND is_admin());
