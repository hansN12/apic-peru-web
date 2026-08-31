'use client'

import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, MessageCircle, Zap, Truck, Gift, Phone, Mail, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { WEBSITE_CONFIG, THEME_CONFIG } from '@/app/config'
import { useCart } from '@/app/hooks/useCart'

export default function ComboPage() {
  const router = useRouter()
  const params = useParams()
  const comboId = parseInt(params.id as string)
  
  // Core States
  const { selectedItems, setSelectedItems, toggleItem: toggleProductInList } = useCart()
  const [showSeasonalPackModal, setShowSeasonalPackModal] = useState(false)

  const { numero_whatsapp, temporadas_carrusel, redes_sociales } = WEBSITE_CONFIG
  const allProducts = WEBSITE_CONFIG.CATALOGO_GENERAL
  
  const combo = temporadas_carrusel.find(c => c.evento_id === comboId)
  
  if (!combo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0b0f19] mb-4">Combo no encontrado</h1>
          <button onClick={() => router.push('/')} className="text-[#039dbf] hover:underline">
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  // 🔍 RESOLUCIÓN FLEXIBLE DE PRODUCTOS: 'equipos_incluidos' puede traer el
  // nombre exacto de un combo (p. ej. 'Plataforma 360 — Combo 2') o solo el
  // nombre de la familia (p. ej. 'Plataforma 360'). Si no hay coincidencia
  // exacta, se busca el primer producto cuyo nombre EMPIECE con ese texto —
  // como los combos se generan en orden en config.ts, esto selecciona
  // automáticamente el Combo 1 de esa familia por defecto.
  const resolverProductoPorNombre = (nombreBuscado: string) => {
    const exacto = allProducts.find((p: any) => p.nombre === nombreBuscado)
    if (exacto) return exacto
    return allProducts.find((p: any) => p.nombre.startsWith(nombreBuscado)) || null
  }

  const comboProducts = combo.equipos_incluidos
    .map((nombre: string) => resolverProductoPorNombre(nombre))
    .filter((p: any) => p !== null)

  const selectAllCombo = () => {
    const allNames = comboProducts.map(p => p.nombre)
    setSelectedItems(Array.from(new Set([...selectedItems, ...allNames])))
  }

  const handleSendWhatsApp = () => {
    if (selectedItems.length === 0) {
      alert('Por favor, selecciona al menos un equipo')
      return
    }
    const message = `Hola APIC, me interesa el ${combo.nombre_pack} con los siguientes equipos: ${selectedItems.join(', ')}`
    window.open(`https://wa.me/${numero_whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <main className="bg-white min-h-screen">
      {/* STICKY HEADER WITH MI LISTA COUNTER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between h-14">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[#0b0f19] hover:text-[#039dbf] transition font-semibold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver al Inicio
          </button>
          <h1 className="text-sm sm:text-base font-bold text-[#0b0f19] text-center flex-1">{combo.nombre_pack}</h1>
          <button onClick={() => setShowSeasonalPackModal(true)}
          className="px-4 py-2 bg-[#039dbf] text-white rounded-lg font-semibold text-sm hover:bg-[#02829e] transition"
          >
            Mi Lista ({selectedItems.length})
          </button>
        </nav>
      </header>

      {/* SECTION 1: MINI-HERO CABECERA */}
      <section
        className="h-[40vh] bg-cover bg-center text-white flex items-center relative"
        style={{ backgroundImage: `url('${combo.imagen_url}')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white text-balance">{combo.nombre_pack}</h1>
          <p className="text-base sm:text-lg mt-4 text-gray-100">{combo.descripcion_pack}</p>
        </div>
      </section>

      {/* SECTION 2: BARRA DE BENEFICIOS EXCLUSIVOS */}
      <section className="bg-gradient-to-r from-[#039dbf] to-[#02829e] text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm sm:text-base">Precio Especial de Temporada</h3>
                <p className="text-xs sm:text-sm text-white/80">Descuento exclusivo por combo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm sm:text-base">Instalación Gratis</h3>
                <p className="text-xs sm:text-sm text-white/80">Equipo instalado por expertos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Gift className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm sm:text-base">Despacho Prioritario</h3>
                <p className="text-xs sm:text-sm text-white/80">Envío rápido garantizado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMBO SPECIAL ITEMS GRID */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b0f19] mb-8 sm:mb-12">Equipos Incluidos en este Pack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {comboProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push('/productos/' + product.id)}
                className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-[#039dbf]/50 hover:shadow-md transition flex flex-col h-full justify-between p-6 transform hover:scale-[1.03] cursor-pointer group"
              >
                <div>
                  <div className="h-48 w-full overflow-hidden bg-gray-100 mb-4 rounded-lg">
                    <img
                      src={product.imagenes_galeria && product.imagenes_galeria[0] ? product.imagenes_galeria[0] : '/placeholder.jpg'}
                      alt={product.nombre}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0b0f19] mb-3">{product.nombre}</h3>
                  <ul className="space-y-2 mb-4">
                    {product.especificaciones.slice(0, 3).map((spec: string, idx: number) => {
                      const [clave, ...resto] = spec.split(':')
                      const valor = resto.join(':').trim()
                      return (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-[#039dbf] mr-2">✓</span>
                          <span>
                            <span className="font-bold" style={{ color: THEME_CONFIG.color_primario }}>
                              {clave.trim()}
                            </span>
                            {valor && `: ${valor}`}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push('/productos/' + product.id)
                    }}
                    className="text-[#039dbf] hover:text-[#0b0f19] transition text-xs font-medium py-1 border-b border-gray-300 hover:border-[#039dbf] mb-3 w-full text-left"
                  >
                    Ver Detalles →
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleProductInList(product.nombre)
                  }}
                  className={`w-full py-2 rounded font-semibold transition-all ${
                    selectedItems.includes(product.nombre)
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-[#039dbf] text-white hover:bg-[#02829e]'
                  }`}
                >
                  {selectedItems.includes(product.nombre) ? '✓ Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#039dbf] to-[#02829e] rounded-xl p-8 sm:p-10 text-white text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">¿Listo para tu evento?</h3>
            <p className="text-base sm:text-lg mb-8 text-white/90">Selecciona todos los equipos del combo y obtén el mejor precio</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={selectAllCombo}
                className="px-8 py-3 bg-white text-[#039dbf] rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Seleccionar Todo el Combo
              </button>
              <button
                onClick={() => setShowSeasonalPackModal(true)}
                className="px-8 py-3 bg-white text-[#039dbf] rounded-lg font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Cotizar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* SEASONAL COMBO PACK MODAL WITH WHATSAPP CTA */}
      {showSeasonalPackModal && selectedItems.length > 0 && (() => {
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-[#0b0f19]">Resumen de tu Pack</h3>
                <button
                  onClick={() => setShowSeasonalPackModal(false)}
                  className="p-1 hover:bg-gray-100 rounded transition"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-8">
                <div className="mb-8">
                  <h5 className="font-bold text-[#0b0f19] mb-4 text-lg">Pack: {combo.nombre_pack}</h5>
                  <p className="text-gray-600 mb-4">{combo.descripcion_pack}</p>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">Equipos seleccionados: {selectedItems.length} de {comboProducts.length}</p>
                  </div>
                  <h6 className="font-bold text-[#0b0f19] mb-3">Equipos Seleccionados:</h6>
                  <ul className="space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    {selectedItems.map((item, idx) => (
                      <li key={idx} className="text-gray-700 flex items-center justify-between">
                        <span className="flex items-center">
                          <span className="text-[#039dbf] mr-3 font-bold text-xl">✓</span>
                          {item}
                        </span>
                        <button
                          onClick={() => toggleProductInList(item)}
                          className="text-xs text-red-500 hover:text-red-700 transition"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSeasonalPackModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-[#0b0f19] rounded-lg font-bold hover:bg-gray-50 transition"
                  >
                    Seguir Seleccionando
                  </button>
                  <button
                    onClick={handleSendWhatsApp}
                    className="flex-1 px-6 py-3 bg-[#039dbf] text-white rounded-lg font-bold hover:bg-[#02829e] transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar por WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ===== FOOTER / CONTACTO ===== */}
      <footer id="contacto" className="bg-[#0b0f19] text-white py-14 sm:py-20 border-t border-gray-800 min-h-[80vh]" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-6 mb-12 sm:mb-16">
            <div className="max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              <h4 className="text-xl font-bold mb-6 flex items-center space-x-2 max-sm:justify-center">
                <div className="w-8 h-8 bg-[#039dbf] rounded-full"></div>
                <span>APIC</span>
              </h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                Soluciones audiovisuales y de eventos de calidad superior para Perú y Latinoamérica.
              </p>
            </div>

            <div className="max-sm:text-center">
              <h4 className="text-sm sm:text-base font-bold mb-6 uppercase tracking-wider text-[#039dbf]">Navegación</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="/#inicio" className="hover:text-[#039dbf] transition">Inicio</a></li>
                <li><a href="/#nosotros" className="hover:text-[#039dbf] transition">Nosotros</a></li>
                <li><a href="/#catalogo" className="hover:text-[#039dbf] transition">Catálogo</a></li>
                <li><a href="/#contacto" className="hover:text-[#039dbf] transition">Contacto</a></li>
              </ul>
            </div>

            <div className="max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              <h4 className="text-sm sm:text-base font-bold mb-6 uppercase tracking-wider text-[#039dbf]">Contacto</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2 max-sm:justify-center">
                  <Phone className="w-4 h-4 text-[#039dbf]" />
                  +{WEBSITE_CONFIG.numero_whatsapp_m}
                </li>
                <li className="flex items-center gap-2 max-sm:justify-center">
                  <Mail className="w-4 h-4 text-[#039dbf]" />
                  {WEBSITE_CONFIG.correo_contacto}
                </li>
              </ul>
            </div>

            <div className="max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              <h4 className="text-sm sm:text-base font-bold mb-6 uppercase tracking-wider text-[#039dbf]">Síguenos</h4>
              <div className="flex gap-3 max-sm:justify-center">

                {/* 🎵 TIKTOK (SVG Oficial) */}
                <a
                  href={redes_sociales.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1f2937] hover:bg-[#039dbf] transition flex items-center justify-center text-white cursor-pointer"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.03 1.6 4.17 1.12 1.25 2.7 1.94 4.39 2.05v3.86c-1.57-.02-3.13-.5-4.44-1.39-.46-.3-.87-.67-1.22-1.09V15c0 1.93-.65 3.8-1.84 5.25A8.96 8.96 0 0 1 7.87 24a8.96 8.96 0 0 1-6.16-2.52A9.13 9.13 0 0 1 .05 14.86a9.12 9.12 0 0 1 2.21-6.42A8.96 8.96 0 0 1 8.8 6.05V9.9c-1.37.03-2.73.55-3.75 1.51a5.16 5.16 0 0 0-1.51 3.9 5.16 5.16 0 0 0 1.76 3.8 5.21 5.21 0 0 0 6.64-.17c1.07-.94 1.64-2.34 1.62-3.77V.02h-.04z" />
                  </svg>
                </a>

                {/* 📸 INSTAGRAM (SVG Oficial) */}
                <a
                  href={redes_sociales.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1f2937] hover:bg-[#039dbf] transition flex items-center justify-center text-white cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://w3.org">
                    <rect x="2" y="2" width="20" height="24" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* 👥 FACEBOOK (SVG Oficial) */}
                <a
                  href={redes_sociales.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1f2937] hover:bg-[#039dbf] transition flex items-center justify-center text-white cursor-pointer"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          <div className="border-t border-gray-800 pt-8 sm:pt-10"></div>

          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              &copy; {new Date().getFullYear()} APIC. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-xs">
              Fabricante peruano de soluciones audiovisuales y equipos para eventos
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}