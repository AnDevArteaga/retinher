# Documento Oficial de Entrega de Plataforma Tecnológica: Retinher

## 1. Introducción
El presente documento tiene como objetivo oficializar la entrega del ecosistema digital desarrollado para **Retinher**, el cual se compone de dos sistemas independientes pero totalmente integrados:
1. **La Plataforma Web Pública (Página principal)**: El entorno visual interactivo diseñado para los pacientes, usuarios y socios estratégicos. Está estructurado bajo un enfoque de alto rendimiento, diseño responsivo (adaptable a dispositivos móviles) y navegación fluida a través de animaciones avanzadas.
2. **El Sistema de Gestión de Contenidos (Dashboard Administrativo)**: Una herramienta de administración privada y segura que permite al equipo de Retinher controlar, actualizar y modificar el contenido de la plataforma pública en tiempo real, sin requerir intervención técnica ni conocimientos de programación.

---

## 2. Infraestructura y Tecnologías Empleadas
Para garantizar la estabilidad, escalabilidad y seguridad de la plataforma, se han implementado herramientas de grado empresarial:
- **Frontend (Interfaz Visual)**: Construido sobre el ecosistema de **React.js**. Se implementó una arquitectura de una sola página (Single Page Application) que evita las recargas de pantalla al navegar. Las animaciones están controladas por **GSAP**, lo que permite un recorrido interactivo de alto impacto visual sin penalizar el rendimiento del sistema.
- **Backend y Base de Datos**: Respaldado por **Supabase**, el cual gestiona una base de datos relacional (PostgreSQL). Este entorno administra de forma segura toda la información textual de la página web y gestiona el sistema de inicio de sesión cifrado del administrador.
- **Almacenamiento de Archivos (Storage)**: Se integró **Cloudflare R2** para el alojamiento de recursos multimedia (imágenes, fotografías, logos, infografías y videos). Este sistema garantiza que los archivos pesados no saturen el servidor principal, ofreciendo tiempos de carga ultrarrápidos a nivel global.

---

## 3. Especificación de Funcionalidades por Sistema

### 3.1. Funcionalidades de la Plataforma Web Pública
El sitio web cuenta con un diseño modular que agrupa la información estratégica de la empresa:

- **Módulo de Inicio (Home)**:
  - **Banner Principal Interactivo**: Carrusel de bienvenida con capacidad para múltiples mensajes y botones de llamado a la acción (CTAs).
  - **Sección Oftalmológica (Gafas)**: Un área interactiva con desplazamiento sincronizado que explica los servicios principales.
  - **Reconocimientos y Sellos**: Carrusel dinámico de marcas y certificaciones obtenidas por la empresa.
  - **Accesos Rápidos**: Tarjetas informativas que derivan a los usuarios hacia los servicios principales.
  - **Perfil del Especialista**: Bloque de presentación de credenciales médicas.
  - **Galería Visual**: Sistema de visualización de fotografías institucionales y de las instalaciones.
  - **Sección de Noticias**: Panel de actualidad donde se listan las últimas novedades con fecha, título, descripción y contenido multimedia.

- **Módulo Corporativo (Nosotros)**:
  - Despliegue de la identidad corporativa: Misión, visión y valores.
  - Presentación del "Ecosistema de Impacto", estructurado mediante bloques descriptivos.
  - Publicación de las Políticas de Calidad y Seguridad del paciente.

- **Módulo de Sedes**:
  - Catálogo interactivo de las sucursales (ej. Montería).
  - Integración de direcciones, horarios de atención y mapas de ubicación interactivos (Google Maps Embeds).

- **Módulo "Retinher Transforma"**:
  - Apartado dedicado al programa de impacto social.
  - Descripción de pilares fundamentales, cifras de impacto e indicadores clave de gestión respaldados por evidencia gráfica.

- **Módulo "UCAD Te Veo y Te Ves"**:
  - Presentación estructurada del programa de prevención.
  - Visualización interactiva de infografías del flujo de atención.
  - Detalle del alcance y la población objetivo del programa.
  - Panel de Metas e Indicadores de Éxito, representados con iconos y porcentajes de cumplimiento.

- **Módulo Global (Navegación y Pie de Página)**:
  - Menú de navegación superior fijo.
  - Pie de página (Footer) con información de contacto dinámico (líneas de PBX, WhatsApp, correos electrónicos corporativos, derechos de autor).
  - Botón flotante integrado para redirección directa al WhatsApp corporativo.

---

### 3.2. Funcionalidades del Dashboard Administrativo
El panel de control otorga autonomía total a Retinher sobre la plataforma. Sus capacidades principales son:

- **Autenticación Segura**: Sistema de acceso restringido mediante credenciales únicas, garantizando que solo personal autorizado pueda realizar modificaciones.
- **Sincronización en Tiempo Real**: Toda modificación guardada en el panel ejecuta una orden de actualización que refresca la memoria caché de la página web principal, logrando que los cambios sean públicos casi de inmediato.
- **Gestor de Enlaces Dinámicos**: Los botones de la web (CTAs) pueden ser redirigidos fácilmente. El administrador puede elegir de una lista si desea que un botón lleve al usuario a una página distinta (ej. "Sedes") o si prefiere que la pantalla se deslice suavemente hacia una sección específica dentro de la misma página (ej. "Nuestros Servicios").
- **Motor de Carga de Medios Automático**: Las secciones que requieren imágenes incluyen un componente dedicado que permite subir archivos desde la computadora. El sistema toma el archivo, lo procesa, lo envía directamente al servidor de Cloudflare R2 y guarda el enlace público sin que el usuario deba realizar pasos intermedios.

---

## 4. Guía de Operación: Dashboard de Administración

El proceso de actualización de contenidos es estandarizado y transversal en todo el sistema. 

### Pasos para actualizar contenido:
1. **Acceso al sistema**: Ingrese la URL del panel administrativo, seguido de su usuario y contraseña (credenciales proporcionadas en la sección 5).
2. **Selección del módulo**: Utilice el menú lateral izquierdo para elegir la sección de la página que desea intervenir (Inicio, Nosotros, Sedes, UCAD, etc.).
3. **Navegación por pestañas**: Cada módulo está dividido en pestañas superiores que categorizan los bloques visuales de la web.
4. **Edición de Texto**: Ubique los campos de formulario (títulos, descripciones largas, etiquetas) y sobrescriba la información requerida.
5. **Gestión de Listas**: En apartados como la Galería o las Noticias, el sistema permite crear nuevos elementos mediante botones de adición ("+ Añadir"), así como botones de eliminación ("Eliminar") para remover registros obsoletos.
6. **Confirmación**: Presione el botón principal de "Guardar" ubicado al final de cada sección. El sistema validará la transacción y mostrará un indicador de éxito.

---

## 5. Guía de Operación: Cloudflare R2 (Gestión de Archivos en la Nube)

Cloudflare R2 constituye el repositorio central de almacenamiento ("Bucket"). Aunque la carga de archivos está automatizada a través del Dashboard, el acceso directo a Cloudflare permite realizar auditorías de almacenamiento o tareas de mantenimiento estructural.

### Procedimiento de acceso y gestión:
1. Ingrese a **https://dash.cloudflare.com/** utilizando las credenciales corporativas correspondientes.
2. En la interfaz principal, localice el menú lateral izquierdo y seleccione el apartado **R2 Object Storage**.
3. En la pantalla emergente, diríjase a la sección **Overview** (Resumen).
4. El sistema listará los contenedores de datos disponibles. Seleccione el Bucket asignado al proyecto (Ej: *retinher-bucket*).
5. **Panel de control del Bucket**: 
   - La interfaz mostrará una estructura de carpetas (directorios como `hero`, `ucad`, `news`, `sellos`) donde se organizan los archivos.
   - El administrador podrá explorar las carpetas, visualizar detalles de los archivos, obtener URLs públicas de los recursos, o proceder a la eliminación manual de material en desuso para optimizar el almacenamiento.

---

## 6. Credenciales de Acceso al Sistema

*(Por razones de seguridad, se solicita al responsable de la plataforma actualizar los valores entre corchetes antes de la distribución final de este documento).*

### 6.1. Acceso al Panel de Administración (Dashboard)
- **URL de Acceso**: [Ingresar URL del entorno administrativo]
- **Usuario Registrado**: [Ingresar el correo del administrador]
- **Contraseña de Acceso**: [Ingresar contraseña]

### 6.2. Acceso al Almacenamiento Cloudflare R2
- **URL de Acceso**: https://dash.cloudflare.com/
- **Usuario Registrado**: [Ingresar correo vinculado a Cloudflare]
- **Contraseña de Acceso**: [Ingresar contraseña de Cloudflare]

---
*Fin del Documento.*