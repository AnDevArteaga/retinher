# Backup y migración — Panel Inicio (reorganización)

## Qué NO borrar

- **No elimines tablas** de Supabase. La reorganización solo cambia el panel (dash-retinher), no el esquema de la base de datos de forma destructiva.
- Las tablas que usa **Inicio** en la page y en el panel son las mismas; solo cambia cómo se editan (guardado por lote).

## Tablas que usa solo la página Inicio (home)

| Tabla | Uso en Inicio |
|-------|----------------|
| `hero_slides` | Slider del hero |
| `que_revisamos` | Sección Lente (qué revisamos): título/texto lente izq, título/texto lente der, CTA izq, CTA der |
| `sellos_reconocimientos` | Cabecera "Nuestros reconocimientos": titulo, subtitulo, cta |
| `sellos_reconocimientos_items` | Ítems: logo (imagen), titulo, subtitulo, descripcion |
| `ucad_section` | Bloque UCAD |
| `services` | Servicios |
| `doctor` | Sección doctor |
| `gallery` | Cabecera galería |
| `gallery_items` | Ítems galería (imagen/video, URL o subida) |
| `home_news` | Noticias |

**Nota:** En la **page** (Inicio), la sección "Nuestros reconocimientos" lee de `sellos_reconocimientos` + `sellos_reconocimientos_items`. El panel antiguo editaba `sellos_impacto` para "Reconocimientos"; el nuevo panel de Inicio edita **solo** `sellos_reconocimientos` / `sellos_reconocimientos_items` para esa pestaña.

## Tablas que ya NO edita el panel de Inicio (tras el cambio)

- `sellos_impacto` / `sellos_impacto_items` — No se gestionan en la pestaña Inicio (si se usan en otra página, se editarán allí).
- `vision_lab` — El test visual no se gestiona en el panel (queda fuera).
- `image_section` / `image_section_items` — No están en los tabs de Inicio.
- `about` — No está en los tabs de Inicio.
- `nav_links`, `whatsapp`, `footer` — Menú y pie: se pueden mover después a una vista "Global" o "Sedes"; por ahora no están en Inicio.

## Backup recomendado antes de tocar nada

1. **Supabase → SQL Editor**: ejecuta y guarda el resultado en un `.sql` o CSV:
   - `SELECT * FROM hero_slides ORDER BY slide_order;`
   - `SELECT * FROM que_revisamos;`
   - `SELECT * FROM sellos_reconocimientos;`
   - `SELECT * FROM sellos_reconocimientos_items ORDER BY orden;`
   - `SELECT * FROM ucad_section;`
   - `SELECT * FROM services ORDER BY section_order;`
   - `SELECT * FROM doctor;`
   - `SELECT * FROM gallery;`
   - `SELECT * FROM gallery_items ORDER BY item_order;`
   - `SELECT * FROM home_news ORDER BY fecha DESC;`

2. O exportar desde Supabase Dashboard (Table Editor) cada tabla a CSV.

## Cambios en la base de datos (migración nueva)

- **Solo se añade** una migración `010_que_revisamos_cta_lente_izquierdo.sql` que agrega columnas para el CTA del lente izquierdo en `que_revisamos`:
  - `cta_text_left`, `cta_link_type_left`, `cta_link_value_left`
- No se borran columnas ni tablas.

## Resumen para no romper lo actual

1. Haz backup de las tablas listadas arriba (export SQL o CSV).
2. Aplica la migración `010_que_revisamos_cta_lente_izquierdo.sql` en Supabase (SQL Editor o `supabase db push` si usas CLI).
3. El panel nuevo (dash-retinher) sustituye la página Inicio del dashboard: mismos datos, misma API, solo cambia la UI y que cada pestaña tiene **un solo botón Guardar** que guarda todo el lote de esa sección.
4. La page (page-retinher) puede necesitar un pequeño ajuste para leer el CTA del lente izquierdo y mostrarlo; por defecto no se rompe si las columnas son opcionales.
