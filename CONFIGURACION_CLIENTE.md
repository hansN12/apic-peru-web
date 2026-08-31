# 📘 MANUAL PARA CLIENTES NO TÉCNICOS - APIC PERÚ

**Tu guía completa para administrar el sitio web sin código ni programación**

---

## 🎯 ¿QUÉ ES ESTE MANUAL?

Este documento te permite **administrar completamente** tu sitio web de APIC PERÚ haciendo ediciones en **un solo archivo** (`app/config.ts`) a través de GitHub, sin necesidad de instalar software ni programación.

### ✅ Lo que PUEDES hacer
- Cambiar colores corporativos (botones, tabs, bordes)
- Agregar o modificar productos (nombre, descripción, especificaciones)
- Subir nuevas imágenes de galería
- Crear campañas estacionales
- Actualizar contacto y redes sociales
- Modificar precios y garantías

### ❌ Lo que NO debes hacer
- Editar archivos en carpeta `/components`
- Modificar código JavaScript/TypeScript
- Eliminar llaves `{` o `}`
- Cambiar nombres de propiedades (ej: `color_primario` → `colores`)

---

## 🚀 PASO 1: ACCEDER AL ARCHIVO MAESTRO

### ¿Dónde está el archivo?
```
https://github.com/[tu-usuario]/[tu-repositorio]/blob/main/app/config.ts
```

### Cómo abrirlo
1. Ve a tu repositorio GitHub
2. Abre la carpeta `app`
3. Haz clic en archivo `config.ts`
4. Verás el contenido completo del sitio web

### Cómo editar
1. Haz clic en el **lápiz ✏️** en la esquina superior derecha
2. Se abrirá el **editor online de GitHub**
3. Modifica lo que necesites
4. Scroll hasta abajo
5. Haz clic en **"Commit changes"**
6. Agrega un mensaje (ej: "Cambiar color a rojo")
7. Confirma

### Tiempo de actualización
⏱️ **2-3 minutos** - Tu sitio web se actualizará automáticamente

---

## 🎨 PARTE 1: CAMBIAR COLORES CORPORATIVOS

### Ubicación en el archivo
Busca al inicio del archivo `config.ts`:
```typescript
export const THEME_CONFIG = {
  color_primario: '#039dbf',
  color_hover: '#02829e',
  color_fondo_tarjetas: '#f9fafb'
}
```

### ¿Dónde aparecen estos colores?

| Color | Aparece en |
|-------|-----------|
| `color_primario` | Botones "Añadir a Lista", tabs activos, bordes de títulos, iconos principales |
| `color_hover` | Cuando pasas el mouse sobre botones (efecto oscurecimiento) |
| `color_fondo_tarjetas` | Fondo de las tarjetas con productos en la página principal |

### Paletas de colores predefinidas

**Opción 1: Rojo Corporativo**
```typescript
export const THEME_CONFIG = {
  color_primario: '#dc2626',
  color_hover: '#991b1b',
  color_fondo_tarjetas: '#fef2f2'
}
```

**Opción 2: Azul Marino**
```typescript
export const THEME_CONFIG = {
  color_primario: '#1e3a8a',
  color_hover: '#1e40af',
  color_fondo_tarjetas: '#f0f9ff'
}
```

**Opción 3: Verde Profesional**
```typescript
export const THEME_CONFIG = {
  color_primario: '#059669',
  color_hover: '#047857',
  color_fondo_tarjetas: '#ecfdf5'
}
```

**Opción 4: Naranja Dinámico**
```typescript
export const THEME_CONFIG = {
  color_primario: '#ea580c',
  color_hover: '#c2410c',
  color_fondo_tarjetas: '#fff7ed'
}
```

### Cómo encontrar tu color preferido
1. Abre https://htmlcolorcodes.com
2. Elige tu color
3. Copia el código hexadecimal (ej: `#dc2626`)
4. Pégalo en el archivo

---

## 📦 PARTE 2: GESTIONAR PRODUCTOS

### Estructura de un producto

```typescript
{
  id: 1,                                          // Número único (1, 2, 3...)
  nombre: 'Rieles de Enfoque Pro',               // Nombre que ven los clientes
  sku: 'RFC-PRO-001',                            // Código único (no cambiar)
  categoria: 'Industria Cinematográfica',         // Una de las 2 categorías
  especificaciones: [                             // Características principales
    'Desplazamiento: Fluido continuo',
    'Soportes: Alta precisión',
    'Material: Aluminio industrial'
  ],
  descripcion: 'Sistemas profesionales...',       // Texto corto (visible en tarjeta)
  descripcion_larga: 'Los Rieles de Enfoque...',  // Texto largo (en página producto)
  imagenes_galeria: [                             // URLs de fotos (máximo 4)
    '/imagenes/rieles-1.jpg',
    '/imagenes/rieles-2.jpg',
    '/imagenes/rieles-3.jpg',
    '/imagenes/rieles-4.jpg'
  ],
  sobre_la_marca: 'APIC PERÚ es fabricante...',  // Información de empresa
  ficha_tecnica: [                                // Especificaciones técnicas
    { label: 'Desplazamiento', valor: 'Fluido continuo sin interrupciones' },
    { label: 'Longitud', valor: 'Hasta 10 metros' },
    { label: 'Peso', valor: '45 kg' }
  ],
  garantias: [                                    // Preguntas frecuentes de garantía
    { pregunta: 'Garantía contra defectos de fabricación', respuesta: 'SÍ' },
    { pregunta: 'Cobertura en transporte', respuesta: 'SÍ' },
    { pregunta: 'Reemplazo por daños de uso', respuesta: 'NO' }
  ]
}
```

### Dónde están los productos en el archivo

**Opción A: Industria Cinematográfica (3 productos)**
Busca: `catalogo_cine: [`

**Opción B: Equipos para Eventos (6 productos)**
Busca: `catalogo_eventos: [`

### Cómo modificar un producto existente

**Ejemplo: Cambiar nombre**
```typescript
// ANTES:
nombre: 'Rieles de Enfoque Pro',

// DESPUÉS:
nombre: 'Rieles Profesionales 2026',
```

**Resultado:** El nombre se actualiza en la tarjeta home y página producto

**Ejemplo: Agregar especificación**
```typescript
// ANTES:
especificaciones: [
  'Desplazamiento: Fluido continuo',
  'Soportes: Alta precisión'
]

// DESPUÉS:
especificaciones: [
  'Desplazamiento: Fluido continuo',
  'Soportes: Alta precisión',
  'Garantía: 2 años'  // ← NUEVA
]
```

### Cómo agregar un producto completamente nuevo

1. **Encuentra el lugar:** Busca el ÚLTIMO producto en `catalogo_eventos`
2. **Copia estructura:** Copia el bloque completo de otro producto
3. **Pega:** Añade una **coma después del último `}`** y pega
4. **Modifica ID:** Cambia `id: 9` a `id: 10` (siguiente número)
5. **Completa datos:** Rellena nombre, SKU, descripciones, imágenes

**IMPORTANTE:** Mantén las comillas `"` y llaves `{}` exactamente igual

---

## 🖼️ PARTE 3: AGREGAR IMÁGENES

### Dónde van las imágenes

Cada producto tiene un array de imágenes:
```typescript
imagenes_galeria: [
  '/imagenes/rieles-1.jpg',    // Imagen 1
  '/imagenes/rieles-2.jpg',    // Imagen 2
  '/imagenes/rieles-3.jpg',    // Imagen 3
  '/imagenes/rieles-4.jpg'     // Imagen 4
]
```

### Cómo subir nuevas imágenes

**Opción 1: Usar URLs externas (Recomendado)**
```typescript
imagenes_galeria: [
  'https://example.com/foto1.jpg',
  'https://example.com/foto2.jpg',
  'https://example.com/foto3.jpg',
  'https://example.com/foto4.jpg'
]
```

Ventajas:
- ✅ No ocupan espacio en servidor
- ✅ Suben y actualizan al instante
- ✅ Hospedadas en CDN

**Opción 2: Usar Google Photos**
1. Sube foto a Google Photos
2. Haz clic derecho → "Copiar enlace"
3. Pégalo en el archivo

### Cómo hospedar gratis tus imágenes

1. Ve a https://imgbb.com
2. Sube tu imagen
3. Copia el URL que genera
4. Pégalo en `imagenes_galeria`

**Ejemplo completo:**
```typescript
imagenes_galeria: [
  'https://i.ibb.co/xyz123/foto1.jpg',
  'https://i.ibb.co/abc456/foto2.jpg',
  'https://i.ibb.co/def789/foto3.jpg',
  'https://i.ibb.co/ghi012/foto4.jpg'
]
```

### Tamaño de las imágenes

- **Mínimo:** 600x400 px
- **Óptimo:** 1200x800 px
- **Máximo peso:** 300 KB por imagen

---

## 🎪 PARTE 4: CREAR CAMPAÑAS ESTACIONALES

### Ubicación en el archivo
Busca: `temporadas_carrusel: [`

### Estructura de una campaña

```typescript
{
  evento_id: 1,                          // ID único
  nombre_evento: 'Fiestas Patrias 2026', // Nombre interno
  titulo_carrusel: 'Fiestas Patrias 2026', // Título que ven clientes
  subtitulo_carrusel: 'Equipo premium para celebraciones', // Subtítulo
  imagen_carrusel: 'linear-gradient(135deg, #039dbf 0%, #0b0f19 100%)', // Gradiente
  imagen_url: 'https://...',             // Foto de fondo (opcional)
  nombre_pack: 'Pack Fiestas Patrias Completo', // Nombre del combo
  descripcion_pack: 'Solución audiovisual integral...', // Descripción
  equipos_incluidos: [                   // Equipos del combo
    'Domos LED',
    'Fotocabina',
    'Plataforma 360'
  ]
}
```

### Cómo crear una nueva campaña

**Paso 1: Copia estructura**
```typescript
// Copia este bloque:
{
  evento_id: 5,
  nombre_evento: 'Mi Campaña',
  titulo_carrusel: 'Mi Campaña',
  subtitulo_carrusel: 'Subtítulo aquí',
  imagen_carrusel: 'linear-gradient(135deg, #039dbf 0%, #0b0f19 100%)',
  imagen_url: 'https://...',
  nombre_pack: 'Pack Mi Campaña',
  descripcion_pack: 'Descripción aquí',
  equipos_incluidos: [
    'Producto 1',
    'Producto 2',
    'Producto 3'
  ]
}
```

**Paso 2: Modifica colores del gradiente**
```typescript
// Paletas de gradientes:
Azul a Oscuro:        'linear-gradient(135deg, #039dbf 0%, #0b0f19 100%)'
Rojo a Negro:         'linear-gradient(135deg, #dc2626 0%, #0b0f19 100%)'
Verde a Azul:         'linear-gradient(135deg, #059669 0%, #1e3a8a 100%)'
Naranja a Rojo:       'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)'
```

**Paso 3: Agrega imagen (opcional)**
```typescript
imagen_url: 'https://i.ibb.co/xyz/mi-foto.jpg'
```

**Paso 4: Llena equipos incluidos**
```typescript
equipos_incluidos: [
  'Rieles de Enfoque Pro',    // Nombre exacto del producto
  'Fotocabina',               // Debe existir en catálogo
  'Domos LED'                 // Debe existir en catálogo
]
```

### Resultado automático
- ✅ Aparece nuevo slide en carrusel (home)
- ✅ Accesible vía `/combos/5`
- ✅ Botón "Seleccionar todos" en combos page
- ✅ Incluido en modal de cotización

---

## 📱 PARTE 5: ACTUALIZAR CONTACTO Y REDES SOCIALES

### Ubicación en el archivo
Busca: `export const WEBSITE_CONFIG = {`

### Información de contacto

```typescript
numero_whatsapp: '51 994 942 994',  // WhatsApp para cotizaciones
correo_contacto: 'info@apicperu.com' // Email de contacto
```

**Cómo cambiar:**
```typescript
// ANTES:
numero_whatsapp: '51 994 942 994',

// DESPUÉS:
numero_whatsapp: '51 987 654 321',
```

### Redes sociales

```typescript
redes_sociales: {
  facebook: 'https://facebook.com/apicperu',
  instagram: 'https://instagram.com/apicperu',
  tiktok: 'https://tiktok.com/@apicperu'
}
```

**Cómo obtener tus URLs:**
1. Ve a tu perfil en la red social
2. Copia el URL del navegador
3. Pégalo en el archivo

---

## 🔍 PARTE 6: ENTENDER LA SINTAXIS DEL ARCHIVO

### Reglas importantes

**Regla 1: Comillas**
```typescript
✅ CORRECTO:
nombre: 'Rieles Pro',

❌ INCORRECTO:
nombre: Rieles Pro,  // Falta comillas
```

**Regla 2: Comas**
```typescript
✅ CORRECTO:
{
  id: 1,
  nombre: 'Producto 1',
  sku: 'SKU-001'  // Última propiedad SIN coma
},
{
  id: 2,          // Nueva propiedad CON coma después de }
  nombre: 'Producto 2'
}

❌ INCORRECTO:
{
  id: 1,
  nombre: 'Producto 1',  // Esta coma es OK
}  // Pero agregar producto nuevo sin coma antes da error
```

**Regla 3: Corchetes para arrays**
```typescript
✅ CORRECTO:
imagenes_galeria: ['foto1.jpg', 'foto2.jpg'],

❌ INCORRECTO:
imagenes_galeria: 'foto1.jpg', 'foto2.jpg'  // Sin corchetes
```

**Regla 4: Llaves para objetos**
```typescript
✅ CORRECTO:
{
  pregunta: '¿Cubre daños?',
  respuesta: 'NO'
}

❌ INCORRECTO:
[
  pregunta: '¿Cubre daños?',
  respuesta: 'NO'
]
```

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### Error 1: "Syntax Error" en GitHub

**Causa:** Falta una coma, comilla o llave

**Solución:**
1. Abre GitHub editor
2. Busca línea roja subrayada
3. Revisa: `"` comillas, `,` comas, `}` llaves
4. Compara con producto anterior (cópialo)

### Error 2: Cambios no aparecen

**Causa:** No confirmaste el commit

**Solución:**
1. Revisa que hayas hecho "Commit changes"
2. Espera 2-3 minutos (es el tiempo de deploy)
3. Limpia caché del navegador (Ctrl+Shift+Del)
4. Recarga página

### Error 3: Imagen no carga

**Causa:** URL rota o imagen muy pesada

**Solución:**
1. Abre URL en navegador (¿carga?)
2. Si no carga, sube a https://imgbb.com
3. Si carga, comprime imagen (https://tinypng.com)
4. Máximo 300 KB por imagen

### Error 4: Caracteres extraños en descripción

**Causa:** Caracteres especiales sin escape

**Solución:**
```typescript
❌ INCORRECTO:
descripcion: 'Precio: $100 & "especial"'

✅ CORRECTO:
descripcion: 'Precio: $100 &amp; "especial"'
```

---

## 📊 MÉTRICAS Y DATOS (Si los necesitas)

### Información de empresa
```typescript
metricas_nosotros: [
  { numero: '15+', descripcion: 'Años en la industria' },
  { numero: '500+', descripcion: 'Eventos realizados' },
  { numero: '1000+', descripcion: 'Clientes satisfechos' }
]
```

---

## ✅ CHECKLIST ANTES DE LANZAR CAMBIOS

- [ ] Revisaste que TODAS las comillas `"` o `'` estén cerradas
- [ ] Revisaste que cada `{` tenga su `}`
- [ ] Revisaste que cada `[` tenga su `]`
- [ ] Revisaste URLs de imágenes (¿cargan en navegador?)
- [ ] Revisaste que IDs de productos sean números únicos
- [ ] Revisaste que nombres de categorías sean exactos
- [ ] Esperas 2-3 minutos después de commit
- [ ] Limpias caché del navegador (Ctrl+Shift+Del)

---

## 🆘 PREGUNTAS FRECUENTES

**P: ¿Puedo editar desde mi teléfono?**
R: Sí, GitHub funciona en mobile. Aunque es incómodo, así que recomendamos desktop.

**P: ¿Qué pasa si cometo un error?**
R: Puedes revertir cambios en GitHub (History → Revert). No hay problema.

**P: ¿Debo respetar MAYÚSCULAS/minúsculas?**
R: Sí. El archivo es sensible a mayúsculas. `id` ≠ `ID`.

**P: ¿Cuánto tarda en verse el cambio?**
R: 2-3 minutos máximo. Si más de 5 min, limpia caché (Ctrl+Shift+Del).

**P: ¿Puedo eliminar un producto?**
R: Sí, elimina el bloque `{ ... }` completo. Pero cuidado con comas.

**P: ¿Hay límite de productos?**
R: No, puedes agregar ilimitados. Pero recomendamos máximo 20.

**P: ¿Puedo cambiar la estructura del archivo?**
R: No, mantén exactamente igual. Solo edita VALUES (contenido), no KEYS (nombres).

---

## 📞 SOPORTE TÉCNICO

Si algo falla:

1. **Revisa este manual** (90% de problemas resueltos aquí)
2. **Contacta:** `info@apicperu.com`
3. **WhatsApp:** `+51 994 942 994`
4. **GitHub Issues:** Crea issue con screenshot del error

---

**¡Listo! Ya puedes administrar tu sitio web profesionalmente. 🎉**

*Última actualización: Agosto 2026*
