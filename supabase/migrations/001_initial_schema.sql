-- ============================================
-- RETINHER - Schema Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- CONTENT VERSIONS (cache invalidation por página)
-- =====================
CREATE TABLE content_versions (
  page_slug TEXT PRIMARY KEY,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO content_versions (page_slug) VALUES
  ('home'),
  ('nosotros'),
  ('sedes'),
  ('ucad'),
  ('contacto');

-- =====================
-- HERO
-- =====================
CREATE TABLE hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline TEXT NOT NULL,
  subline TEXT NOT NULL,
  brand_line TEXT NOT NULL,
  cta TEXT NOT NULL,
  video_placeholder TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO hero (headline, subline, brand_line, cta, video_placeholder) VALUES
  ('La evolución de tu mirada', 'RETINHER', 'CENTRO DE ESPECIALIDADES', '¿Qué hacemos?',
   'https://cdn.pixabay.com/video/2017/12/05/13232-246463976_large.mp4');

-- =====================
-- DOCTOR
-- =====================
CREATE TABLE doctor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  imagen TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO doctor (nombre, titulo, descripcion, imagen) VALUES
  ('Dr. Hernando Henríquez', 'Fundador y líder visionario de Retinher S.A.S',
   'Como retinólogo, su práctica se centra en la excelencia clínica y la innovación tecnológica para combatir la ceguera evitable.',
   'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/IMG_1066.heic');

-- =====================
-- ABOUT
-- =====================
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  intro TEXT NOT NULL,
  purpose TEXT NOT NULL,
  cta_pdf TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO about (title, intro, purpose, cta_pdf) VALUES
  ('¿Qué hacemos?',
   '<strong>RETINHER S.A.S</strong> es una institución de servicios de salud en oftalmología, de mediana complejidad, en el departamento de Córdoba, que brinda atención segura en la prevención y tratamientos de enfermedades visuales para el usuario y su grupo familiar, en la prestación de servicios de consulta externa, cirugía y apoyo diagnóstico.',
   'Este propósito se logra con talento humano competente, infraestructura adecuada, tecnología avanzada, información veraz y atención oportuna.',
   'Descargar portafolio PDF');

-- =====================
-- SERVICES
-- =====================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  section_order INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cta TEXT NOT NULL,
  image TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO services (slug, section_order, title, description, cta, image) VALUES
  ('consultas', 1, 'Consultas oftalmológicas',
   'Habitualmente se mide su visión, se revisa el segmento anterior (córnea, iris, pupila, cristalino), toma de presión intraocular, revisión de nervio óptico y retina. Según la causa de consulta se realizan exploración complementaria de estrabismo, refracción y revisión de periferia retiniana.',
   'Reservar cita', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80&ar=16:9'),
  ('apoyo', 2, 'Apoyo terapéutico',
   'No es cirugía: se realiza en la consulta del oftalmólogo con una preparación muy sencilla tras el diagnóstico.',
   'Solicitar valoración', 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80&ar=16:9'),
  ('diagnostico', 3, 'Exámenes de diagnóstico',
   'El profesional examina su ojo con una lente de aumento especial para buscar señales de posibles patologías o daños en la retina.',
   'Solicitar valoración', 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80&ar=16:9'),
  ('cirugias', 4, 'Cirugías oftalmológicas',
   'Evaluación y procedimientos con tecnología de vanguardia para el cuidado de su visión.',
   'Solicitar valoración', 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80&ar=16:9');

-- =====================
-- NOSOTROS
-- =====================
CREATE TABLE nosotros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_image TEXT NOT NULL,
  title TEXT NOT NULL,
  intro TEXT NOT NULL,
  mision TEXT NOT NULL,
  vision TEXT NOT NULL,
  valores JSONB NOT NULL DEFAULT '[]',
  politica_calidad JSONB NOT NULL DEFAULT '[]',
  politica_seguridad JSONB NOT NULL DEFAULT '[]',
  service_groups JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO nosotros (hero_image, title, intro, mision, vision, valores, politica_calidad, politica_seguridad, service_groups) VALUES
  ('https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/reti.jpg', 'Nosotros',
   'RETINHER S.A.S cuenta con una gama de servicios de oftalmología en el área de la salud, para satisfacer las necesidades de nuestros usuarios y mejorar su calidad de vida. Brindamos servicios en:',
   'Somos una entidad que busca brindar una solución integral de servicios especializados en el área de oftalmología a la sociedad, mediante una atención segura, equipo humano competente, comprometidos con calidad en la atención y sentido social.',
   'Ser pioneros en la prevención y tratamiento de enfermedades visuales en el departamento y sus alrededores, mediante la investigación científica, calidad en la atención y seguridad de nuestros pacientes generando bienestar a nuestros colaboradores y comunidad.',
   '[{"left":"Responsabilidad","right":"Humanidad en el servicio"},{"left":"Respeto","right":"Ética"},{"left":"Calidad","right":"Compromiso"}]',
   '["En RETINHER S.A.S como IPS, estamos comprometidos con la prestación de servicios integrales de salud en oftalmología, enfocados en alcanzar la satisfacción de nuestros usuarios y familiares.","Contamos con un talento humano calificado y comprometido en brindar una atención segura, oportuna y con calidez humana, cumpliendo con los procesos establecidos mediante un sistema de gestión de la calidad, orientado al mejoramiento continuo y cumplimiento de los requisitos y reglamentación aplicables."]',
   '["RETINHER S.A.S – CENTRO DE ESPECIALIDADES, comprometida con la atención de sus usuarios y familiares, tiene como objetivo prevenir la ocurrencia de situaciones que afecten la seguridad del paciente, fomentando una cultura de identificación, reporte y gestión de los incidentes y eventos adversos que puedan ocurrir durante la atención,","mediante el trabajo en equipo e idoneidad profesional."]',
   '[{"id":"consultas","title":"Consultas externas en","items":["Oftalmología general.","Oftalmología pediátrica.","Glaucoma.","Retina.","Segmento anterior.","Córnea.","Oculoplastia y vías lagrimales.","Oncología oftalmológica.","Optometría.","Estrabología."]},{"id":"apoyo","title":"Apoyo terapéutico","items":["Yag láser.","Capsulotomías.","Iridotomías.","Argon láser.","Terapia Antiangiogénica intravítrea.","Desgarros retinales.","Cauterización de pestañas.","Vasos conjuntivales.","Rejilla macular."]},{"id":"diagnostico","title":"Exámenes de diagnóstico","items":["Biometría ocular.","Topografía corneal.","Paquimetría.","Campo visual computarizado.","Angiografía Fluoresceínica.","Ecografía ocular y de Órbita.","Fotografía de segmento anterior y fondo de ojo.","Tomografía Óptica Coherente (Macular y nervio óptico)."]},{"id":"cirugia","title":"Servicio de cirugía","items":["Resección de Pterigión.","Resección de Chalazión.","Cirugía de Catarata + implante de lente.","Tratamiento para el Queratocono.","Cirugía para glaucoma.","Corrección de estrabismo.","Cirugía plástica ocular, órbita y vía lagrimal.","Cirugía de Retina y vítreo.","Corrección de ectropión y/o entropión.","Blefaroplastia.","Evisceración.","Corrección de ptosis palpebral.","Cirugía para Glaucoma (Trabeculectomía).","Cirugía combinada de Catarata más Glaucoma.","Sondeo de vías lagrimales."]}]');

-- =====================
-- ECOSISTEMA IMPACTO
-- =====================
CREATE TABLE ecosistema_impacto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo_seccion TEXT NOT NULL,
  subtitulo_seccion TEXT NOT NULL,
  bloques JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ecosistema_impacto (titulo_seccion, subtitulo_seccion, bloques) VALUES
  ('Retinher Transforma', 'Ecosistema de impacto', '[
    {"id":"red-hospitales-verdes","titulo":"Red Global de Hospitales Verdes","sello":"verde","parrafos":["La institución avanza en su adhesión a la Red Global de Hospitales Verdes mediante una transición documentada en materia de gestión ambiental. Se ha pasado de 0 kg de material reciclado a 1.091 kg de reciclaje registrado a agosto de 2025, reflejando la implementación de flujos de separación en la fuente y circuitos de aprovechamiento.","Se ha adoptado una política Cero Papel en procesos administrativos y clínicos seleccionados, reduciendo la huella documental y alineando las operaciones con criterios de sostenibilidad. En paralelo, se trabaja en eficiencia energética y en la inclusión del Cambio Climático como variable de riesgo dentro del Plan de Emergencias y Contingencias, garantizando que la organización esté preparada ante eventos climáticos extremos."],"highlights":["0","1.091 kg","agosto de 2025","Cero Papel"]},
    {"id":"cultura-seguridad","titulo":"Cultura de la Seguridad (Bienestar)","sello":"azul","parrafos":["El modelo de bienestar y cultura de la seguridad se traduce en resultados medibles: reducción del 80% en la rotación del talento humano y 85,7% de satisfacción laboral. Se mantiene un cumplimiento del 100% en estándares de seguridad del paciente y condiciones de trabajo.","Este desempeño ha sido reconocido por la ARL SURA y por el programa Colombia Excelente bajo la Metodología REDER. Como espacio de cocreación y diálogo se ha implementado «El Café de la UCAD», favoreciendo el bienestar y la participación del equipo."],"highlights":["80%","85,7%","100%","ARL SURA","Colombia Excelente","Metodología REDER","El Café de la UCAD"]},
    {"id":"reti-5r-semillero","titulo":"Reti 5R y Semillero Verde","sello":"verde","parrafos":["El modelo de voluntariado Reti 5R y Semillero Verde educa a más de 100 niños en prácticas ambientales y de economía circular, integrando a las familias y a la comunidad en el territorio.","Se realizan jornadas de «Plogging» (recoger residuos mientras se camina o trota) y se promueve el «Reinado del Reciclaje», actividades que refuerzan el mensaje de las 5R (Reducir, Reutilizar, Reciclar, Recuperar, Repensar) y generan impacto visible en el entorno."],"highlights":["100","Plogging","Reinado del Reciclaje","5R"]},
    {"id":"alianzas-estrategicas","titulo":"Alianzas Estratégicas","sello":"morado","parrafos":["Las alianzas refuerzan el compromiso con la responsabilidad social: certificación de RSE con Fenalco Solidario, uso de la Unidad Móvil en zonas rurales para llevar atención oftalmológica a poblaciones de difícil acceso, y participación activa en el Cluster de Salud de la Cámara de Comercio.","Estas iniciativas amplían el alcance del programa Retinher Transforma y posicionan a la organización como actor clave en salud y sostenibilidad en la región."],"highlights":["Fenalco Solidario","Unidad Móvil","Cluster de Salud","Cámara de Comercio"]},
    {"id":"ucap-tv-obes","titulo":"Programa UCAP-TV-OBES","sello":"azul","parrafos":["El Programa UCAP-TV-OBES se centra en la Previsión de la Severidad en Pacientes Diabéticos para prevenir la ceguera por Retinopatía Diabética. Mediante tamizaje y clasificación de severidad se identifica a tiempo el riesgo de afectación visual irreversible.","La detección temprana y el seguimiento protocolizado permiten reducir la incidencia de ceguera evitable en población diabética, alineando tecnología, evidencia clínica y acceso a la atención especializada en retina."],"highlights":["Previsión de la Severidad","Retinopatía Diabética","ceguera"]}
  ]'::jsonb);

-- =====================
-- SELLOS RECONOCIMIENTOS (página Nosotros)
-- =====================
CREATE TABLE sellos_reconocimientos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  subtitulo TEXT NOT NULL,
  cta TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sellos_reconocimientos_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sellos_reconocimientos(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  titulo TEXT NOT NULL,
  subtitulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  logros TEXT,
  imagen TEXT NOT NULL,
  logo_placeholder TEXT,
  color TEXT NOT NULL DEFAULT '#1e3a5f',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO sellos_reconocimientos (titulo, subtitulo, cta) VALUES
  ('Nuestros reconocimientos', 'Sellos que respaldan nuestro compromiso con la excelencia, la sostenibilidad y la salud', 'Descubre cada reconocimiento');

INSERT INTO sellos_reconocimientos_items (section_id, slug, orden, titulo, subtitulo, descripcion, logros, imagen, logo_placeholder, color) 
SELECT id, 'fenalco', 1, 'Fenalco Solidario', 'Certificación de Responsabilidad Social Empresarial',
  'Certificación de RSE con Fenalco Solidario que avala nuestro compromiso con prácticas empresariales responsables, inclusión social y aporte al desarrollo territorial. Este sello reconoce el trabajo en cadena de valor ética y el impacto positivo en la comunidad.',
  'Implementación de programas de bienestar, alianzas con actores sociales y cumplimiento de estándares de transparencia y gestión responsable.',
  'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/LOGO%20CERTIFICADO%20COLOMBIA.png',
  'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/LOGO%20CERTIFICADO%20COLOMBIA.png', '#1e3a5f'
FROM sellos_reconocimientos LIMIT 1;
INSERT INTO sellos_reconocimientos_items (section_id, slug, orden, titulo, subtitulo, descripcion, logros, imagen, logo_placeholder, color)
SELECT id, 'camara-comercio', 2, 'Cluster de Salud', 'Cámara de Comercio',
  'Participación activa en el Cluster de Salud de la Cámara de Comercio, posicionando a RETINHER como actor estratégico en el ecosistema sanitario regional. Trabajamos en red para fortalecer la oferta de salud especializada y mejorar el acceso a la población.',
  'Vinculación con el ecosistema empresarial de salud, intercambio de buenas prácticas y generación de valor compartido en la región.',
  'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/LOGO%20CLUSTER%20EN%20SALUD.png',
  'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/LOGO%20CLUSTER%20EN%20SALUD.png', '#0f4c75'
FROM sellos_reconocimientos LIMIT 1;
INSERT INTO sellos_reconocimientos_items (section_id, slug, orden, titulo, subtitulo, descripcion, logros, imagen, logo_placeholder, color)
SELECT id, 'hospitales-verdes', 3, 'Red Global de Hospitales Verdes', 'Sostenibilidad en salud',
  'Adhesión a la Red Global de Hospitales Verdes: transición de 0 kg a 1.091 kg de reciclaje (agosto 2025), política Cero Papel, eficiencia energética e inclusión del Cambio Climático en el Plan de Emergencias. Gestión ambiental alineada con los Objetivos de Desarrollo Sostenible.',
  'Reducción de huella documental, circuitos de aprovechamiento de residuos y organización preparada ante eventos climáticos.',
  'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/RED%20DE%20HOSPITALES%20VERDES.png',
  'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/RED%20DE%20HOSPITALES%20VERDES.png', '#0d5c2e'
FROM sellos_reconocimientos LIMIT 1;
INSERT INTO sellos_reconocimientos_items (section_id, slug, orden, titulo, subtitulo, descripcion, logros, imagen, logo_placeholder, color)
SELECT id, 'reti-5r', 5, 'Reti 5R', 'Mascota del voluntariado ambiental',
  'Reti 5R y Semillero Verde: modelo de voluntariado que educa a más de 100 niños en las 5R (Reducir, Reutilizar, Reciclar, Recuperar, Repensar). Jornadas de Plogging y el Reinado del Reciclaje integran a familias y comunidad en el territorio.',
  'Más de 100 niños formados en economía circular, jornadas de Plogging y acciones visibles de impacto ambiental en la región.',
  'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/RETI%205R_page-00012.jpg',
  'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/RETI%205R_page-00012.jpg', '#0d5c2e'
FROM sellos_reconocimientos LIMIT 1;

-- =====================
-- SELLOS IMPACTO (Home)
-- =====================
CREATE TABLE sellos_impacto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  subtitulo TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sellos_impacto_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sellos_impacto(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  titulo TEXT NOT NULL,
  logo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  por_que TEXT,
  que_hicieron JSONB DEFAULT '[]',
  stats JSONB NOT NULL DEFAULT '[]',
  tags JSONB NOT NULL DEFAULT '[]',
  color TEXT NOT NULL DEFAULT '#2980B9',
  item_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO sellos_impacto (titulo, subtitulo) VALUES
  ('Sellos de Impacto', 'Evidencia de nuestra excelencia clínica y social.');

INSERT INTO sellos_impacto_items (section_id, slug, titulo, logo, descripcion, por_que, que_hicieron, stats, tags, color, item_order) 
SELECT id, 'fenalco', 'Fenalco Solidario (RSE)', 'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/LOGO%20CERTIFICADO%20COLOMBIA.png',
  'Certificación en Responsabilidad Social Empresarial y brigadas con Unidad Móvil en zonas rurales.',
  'Reconoce a empresas que integran la responsabilidad social como parte de su estrategia de negocio y generan impacto positivo en comunidades vulnerables.',
  '["Brigadas oftalmológicas con Unidad Móvil en más de 30 municipios de Córdoba.","Alianza con Fenalco para llevar salud visual a zonas rurales sin acceso.","85.7% de satisfacción en beneficiarios atendidos."]'::jsonb,
  '[{"valor":"85.7","unidad":"%","label":"Satisfacción"},{"valor":"30","unidad":"","label":"Municipios"}]'::jsonb,
  '["Social","Unidad Móvil","Córdoba"]'::jsonb, '#2980B9', 1
FROM sellos_impacto LIMIT 1;
INSERT INTO sellos_impacto_items (section_id, slug, titulo, logo, descripcion, por_que, que_hicieron, stats, tags, color, item_order)
SELECT id, 'hospitales-verdes', 'Hospitales Verdes y Saludables', 'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/RED%20DE%20HOSPITALES%20VERDES.png',
  'Lideramos la resiliencia climática en Córdoba con el programa Retinher Transforma.',
  'Acredita instituciones de salud que implementan prácticas sostenibles y resilientes ante el cambio climático, alineadas con los ODS.',
  '["1.091 kg de material reciclado en 2025 (de 0 kg antes del programa).","Política Cero Papel y digitalización de procesos.","Inclusión del Cambio Climático en el Plan de Emergencias.","Eficiencia energética y circuitos de aprovechamiento de residuos."]'::jsonb,
  '[{"valor":"1091","unidad":"kg","label":"Reciclaje 2025"},{"valor":"100","unidad":"%","label":"Cero Papel"}]'::jsonb,
  '["Sostenibilidad","MAITE","Clima"]'::jsonb, '#27AE60', 2
FROM sellos_impacto LIMIT 1;
INSERT INTO sellos_impacto_items (section_id, slug, titulo, logo, descripcion, por_que, que_hicieron, stats, tags, color, item_order)
SELECT id, 'cluster', 'Cluster de Salud', 'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/LOGO%20CLUSTER%20EN%20SALUD.png',
  'Participación en el Cluster de Salud de la Cámara de Comercio, posicionando a RETINHER como actor estratégico en el ecosistema sanitario regional.',
  'Vincula instituciones del sector salud para fortalecer la oferta regional, compartir buenas prácticas y articular proyectos conjuntos.',
  '["Participación activa en el Cluster de Salud de la Cámara de Comercio de Montería.","RETINHER como referente oftalmológico en la red regional.","Alianzas para mejorar la atención sanitaria en Córdoba."]'::jsonb,
  '[{"valor":"100","unidad":"%","label":"Vinculación"},{"valor":"1","unidad":"","label":"Red Regional"}]'::jsonb,
  '["Cámara de Comercio","Alianzas","Salud"]'::jsonb, '#0f4c75', 3
FROM sellos_impacto LIMIT 1;
INSERT INTO sellos_impacto_items (section_id, slug, titulo, logo, descripcion, por_que, que_hicieron, stats, tags, color, item_order)
SELECT id, 'reti', 'Reti 5R - Semillero Verde', 'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/RETI%205R_page-00012.jpg',
  'Educación ambiental y compromiso social con las familias y niños de nuestra comunidad. La mascota del voluntariado ambiental.',
  'Reti 5R es nuestra mascota que representa el compromiso con la educación ambiental y las 5R: Reducir, Reutilizar, Reciclar, Recuperar y Repensar.',
  '["Más de 100 niños formados en economía circular con el Semillero Verde.","Jornadas de Plogging (caminata + recolección de residuos) en comunidad.","Reinado del Reciclaje y actividades que integran familias y territorio."]'::jsonb,
  '[{"valor":"100","unidad":"+","label":"Niños Formados"},{"valor":"0","unidad":"costo","label":"Voluntariado"}]'::jsonb,
  '["Plogging","Comunidad","Futuro"]'::jsonb, '#F39C12', 4
FROM sellos_impacto LIMIT 1;

-- =====================
-- UCAD SECTION
-- =====================
CREATE TABLE ucad_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  subtitulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cta TEXT NOT NULL,
  logo TEXT NOT NULL,
  ruta TEXT NOT NULL DEFAULT '/ucad-te-veo-te-ves',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ucad_section (titulo, subtitulo, descripcion, cta, logo, ruta) VALUES
  ('UCAD Te Veo y Te Ves', 'Unidad Clínica de Alto Desempeño',
   'Programa de prevención de ceguera por diabetes en Córdoba. Tamizaje, clasificación de severidad y seguimiento protocolizado para reducir la retinopatía diabética evitable.',
   'Conocer programa', 'https://pub-80e71213da3845e29bca6894fbec4ec0.r2.dev/img16.jpg', '/ucad-te-veo-te-ves');

-- =====================
-- QUE REVISAMOS
-- =====================
CREATE TABLE que_revisamos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO que_revisamos (title, text) VALUES
  ('¿Qué revisamos?', 'Tanto los oftalmólogos como los optometristas pueden diagnosticar errores de refracción (como miopía) y recetar lentes correctivas (gafas o lentes de contacto). Los oftalmólogos pueden diagnosticar todos los trastornos que afectan al ojo.');

-- =====================
-- GALLERY
-- =====================
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID NOT NULL REFERENCES gallery(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('video', 'image')),
  src TEXT NOT NULL,
  caption TEXT NOT NULL,
  item_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO gallery (title, subtitle) VALUES ('The Gallery', 'Donde la precisión se convierte en arte');

INSERT INTO gallery_items (gallery_id, type, src, caption, item_order) 
SELECT id, 'video', 'https://cdn.pixabay.com/video/2022/10/31/145108-778764019_large.mp4', 'Atención y precisión', 1 FROM gallery LIMIT 1;
INSERT INTO gallery_items (gallery_id, type, src, caption, item_order)
SELECT id, 'image', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200', 'Tecnología de vanguardia', 2 FROM gallery LIMIT 1;
INSERT INTO gallery_items (gallery_id, type, src, caption, item_order)
SELECT id, 'video', 'https://cdn.pixabay.com/video/2023/11/09/178726-893012019_large.mp4', 'Cuidado de tu visión', 3 FROM gallery LIMIT 1;
INSERT INTO gallery_items (gallery_id, type, src, caption, item_order)
SELECT id, 'image', 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200', 'Espacios para ti', 4 FROM gallery LIMIT 1;
INSERT INTO gallery_items (gallery_id, type, src, caption, item_order)
SELECT id, 'video', 'https://cdn.pixabay.com/video/2022/03/10/112689-668459841_large.mp4', 'Resultados que hablan', 5 FROM gallery LIMIT 1;
INSERT INTO gallery_items (gallery_id, type, src, caption, item_order)
SELECT id, 'image', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200', 'En Córdoba', 6 FROM gallery LIMIT 1;

-- =====================
-- IMAGE SECTION
-- =====================
CREATE TABLE image_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE image_section_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES image_section(id) ON DELETE CASCADE,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  item_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO image_section (title, subtitle) VALUES ('Nuestra mirada', 'Instalaciones y equipo');

INSERT INTO image_section_items (section_id, src, alt, item_order) 
SELECT id, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800', 'Consulta', 1 FROM image_section LIMIT 1;
INSERT INTO image_section_items (section_id, src, alt, item_order) SELECT id, 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800', 'Equipo', 2 FROM image_section LIMIT 1;
INSERT INTO image_section_items (section_id, src, alt, item_order) SELECT id, 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800', 'Visión', 3 FROM image_section LIMIT 1;
INSERT INTO image_section_items (section_id, src, alt, item_order) SELECT id, 'https://images.unsplash.com/photo-1631217868264-2e2e4922f2b1?w=800', 'Tecnología', 4 FROM image_section LIMIT 1;
INSERT INTO image_section_items (section_id, src, alt, item_order) SELECT id, 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800', 'Atención', 5 FROM image_section LIMIT 1;
INSERT INTO image_section_items (section_id, src, alt, item_order) SELECT id, 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800', 'Precisión', 6 FROM image_section LIMIT 1;

-- =====================
-- VISION LAB
-- =====================
CREATE TABLE vision_lab (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  calibration TEXT NOT NULL,
  calibration_desc TEXT NOT NULL,
  test_instruction TEXT NOT NULL,
  feedback JSONB NOT NULL DEFAULT '{}',
  directions JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO vision_lab (title, tagline, calibration, calibration_desc, test_instruction, feedback, directions) VALUES
  ('Vision Lab', 'Descubre la agudeza de tu visión', 'Calibración', 'Mantén la mirada centrada. El escáner simula la lectura de tu ojo.',
   '¿Hacia dónde apuntan las patas de la E?', '{"correct":"Correcto","incorrect":"Inténtalo de nuevo"}'::jsonb, '["arriba","abajo","izquierda","derecha"]'::jsonb);

-- =====================
-- NAV LINKS
-- =====================
CREATE TABLE nav_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  href TEXT NOT NULL,
  label TEXT NOT NULL,
  link_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO nav_links (href, label, link_order) VALUES
  ('/', 'Inicio', 1),
  ('/nosotros', 'Nosotros', 2),
  ('/ucad-te-veo-te-ves', 'UCAD Te Veo y Te Ves', 3),
  ('/sedes', 'Sedes', 4),
  ('/contacto', 'Contacto', 5);

-- =====================
-- SEDES
-- =====================
CREATE TABLE sedes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  subtitulo TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sede_principal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sedes_id UUID NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  barrio TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  horario TEXT NOT NULL,
  mapa_embed_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO sedes (titulo, subtitulo) VALUES ('Nuestras Sedes', 'Te esperamos para cuidar tu visión');

INSERT INTO sede_principal (sedes_id, nombre, direccion, barrio, ciudad, horario, mapa_embed_url)
SELECT id, 'Sede Principal Montería', 'Cl. 27 #9-55', 'Barrio Centro', 'Montería, Córdoba', 'Lun - Vie',
  'https://maps.google.com/maps?q=Cl.+27+%239-55,+Monter%C3%ADa,+C%C3%B3rdoba,+Colombia&t=&z=16&ie=UTF8&iwloc=&output=embed'
FROM sedes LIMIT 1;

-- =====================
-- WHATSAPP
-- =====================
CREATE TABLE whatsapp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO whatsapp (numero, mensaje) VALUES ('573234850273', 'Hola, me gustaría obtener más información sobre sus servicios.');

-- =====================
-- FOOTER
-- =====================
CREATE TABLE footer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sede1 TEXT NOT NULL,
  sede2 TEXT NOT NULL,
  pbx TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  copyright TEXT NOT NULL,
  privacy TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO footer (sede1, sede2, pbx, email, city, copyright, privacy) VALUES
  ('Cra. 6 No. 29-58 Barrio Centro', 'Calle 28 # 9-80 Barrio Centro', '6047890016 – 3234850273 7890255 – 3234850273',
   'retinher sas@gmail.com', 'MONTERÍA – CÓRDOBA', 'Copyright © 2021 Retinher s.a.s / Todos los derechos reservados.', 'Política de privacidad');

-- =====================
-- TRIGGERS: actualizar content_versions al modificar datos
-- =====================
CREATE OR REPLACE FUNCTION bump_content_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Home: hero, doctor, about, services, sellos_impacto, ucad_section, que_revisamos, gallery, image_section, vision_lab, footer, whatsapp
  IF TG_TABLE_NAME IN ('hero', 'doctor', 'about', 'services', 'sellos_impacto', 'sellos_impacto_items', 'ucad_section', 'que_revisamos', 'gallery', 'gallery_items', 'image_section', 'image_section_items', 'vision_lab', 'footer', 'whatsapp', 'nav_links') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('home', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  -- Nosotros: nosotros, ecosistema_impacto, sellos_reconocimientos, sellos_reconocimientos_items
  IF TG_TABLE_NAME IN ('nosotros', 'ecosistema_impacto', 'sellos_reconocimientos', 'sellos_reconocimientos_items') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('nosotros', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  -- Sedes: sedes, sede_principal
  IF TG_TABLE_NAME IN ('sedes', 'sede_principal') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('sedes', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  -- UCAD page content could be in ucad_section (home) or separate; we bump home already
  -- Footer/nav are global
  IF TG_TABLE_NAME IN ('footer', 'nav_links', 'whatsapp') THEN
    INSERT INTO content_versions (page_slug, updated_at) VALUES ('home', NOW()) ON CONFLICT (page_slug) DO UPDATE SET updated_at = NOW();
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hero_version AFTER INSERT OR UPDATE OR DELETE ON hero FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER doctor_version AFTER INSERT OR UPDATE OR DELETE ON doctor FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER about_version AFTER INSERT OR UPDATE OR DELETE ON about FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER services_version AFTER INSERT OR UPDATE OR DELETE ON services FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER sellos_impacto_version AFTER INSERT OR UPDATE OR DELETE ON sellos_impacto FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER sellos_impacto_items_version AFTER INSERT OR UPDATE OR DELETE ON sellos_impacto_items FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER ucad_section_version AFTER INSERT OR UPDATE OR DELETE ON ucad_section FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER que_revisamos_version AFTER INSERT OR UPDATE OR DELETE ON que_revisamos FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER gallery_version AFTER INSERT OR UPDATE OR DELETE ON gallery FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER gallery_items_version AFTER INSERT OR UPDATE OR DELETE ON gallery_items FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER image_section_version AFTER INSERT OR UPDATE OR DELETE ON image_section FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER image_section_items_version AFTER INSERT OR UPDATE OR DELETE ON image_section_items FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER vision_lab_version AFTER INSERT OR UPDATE OR DELETE ON vision_lab FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER footer_version AFTER INSERT OR UPDATE OR DELETE ON footer FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER whatsapp_version AFTER INSERT OR UPDATE OR DELETE ON whatsapp FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER nav_links_version AFTER INSERT OR UPDATE OR DELETE ON nav_links FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER nosotros_version AFTER INSERT OR UPDATE OR DELETE ON nosotros FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER ecosistema_impacto_version AFTER INSERT OR UPDATE OR DELETE ON ecosistema_impacto FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER sellos_reconocimientos_version AFTER INSERT OR UPDATE OR DELETE ON sellos_reconocimientos FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER sellos_reconocimientos_items_version AFTER INSERT OR UPDATE OR DELETE ON sellos_reconocimientos_items FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER sedes_version AFTER INSERT OR UPDATE OR DELETE ON sedes FOR EACH ROW EXECUTE FUNCTION bump_content_version();
CREATE TRIGGER sede_principal_version AFTER INSERT OR UPDATE OR DELETE ON sede_principal FOR EACH ROW EXECUTE FUNCTION bump_content_version();

-- =====================
-- RLS: lectura pública para la web
-- =====================
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE nosotros ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosistema_impacto ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellos_reconocimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellos_reconocimientos_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellos_impacto ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellos_impacto_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ucad_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE que_revisamos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_section_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_lab ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sede_principal ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read all" ON hero FOR SELECT USING (true);
CREATE POLICY "Public read all" ON doctor FOR SELECT USING (true);
CREATE POLICY "Public read all" ON about FOR SELECT USING (true);
CREATE POLICY "Public read all" ON services FOR SELECT USING (true);
CREATE POLICY "Public read all" ON nosotros FOR SELECT USING (true);
CREATE POLICY "Public read all" ON ecosistema_impacto FOR SELECT USING (true);
CREATE POLICY "Public read all" ON sellos_reconocimientos FOR SELECT USING (true);
CREATE POLICY "Public read all" ON sellos_reconocimientos_items FOR SELECT USING (true);
CREATE POLICY "Public read all" ON sellos_impacto FOR SELECT USING (true);
CREATE POLICY "Public read all" ON sellos_impacto_items FOR SELECT USING (true);
CREATE POLICY "Public read all" ON ucad_section FOR SELECT USING (true);
CREATE POLICY "Public read all" ON que_revisamos FOR SELECT USING (true);
CREATE POLICY "Public read all" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read all" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read all" ON image_section FOR SELECT USING (true);
CREATE POLICY "Public read all" ON image_section_items FOR SELECT USING (true);
CREATE POLICY "Public read all" ON vision_lab FOR SELECT USING (true);
CREATE POLICY "Public read all" ON nav_links FOR SELECT USING (true);
CREATE POLICY "Public read all" ON sedes FOR SELECT USING (true);
CREATE POLICY "Public read all" ON sede_principal FOR SELECT USING (true);
CREATE POLICY "Public read all" ON whatsapp FOR SELECT USING (true);
CREATE POLICY "Public read all" ON footer FOR SELECT USING (true);
CREATE POLICY "Public read all" ON content_versions FOR SELECT USING (true);

-- =====================
-- ADMINS (dashboard: solo estos usuarios pueden escribir)
-- =====================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER;

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins read admins" ON admins FOR SELECT USING (is_admin());

-- Después de crear tu primer usuario en Supabase Auth, insértalo aquí para darle acceso al dashboard:
-- INSERT INTO admins (user_id) VALUES ('uuid-del-usuario-auth');

-- Políticas de escritura para admins (dashboard)
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['hero','doctor','about','services','nosotros','ecosistema_impacto','sellos_reconocimientos','sellos_reconocimientos_items','sellos_impacto','sellos_impacto_items','ucad_section','que_revisamos','gallery','gallery_items','image_section','image_section_items','vision_lab','nav_links','sedes','sede_principal','whatsapp','footer'])
  LOOP
    EXECUTE format('CREATE POLICY "Admin all %s" ON %I FOR ALL USING (is_admin())', t, t);
  END LOOP;
END $$;

-- content_versions solo lectura para todos; el trigger lo actualiza (runs as owner)
-- Admins no necesitan escribir en content_versions.
