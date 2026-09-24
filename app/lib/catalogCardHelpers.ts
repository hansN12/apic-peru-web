// ============================================================
// 🎯 HELPERS DE PRESENTACIÓN DE TARJETAS DE CATÁLOGO
// Funciones puras (sin estado, sin hooks). Se extrajeron a este módulo
// compartido para que app/page.tsx (grid de Liquidación) y
// app/combos/[id]/page.tsx (dashboard por familia) usen EXACTAMENTE la
// misma lógica de tarjeta — evita que ambas superficies diverjan entre
// sí y evita duplicar código de un archivo a otro.
// ============================================================

export interface ProductoCatalogo {
  id: number
  nombre: string
  sku: string
  categoria: string
  especificaciones: string[]
  descripcion?: string
  descripcion_larga?: string
  imagenes_galeria?: string[]
  sobre_la_marca?: string
  ficha_tecnica?: { label: string; valor: string }[]
  garantias?: { pregunta: string; respuesta: string }[]
}

// Extrae el texto tras el guion largo de 'product.nombre'
// (p. ej. "Plataforma 360 — Combo 2" -> "Combo 2"). Productos de nivel
// único (sin guion, p. ej. "Glass Booth") no llevan badge: retorna null.
export function extraerBadgeCombo(nombre: string): string | null {
  const partes = nombre.split('—')
  return partes.length > 1 ? partes[1].trim() : null
}

// Ubica la línea de costo/precio dentro de especificaciones ("Costo:",
// "Precio:" o "S/.") y la separa del resto, para renderizarla aparte
// como bloque de precio en vez de como viñeta más de la lista.
export function separarPrecio(especificaciones: string[]): { precio: string | null; resto: string[] } {
  const idx = especificaciones.findIndex(
    (s) => s.includes('Costo:') || s.includes('Precio:') || s.includes('S/.')
  )
  if (idx === -1) return { precio: null, resto: especificaciones }
  return {
    precio: especificaciones[idx],
    resto: especificaciones.filter((_, i) => i !== idx),
  }
}

// Extrae el valor numérico (soles) de la línea de precio de un producto,
// si existe. Usado para ordenar/seleccionar productos por costo (p. ej.
// la grilla de Liquidación). Retorna Infinity si no hay precio — así un
// producto sin costo definido (dato faltante en la fuente) nunca se
// prioriza como "oferta".
export function obtenerPrecioNumerico(producto: ProductoCatalogo): number {
  const { precio } = separarPrecio(producto.especificaciones)
  if (!precio) return Infinity
  const match = precio.match(/[\d,]+(\.\d+)?/)
  if (!match) return Infinity
  const numero = parseFloat(match[0].replace(/,/g, ''))
  return isNaN(numero) ? Infinity : numero
}

// Calcula el porcentaje de descuento entre 'precio_antes' y el precio
// actual de un producto en oferta. Retorna null si falta algún dato
// (nunca se muestra un porcentaje inventado).
export function calcularDescuentoPorcentaje(producto: ProductoCatalogo & { en_oferta?: boolean; precio_antes?: string | null }): number | null {
  if (!producto.en_oferta || !producto.precio_antes) return null
  const { precio } = separarPrecio(producto.especificaciones)
  if (!precio) return null
  const actual = obtenerPrecioNumerico(producto)
  const antesMatch = producto.precio_antes.match(/[\d,]+(\.\d+)?/)
  if (!antesMatch || actual === Infinity) return null
  const antes = parseFloat(antesMatch[0].replace(/,/g, ''))
  if (isNaN(antes) || antes <= 0 || actual >= antes) return null
  return Math.round(((antes - actual) / antes) * 100)
}
// qué CLAVES (el texto antes de ':') cambian de valor entre esos combos.
// Esas son las que realmente diferencian un nivel de otro — a diferencia
// de un prefijo fijo como "Características:" (que no existe en todas las
// familias: Domos usa "Variante", Túnel Pixel usa "Iluminación"/"Control"),
// este método funciona automáticamente sobre cualquier familia y cualquier
// nombre de clave, sin mantenimiento manual. Costo/Precio se excluyen
// porque ya se muestran aparte (ver separarPrecio). Se ejecuta UNA vez por
// sección, no por tarjeta.
export function calcularClavesDiferenciadoras(productosFamilia: ProductoCatalogo[]): Set<string> {
  if (!productosFamilia || productosFamilia.length <= 1) return new Set()
  const valoresPorClave: Record<string, Set<string>> = {}
  productosFamilia.forEach((p) => {
    p.especificaciones.forEach((spec: string) => {
      const [clave, ...resto] = spec.split(':')
      const claveTrim = clave.trim()
      if (claveTrim === 'Costo' || claveTrim === 'Precio') return
      const valor = resto.join(':').trim()
      if (!valoresPorClave[claveTrim]) valoresPorClave[claveTrim] = new Set()
      valoresPorClave[claveTrim].add(valor)
    })
  })
  const claves = new Set<string>()
  Object.entries(valoresPorClave).forEach(([clave, valores]) => {
    if (valores.size > 1) claves.add(clave)
  })
  return claves
}

// Arma el preview de specs de una tarjeta: prioriza las líneas cuya clave
// es diferenciadora para esa familia; si no alcanzan para completar la
// cantidad pedida, rellena con el resto de especificaciones (sin repetir).
export function obtenerSpecsPreview(especificacionesSinPrecio: string[], clavesDiferenciadoras: Set<string>, cantidad: number): string[] {
  const diferenciadoras = especificacionesSinPrecio.filter((s) => clavesDiferenciadoras.has(s.split(':')[0].trim()))
  if (diferenciadoras.length >= cantidad) return diferenciadoras.slice(0, cantidad)
  const relleno = especificacionesSinPrecio.filter((s) => !diferenciadoras.includes(s))
  return [...diferenciadoras, ...relleno].slice(0, cantidad)
}