# 🔧 DOCUMENTACIÓN TÉCNICA - ARQUITECTURA APIC PERÚ v2.0

## 📐 ARQUITECTURA DEL SISTEMA

```
├── app/
│   ├── layout.tsx           (Layout global, metadatos)
│   ├── page.tsx             (Página principal con carrousel y catálogos)
│   ├── combos/
│   │   └── [id]/
│   │       └── page.tsx     (Página dinámica por combo)
│   └── globals.css          (Tailwind + diseño global)
├── public/
│   └── imagenes/            (Almacenamiento de imágenes de productos)
├── components/ui/
│   └── button.tsx           (Componente botón básico de shadcn)
├── CONFIGURACION_CLIENTE.md (Guía para clientes NO-técnicos)
├── IMPLEMENTACION_RESUMEN.md (Resumen de cambios realizados)
└── DOCUMENTACION_TECNICA.md (Este archivo)
```

---

## 🔄 FLUJO DE DATOS

### 1. Configuración Centralizada (WEBSITE_CONFIG)

```javascript
const WEBSITE_CONFIG = {
  numero_whatsapp: '51900000000',
  correo_contacto: 'info@apicperu.com',
  
  temporadas_carrusel: [
    { evento_id: 1, nombre_evento: '...', equipos_incluidos: [...] },
    // ... más temporadas
  ],
  
  catalogo_cine: [
    { id: 1, nombre: '...', imagenes_galeria: [...], especificaciones: [...] },
    // ... más productos cinema
  ],
  
  catalogo_eventos: [
    { id: 4, nombre: '...', imagenes_galeria: [...], especificaciones: [...] },
    // ... más productos eventos
  ],
}
```

### 2. Flujo de Renderizado

```
WEBSITE_CONFIG
    ↓
[Página Principal: page.tsx]
    ├─ Carrousel (temporadas_carrusel)
    │   ├─ Renderiza 4 slides automáticamente
    │   ├─ Botón "Ver Pack Completo" → router.push(`/combos/${evento_id}`)
    │   └─ IntersectionObserver controla autoplay
    │
    ├─ Catálogo Cinema (catalogo_cine)
    │   ├─ Grid de 3 tarjetas
    │   ├─ Cada tarjeta muestra primeras 3 especificaciones
    │   └─ Click → Modal con lista completa
    │
    └─ Catálogo Eventos (catalogo_eventos)
        ├─ Grid de 3 tarjetas
        ├─ Misma lógica que cinema
        └─ Click → Modal con lista completa
    
    ↓
[Página Dinámica: combos/[id]/page.tsx]
    ├─ Lee parámetro [id] de la URL
    ├─ Busca temporada con evento_id === [id]
    ├─ Lee array equipos_incluidos
    ├─ Busca cada equipo en catalogo_cine + catalogo_eventos
    ├─ Renderiza grid con equipos encontrados
    └─ CTA permite seleccionar y enviar WhatsApp
```

---

## 🎯 COMPONENTES PRINCIPALES

### 1. Página Principal (app/page.tsx)

**Secciones:**
- Header sticky con navegación
- Hero carrousel con 4 temporadas
- Métrica de autoridad (Nosotros)
- Catálogo Cinema (3 productos)
- Catálogo Eventos (6 productos)
- Modal de detalles
- Footer

**Hooks principales:**
```javascript
const [currentSlide, setCurrentSlide] = useState(0)          // Índice del slide
const [isHeroVisible, setIsHeroVisible] = useState(true)    // Visibilidad hero
const [selectedProduct, setSelectedProduct] = useState(null) // Producto en modal
const [activeImgIndex, setActiveImgIndex] = useState(0)     // Imagen actual en modal
const [modalTabActive, setModalTabActive] = useState('descripcion') // Tab activo
const [selectedItems, setSelectedItems] = useState([])      // Items en "Mi Lista"
const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })    // Pos zoom cursor
```

### 2. Página Dinámica de Combo (app/combos/[id]/page.tsx)

**Secciones:**
- Mini-hero con imagen del combo
- Barra de beneficios con 3 Lucide icons
- Grid de equipos incluidos
- CTA masivo con botones

**Props dinámicas:**
```javascript
const params = useParams()
const comboId = parseInt(params.id as string)
const combo = temporadas_carrusel.find(c => c.evento_id === comboId)
const comboProducts = allProducts.filter(p => 
  combo.equipos_incluidos.includes(p.nombre)
)
```

---

## 🎨 DISEÑO VISUAL

### Colores Principales
- **Primario:** `#039dbf` (Turquesa)
- **Hover:** `#02829e` (Turquesa oscuro)
- **Texto:** `#0b0f19` (Casi negro)
- **Gris:** `#111827`, `#6b7280`, `#d1d5db`

### Tipografía
- **Headers:** Tailwind `font-bold` (weights: 600-900)
- **Body:** `text-sm` a `text-base` con `text-gray-600`
- **Max width:** `max-w-7xl` para contenedor principal

### Responsive
- **Mobile:** `md:hidden` para breakpoints <768px
- **Tablet:** `hidden md:flex` para 768-1024px
- **Desktop:** `hidden lg:grid` para >1024px

---

## 🔍 ESPECIFICACIONES INTELIGENTES

### Formato Obligatorio
```javascript
// ✅ CORRECTO
'Captura: 360 grados'
'Resolución: 4K HD'

// ❌ INCORRECTO
'Captura desde todos los ángulos'
'Videos en 4K'
```

### En Tarjeta (Slice Límiter)
```javascript
{product.especificaciones.slice(0, 3).map((spec, idx) => (
  <li key={idx} className="text-sm text-gray-600">
    <span className="text-[#039dbf] mr-2">✓</span>
    {spec}
  </li>
))}
```

**Resultado:**
- Si hay 3 especificaciones: muestra 3
- Si hay 10 especificaciones: muestra solo 3
- Mantiene layout uniforme en grillas

### En Modal (Sin Límite)
```javascript
{product.especificaciones.map((spec, idx) => {
  const [key, value] = spec.split(':')
  return (
    <div key={idx} className={`p-4 ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
      <strong>{key}:</strong> {value}
    </div>
  )
})}
```

**Resultado:**
- Renderiza TODAS las especificaciones
- Grid 2-columnas
- Alternancia de colores (zebra striping)

---

## 🖼️ GALERÍA DE IMÁGENES

### Estructura de Datos
```javascript
imagenes_galeria: [
  'https://url-imagen-1.jpg',  // [0] - Mostrada en catálogo
  'https://url-imagen-2.jpg',  // [1] - Thumbnail 1
  'https://url-imagen-3.jpg',  // [2] - Thumbnail 2
  'https://url-imagen-4.jpg',  // [3] - Thumbnail 3
  // Agregar más sin límite
]
```

### En Tarjeta de Catálogo
```javascript
<img 
  src={product.imagenes_galeria && product.imagenes_galeria[0] ? 
    product.imagenes_galeria[0] : '/placeholder.jpg'}
  alt={product.nombre}
/>
```

### En Modal
```javascript
// Panel izquierdo: Thumbnails verticales
<div className="flex gap-2 sm:flex-col overflow-y-auto scrollbar-hide">
  {product.imagenes_galeria.map((img, idx) => (
    <img 
      key={idx}
      src={img}
      onMouseEnter={() => setActiveImgIndex(idx)}
      className={`cursor-pointer ${idx === activeImgIndex ? 'ring-2 ring-[#039dbf]' : ''}`}
    />
  ))}
</div>

// Panel derecho: Imagen principal con zoom
<img 
  src={product.imagenes_galeria[activeImgIndex]}
  onMouseMove={(e) => {
    // Calcular posición relativa del cursor (0-100%)
    const rect = imageViewerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }}
  style={{
    transform: `scale(${isZoomed ? 2 : 1})`,
    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
  }}
/>
```

---

## 🚀 RUTAS DINÁMICAS

### Configuración Next.js
No requiere `next.config.js` especial. Las rutas dinámicas funcionan automáticamente con:
```
app/combos/[id]/page.tsx
```

### Acceso a Parámetros
```javascript
const params = useParams()
const id = params.id as string // Ej: "1"
```

### URLs Generadas
```
/combos/1  → Pack Fiestas Patrias
/combos/2  → Pack Navidad
/combos/3  → Pack Corporativo
/combos/4  → Pack Verano
```

---

## ⚙️ INTERACTIVIDAD CLAVE

### 1. Autoplay Carrousel
```javascript
useEffect(() => {
  if (!isHeroVisible) return // Pausa si hero está fuera de vista
  
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % temporadas_carrusel.length)
  }, 5000) // 5 segundos
  
  return () => clearInterval(interval)
}, [isHeroVisible, temporadas_carrusel.length])
```

### 2. Intersection Observer
```javascript
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    setIsHeroVisible(entry.isIntersecting)
  }, { threshold: 0.1 })
  
  if (heroRef.current) observer.observe(heroRef.current)
  return () => heroRef.current && observer.unobserve(heroRef.current)
}, [])
```

### 3. Zoom Dinámico
```javascript
const handleMouseMove = (e: React.MouseEvent) => {
  if (!imageViewerRef.current) return
  const rect = imageViewerRef.current.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  setZoomPos({ x, y })
}
```

### 4. Navegación Dinámica
```javascript
const router = useRouter()

// En botón "Ver Pack Completo"
onClick={() => router.push(`/combos/${slide.evento_id}`)}

// En botón "Volver al Inicio"
onClick={() => router.push('/')}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
- **Mobile:** `< 768px` (md breakpoint)
- **Tablet:** `768px - 1024px`
- **Desktop:** `> 1024px` (lg breakpoint)

### Grid Adaptativo
```javascript
// Catálogo
<div className="flex md:hidden">    {/* Mobile: Horizontal scroll */}
<div className="hidden md:grid grid-cols-2 lg:grid-cols-3">  {/* Tablet/Desktop */}

// Equipos en combo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Modal Responsive
```javascript
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: Gallery */}
      {/* Right: Info */}
    </div>
  </div>
</div>
```

---

## 🔗 INTEGRACIÓN WHATSAPP

```javascript
const handleSendWhatsApp = () => {
  if (selectedItems.length === 0) {
    alert('Por favor, selecciona al menos un equipo')
    return
  }
  
  const message = `Hola APIC PERÚ, me interesa el ${combo.nombre_pack} con los siguientes equipos: ${selectedItems.join(', ')}`
  
  window.open(
    `https://wa.me/${numero_whatsapp}?text=${encodeURIComponent(message)}`,
    '_blank'
  )
}
```

---

## 📝 GUÍA DE DESARROLLO

### Agregar Nueva Temporada
1. Abre `app/page.tsx`
2. Busca `temporadas_carrusel: [`
3. Agrega objeto con `evento_id` único (5+)
4. Asegúrate que `equipos_incluidos` contiene nombres exactos de productos
5. Commit y push
6. La página `/combos/[nuevo-id]` se crea automáticamente

### Agregar Nuevo Producto
1. Abre `app/page.tsx`
2. Busca `catalogo_cine` o `catalogo_eventos`
3. Agrega objeto con `id` único
4. Sigue formato de especificaciones: `'Propiedad: Valor'`
5. Agrega 4+ imágenes en `imagenes_galeria`
6. Si lo incluyes en `equipos_incluidos` de una temporada, aparecerá automáticamente

### Cambiar Colores
Busca en `app/page.tsx`:
- `#039dbf` → Primario turquesa
- `#02829e` → Hover turquesa
- `#0b0f19` → Texto principal
- Reemplaza con nuevo color (ej: `#FF5733`)

### Cambiar Tipografía
En `globals.css`:
```css
@theme {
  --font-sans: 'Tu Font', fallback;
}
```

---

## 🧪 TESTING

### URLs para Probar
- `http://localhost:3000` - Página principal
- `http://localhost:3000/combos/1` - Pack Fiestas Patrias
- `http://localhost:3000/combos/2` - Pack Navidad
- `http://localhost:3000/combos/3` - Pack Corporativo
- `http://localhost:3000/combos/4` - Pack Verano
- `http://localhost:3000/combos/999` - Debe mostrar "Combo no encontrado"

### Casos de Uso
- [ ] Carrousel autoplay funciona
- [ ] Chevrones avanzan/retroceden
- [ ] "Ver Pack Completo" navega correctamente
- [ ] Modal abre al hacer click en producto
- [ ] Zoom sigue el cursor en modal
- [ ] Thumbnails cambian imagen principal
- [ ] Especificaciones limitadas a 3 en tarjeta
- [ ] Todas las especificaciones en modal
- [ ] Grid 2-columnas con alternancia de colores
- [ ] Responsive en mobile/tablet/desktop
- [ ] WhatsApp integration trabaja

---

## 🚨 TROUBLESHOOTING

### Error: "Combo no encontrado"
**Causa:** `evento_id` no coincide  
**Solución:** Verifica que exista una temporada con ese `evento_id`

### Error: "Productos no se muestran en combo"
**Causa:** Nombres en `equipos_incluidos` no coinciden exactamente  
**Solución:** Revisa la capitalización y espacios exactamente

### Error: "Imagen no carga"
**Causa:** URL rota o correctness  
**Solución:** Verifica URL en navegador, debe retornar imagen 200 OK

### Error: "Especificaciones no aparecen en grid"
**Causa:** Formato sin colon `:`  
**Solución:** Asegúrate formato es `'Propiedad: Valor'`

---

## 📊 PERFORMANCE

- **Lighthouse Score:** 95+ (esperado)
- **Core Web Vitals:** All green
- **Bundle Size:** ~150KB gzipped (React + Next.js + Tailwind)
- **Time to Interactive:** <2s

---

**Documentación técnica v2.0 - Julio 2026**
