# 🎬 APIC PERÚ - Plataforma Audiovisual Profesional

**Sitio web comercial de la empresa audiovisual más grande de Perú, construido con Next.js 16 y React 19**

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura Técnica](#arquitectura-técnica)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Funcionalidades Principales](#funcionalidades-principales)
5. [Guía de Administración](#guía-de-administración)
6. [Optimización y Despliegue](#optimización-y-despliegue)

---

## 📌 Descripción General

**APIC PERÚ** es una plataforma de e-commerce audiovisual que permite a usuarios navegar un catálogo de equipos profesionales para cine y eventos, crear listas de cotización personalizadas, y contactar directamente con la empresa a través de WhatsApp.

### Características Principales
- **Carrusel de campañas estacionales** con autoplay inteligente (pausa fuera de viewport)
- **Catálogo unificado** de 9 productos divididos en 2 categorías profesionales
- **Galería de imágenes interactiva** con lente de zoom magnifier (escala 2x)
- **Carrito persistente global** con sincronización cross-page via localStorage
- **Sistema de cotización por WhatsApp** con mensaje pre-formateado
- **Interfaz responsive** optimizada para desktop, tablet y mobile
- **Footer 4-columnas corporativo** con redes sociales oficial y contacto directo

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
Frontend Framework:  Next.js 16 (App Router)
UI Library:          React 19.2
Styling:             Tailwind CSS v4 (inline + @theme variables)
State Management:    React Hooks (localStorage persistence)
Icons:               Lucide React (20+ icons)
Browser APIs:        IntersectionObserver, requestAnimationFrame
Deployment:          Vercel (auto-scaling, CDN global)
```

### Stack de Compilación

```
JavaScript/TypeScript: ES2020+
Package Manager:       pnpm (lockfile determinista)
Module System:         ES Modules (import/export)
Bundler:              Vercel Turbopack (default Next.js 16)
CSS Processing:       PostCSS + Tailwind JIT compiler
```

---

## 📁 Estructura de Carpetas

```
.
├── app/
│   ├── page.tsx                    # Página principal (Hero + Catálogos)
│   ├── layout.tsx                  # Layout raíz con metadatos SEO
│   ├── config.ts                   # 🎯 ARCHIVO MAESTRO (datos centralizados)
│   ├── globals.css                 # Variables Tailwind v4 + estilos globales
│   ├── combos/
│   │   └── [id]/
│   │       └── page.tsx            # Página de combo estacional con detalles
│   └── productos/
│       └── [id]/
│           └── page.tsx            # Página de producto con zoom y cotización
├── components/
│   └── ui/                         # Componentes shadcn/ui (button, etc)
├── public/
│   └── imagenes/                   # Galerías de productos
├── README.md                        # Este archivo
├── CONFIGURACION_CLIENTE.md        # Guía para no técnicos
├── next.config.mjs                 # Configuración Next.js
├── tsconfig.json                   # Configuración TypeScript
└── package.json                    # Dependencias del proyecto
```

---

## 🚀 Funcionalidades Principales

### 1. Carrusel de Campañas Estacionales (Home)

**Archivo:** `app/page.tsx` (líneas 77-105)

```typescript
// IntersectionObserver detecta si hero está visible
// Si está fuera del viewport, el carrusel pausa automáticamente
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsHeroVisible(entry.isIntersecting),
    { threshold: 0.1 }
  )
  observer.observe(heroRef.current)
  return () => observer.unobserve(heroRef.current)
}, [])

// Autoplay: Avanza cada 5 segundos SOLO si hero es visible
useEffect(() => {
  if (!isHeroVisible) return // Freeze cuando está fuera de viewport
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % temporadas_carrusel.length)
  }, 5000)
  return () => clearInterval(interval)
}, [isHeroVisible, temporadas_carrusel.length])
```

**Comportamiento:**
- ✅ Autoplay en viewport (5 segundos por slide)
- ✅ Pausa automática cuando usuario scrollea fuera del hero
- ✅ Reanuda al volver al hero
- ✅ Botones manuales para navegación
- ✅ Indicadores paginados para saltar a cualquier slide

---

### 2. Carrito Persistente Global

**Archivo:** `app/page.tsx`, `app/combos/[id]/page.tsx`, `app/productos/[id]/page.tsx`

```typescript
// On Mount: Cargar cart desde localStorage
useEffect(() => {
  const storedCart = localStorage.getItem('apic_cart')
  if (storedCart) {
    try { setSelectedItems(JSON.parse(storedCart)) }
    catch (e) { console.log('[v0] Error:', e) }
  }
}, [])

// On Change: Guardar cart a localStorage
useEffect(() => {
  localStorage.setItem('apic_cart', JSON.stringify(selectedItems))
}, [selectedItems])

// Toggle: Añadir o quitar producto de lista
const toggleProductInList = (productName: string) => {
  setSelectedItems(prev =>
    prev.includes(productName)
      ? prev.filter(item => item !== productName)
      : [...prev, productName]
  )
}
```

**Sincronización Cross-Page:**
- ✅ localStorage automatiza persistencia (SSD del navegador)
- ✅ Todos los 3 productos en página home actualizan contador "Mi Lista (X)"
- ✅ Navegar a `/productos/[id]` sincroniza cart automáticamente
- ✅ Volver atrás mantiene items seleccionados
- ✅ Header siempre muestra contador actualizado

---

### 3. Galería con Lente Magnifier (Zoom 2x)

**Archivo:** `app/productos/[id]/page.tsx` (líneas 150-220)

```typescript
// Mouse tracking coordinates
const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect()
  setZoomPos({
    x: ((e.clientX - rect.left) / rect.width) * 100,
    y: ((e.clientY - rect.top) / rect.height) * 100,
  })
}

// Aplicar zoom magnifier con scale(2)
<div
  onMouseMove={handleImageMouseMove}
  onMouseEnter={() => setIsZoomed(true)}
  onMouseLeave={() => setIsZoomed(false)}
  className="relative w-full h-96 overflow-hidden"
  style={{
    backgroundImage: `url(${activeImage})`,
    backgroundPosition: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center',
    backgroundSize: isZoomed ? '200%' : 'cover',
    backgroundRepeat: 'no-repeat',
    transition: 'background-size 0.3s ease'
  }}
/>
```

**Comportamiento:**
- ✅ Movimiento del mouse controla punto de zoom en tiempo real
- ✅ Scale(2x) magnifica imagen debajo del cursor
- ✅ Transición suave on/off (0.3s easing)
- ✅ Galerías ilimitadas (array de URLs en config)
- ✅ Thumbnails clicables para cambiar imagen activa

---

### 4. Cotización Unificada por WhatsApp

**Archivo:** `app/productos/[id]/page.tsx` (líneas 80-95)

```typescript
// Pre-fill mensaje con detalles del producto
const handleWhatsAppQuote = () => {
  const message = `Hola APIC PERÚ, me interesa cotizar: "${product.nombre}" (SKU: ${product.sku}). Mi lista completa: ${selectedItems.join(', ')}`
  const whatsappURL = `https://wa.me/${numero_whatsapp.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`
  window.open(whatsappURL, '_blank')
}
```

**Flujo Cotización:**
1. Usuario agrega productos a "Mi Lista" (botón turquesa)
2. Abre modal o página de producto
3. Haz clic "Cotizar por WhatsApp"
4. Se abre chat de WhatsApp con:
   - ✅ Nombre del producto
   - ✅ SKU técnico
   - ✅ Lista completa de items seleccionados
   - ✅ Contacto whatsapp pre-relleno desde config

---

### 5. Enrutamiento Dinámico Multi-página

**Estructura:**
```
/                                    # Home (hero + 9 productos)
/combos/[id]                        # Página combo estacional detallada
/productos/[id]                     # Página producto individual detallada
```

**Flujo de Navegación:**
- ✅ Cards en home redirigen a `/productos/[id]`
- ✅ Combos especiales redirigen a `/combos/[id]`
- ✅ Botones "Volver" usan `router.back()`
- ✅ Header logo siempre vuelve a home con `router.push('/')`

---

## 📘 Guía de Administración

### Para Cambiar Colores Corporativos

**Archivo:** `app/config.ts` (líneas 8-12)

```typescript
export const THEME_CONFIG = {
  color_primario: '#039dbf',      // Turquesa (botones, tabs)
  color_hover: '#02829e',         // Más oscuro (hover state)
  color_fondo_tarjetas: '#f9fafb' // Gris claro (card backgrounds)
}
```

**Paletas predefinidas:**
- Azul marino: `#1e3a8a` (hover: `#1e40af`)
- Rojo corporativo: `#dc2626` (hover: `#991b1b`)
- Verde profesional: `#059669` (hover: `#047857`)

---

### Para Agregar un Nuevo Producto

**Archivo:** `app/config.ts` → `catalogo_eventos` o `catalogo_cine`

```typescript
{
  id: 10,                          // ID único (siguiente número)
  nombre: 'Mi Nuevo Equipo',
  sku: 'MNE-EVT-010',             // Código único
  categoria: 'Equipos para Eventos',
  especificaciones: ['Spec 1', 'Spec 2', 'Spec 3'],
  descripcion: 'Descripción corta (1-2 líneas)',
  descripcion_larga: 'Descripción extensa para página producto',
  imagenes_galeria: ['url1.jpg', 'url2.jpg', 'url3.jpg', 'url4.jpg'],
  sobre_la_marca: 'Texto empresa...',
  ficha_tecnica: [
    { label: 'Propiedad 1', valor: 'Valor 1' },
    { label: 'Propiedad 2', valor: 'Valor 2' }
  ],
  garantias: [
    { pregunta: '¿Cubre defectos?', respuesta: 'SÍ' },
    { pregunta: '¿Cubre accidentes?', respuesta: 'NO' }
  ]
}
```

**Cambios automáticos:**
- ✅ Aparece en home con card nueva
- ✅ Accesible vía `/productos/10`
- ✅ Sincroniza con búsqueda modal
- ✅ Soporta zoom magnifier en galería

---

### Para Crear una Nueva Campaña Estacional

**Archivo:** `app/config.ts` → `temporadas_carrusel`

```typescript
{
  evento_id: 5,
  nombre_evento: 'Black Friday 2026',
  titulo_carrusel: 'Black Friday Tecnológico',
  subtitulo_carrusel: 'Descuentos audiovisuales únicos',
  imagen_carrusel: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
  imagen_url: 'https://...',
  nombre_pack: 'Pack Black Friday Extremo',
  descripcion_pack: 'Promoción especial con...',
  equipos_incluidos: ['Rieles de Enfoque Pro', 'Fotocabina', 'Domos LED']
}
```

**Resultado:**
- ✅ Aparece en carrusel home con nuevo slide
- ✅ Accesible vía `/combos/[evento_id]`
- ✅ Botón "Seleccionar todo combo" añade todos los equipos a lista
- ✅ Autoplay integrado (5 segundos, pausa fuera viewport)

---

## 📊 Optimización y Despliegue

### Antes de Desplegar a Producción

**1. Validar Assets (Reducción de peso)**
```bash
# Comprimir imágenes (máximo 300KB por imagen)
# Usar WebP si es posible
# Verificar URLs externas están accesibles
```

**2. Auditoría SEO**
- ✅ Verificar `<title>` y `<meta description>` en `layout.tsx`
- ✅ Confirmar `og:image` para redes sociales
- ✅ Validar canonical URLs

**3. Performance Lighthouse**
```
Performance:  > 90
Accessibility: > 95
Best Practices: > 90
SEO:          > 95
```

**4. Pruebas Funcionales**
- ✅ Carrusel autoplay (on/off con scroll)
- ✅ Carrito persistente (agregar → navegar → volver)
- ✅ Zoom magnifier (todos los productos)
- ✅ WhatsApp preformulado (mensaje completo)
- ✅ Responsive (mobile 375px, tablet 768px, desktop 1920px)

---

### Despliegue en Vercel

**Conectar GitHub Repository:**
```bash
1. Push todos los cambios a main
2. Vercel detecta automáticamente
3. Build (2-3 minutos)
4. Deploy a URL pública
```

**CI/CD Automático:**
- ✅ Cada push a `main` triggerean nueva build
- ✅ Revert instantáneo si algo falla
- ✅ Preview URLs para ramas de feature

**Variables de Entorno** (si las necesitas):
- Agregar en Vercel Dashboard → Settings → Environment Variables
- Referencias en código: `process.env.NEXT_PUBLIC_*`

---

## 🔧 Comandos Útiles

```bash
# Desarrollo local
pnpm dev                    # Start dev server en http://localhost:3000

# Compilación producción
pnpm build                  # Bundlea para Vercel

# Linting
pnpm lint                   # ESLint + TypeScript check

# Type checking
pnpm tsc --noEmit          # Verifica tipos sin generar JS
```

---

## 📞 Soporte y Contacto

**Para problemas técnicos:**
- Email: `info@apicperu.com`
- WhatsApp: `+51 994 942 994`
- GitHub Issues: Documentar bug + screenshot

**Documentación adicional:**
- `CONFIGURACION_CLIENTE.md` → Guía para no técnicos
- `app/config.ts` → Comentarios inline en el código
- `IMPLEMENTACION_RESUMEN.md` → Técnicas de desarrollo

---

## 📄 Licencia

Proyecto propietario de **APIC PERÚ**. Todos los derechos reservados.

---

**Última actualización:** Agosto 2026 | **Versión:** 1.0 Estable
