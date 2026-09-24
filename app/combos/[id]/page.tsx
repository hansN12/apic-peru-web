'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, MessageCircle, X } from 'lucide-react'
import { WEBSITE_CONFIG, THEME_CONFIG } from '@/app/config'
import { useCart } from '@/app/hooks/useCart'
import {
  extraerBadgeCombo,
  separarPrecio,
  calcularClavesDiferenciadoras,
  obtenerSpecsPreview,
} from '@/app/lib/catalogCardHelpers'

export default function CombosPage() {
  const router = useRouter()
  const params = useParams()
  const slugParam = params.id as string // id_seccion de la familia, o 'all'

  const { selectedItems, toggleItem: toggleProductInList } = useCart()
  const [showQuotationModal, setShowQuotationModal] = useState(false)

  const { numero_whatsapp, secciones_catalogo } = WEBSITE_CONFIG

  // 🛡️ FALLBACK: si el slug es 'all', o no coincide con ninguna familia
  // (id_seccion inválido/inexistente), se activa automáticamente la
  // PRIMERA familia del listado — nunca hay un estado vacío.
  const familiaActiva = secciones_catalogo.find((s) => s.id_seccion === slugParam) || secciones_catalogo[0]

  // Claves que realmente diferencian un combo de otro DENTRO de esta
  // familia (ver catalogCardHelpers) — se recalcula solo cuando cambia
  // la familia activa, no por tarjeta.
  const clavesDiferenciadoras = calcularClavesDiferenciadoras(familiaActiva.productos)

  const handleMiListaClick = () => {
    if (selectedItems.length === 0) return
    setShowQuotationModal(true)
  }

  return (
    <>
      {/* ===== HEADER MINIMALISTA DEL DASHBOARD ===== */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#039dbf] transition cursor-pointer"
              aria-label="Volver al inicio"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Inicio</span>
            </button>
            <div className="hidden sm:flex items-center space-x-2">
              <img
                src="/apic_icon.png"
                alt="APIC"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-bold text-[#0b0f19]">APIC</span>
            </div>
          </div>

          <button
            onClick={handleMiListaClick}
            className="bg-[#039dbf] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#02829e] transition font-medium cursor-pointer relative text-sm"
          >
            Mi Lista ({selectedItems.length})
            {selectedItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {selectedItems.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      <main className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* ===== BARRA DE FAMILIAS - MÓVIL (scroll horizontal) ===== */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-4 -mx-4 px-4 scrollbar-hide">
            {secciones_catalogo.map((seccion) => {
              const activa = seccion.id_seccion === familiaActiva.id_seccion
              return (
                <button
                  key={seccion.id_seccion}
                  onClick={() => router.push(`/combos/${seccion.id_seccion}`)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${activa
                    ? 'bg-[#039dbf] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {seccion.titulo_seccion}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* ===== SIDEBAR - FAMILIAS (25%, solo escritorio) ===== */}
            <aside className="hidden md:block md:w-1/4 flex-shrink-0">
              <div className="sticky top-20">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-3">
                  Familias de Equipos
                </h2>
                <nav className="space-y-1">
                  {secciones_catalogo.map((seccion) => {
                    const activa = seccion.id_seccion === familiaActiva.id_seccion
                    return (
                      <button
                        key={seccion.id_seccion}
                        onClick={() => router.push(`/combos/${seccion.id_seccion}`)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${activa
                          ? 'bg-[#039dbf]/10 text-[#039dbf] border-l-4 border-[#039dbf]'
                          : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                      >
                        {seccion.titulo_seccion}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </aside>

            {/* ===== GRID - COMBOS DE LA FAMILIA ACTIVA (75%) ===== */}
            <div className="flex-1 min-w-0">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0b0f19] mb-2">{familiaActiva.titulo_seccion}</h1>
                <p className="text-sm text-gray-500">
                  {familiaActiva.productos.length} {familiaActiva.productos.length === 1 ? 'configuración disponible' : 'configuraciones disponibles'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {familiaActiva.productos.map((product) => {
                  const badge = extraerBadgeCombo(product.nombre)
                  const { precio, resto } = separarPrecio(product.especificaciones)
                  const specsPreview = obtenerSpecsPreview(resto, clavesDiferenciadoras, 3)
                  return (
                    <div
                      key={product.id}
                      onClick={() => router.push('/productos/' + product.id)}
                      className="group bg-gray-50 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-[#039dbf]/50 cursor-pointer"
                    >
                      <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-t-xl bg-white">
                        {badge && (
                          <span
                            className="absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                            style={{ backgroundColor: '#039dbf' }}
                          >
                            {badge}
                          </span>
                        )}
                        <img
                          src={product.imagenes_galeria && product.imagenes_galeria[0] ? product.imagenes_galeria[0] : '/placeholder.jpg'}
                          alt={product.nombre}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-2"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-[#0b0f19] mb-2 line-clamp-1">{product.nombre}</h3>

                        {/* Specs: truncadas por defecto, overlay revela el texto completo en hover */}
                        <div className="relative flex-grow mb-4">
                          <ul className="space-y-1.5">
                            {specsPreview.map((spec, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <span className="text-[#039dbf] mr-2 flex-shrink-0">✓</span>
                                <span className="line-clamp-1 min-w-0 flex-1">{spec}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="absolute inset-x-0 top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 opacity-0 translate-y-2 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                            <ul className="space-y-1.5">
                              {specsPreview.map((spec, idx) => (
                                <li key={idx} className="text-xs text-gray-700 flex items-start">
                                  <span className="text-[#039dbf] mr-2 flex-shrink-0">✓</span>
                                  <span>{spec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Precio: bloque grande y destacado, justo encima del CTA */}
                        {precio && (() => {
                          const [clavePrecio, ...restoPrecio] = precio.split(':')
                          const valorPrecio = restoPrecio.join(':').trim()
                          return (
                            <div className="mb-3 text-center py-3 rounded-lg bg-gray-100 border border-gray-200">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">{clavePrecio.trim()}</p>
                              <p className="text-2xl font-black" style={{ color: THEME_CONFIG.color_primario }}>{valorPrecio}</p>
                            </div>
                          )
                        })()}

                        <div className="space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push('/productos/' + product.id)
                            }}
                            className="w-full text-[#039dbf] hover:text-[#0b0f19] transition text-sm font-medium py-1 border-b border-gray-300 hover:border-[#039dbf]"
                            aria-label={`Ver ficha técnica de ${product.nombre}`}
                          >
                            Ficha Técnica →
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleProductInList(product.nombre)
                            }}
                            className={`w-full py-2 rounded font-semibold transition-all duration-300 ${selectedItems.includes(product.nombre)
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-[#039dbf] hover:bg-[#02829e] text-white'
                              }`}
                            aria-label={selectedItems.includes(product.nombre) ? `Quitar ${product.nombre}` : `Añadir ${product.nombre}`}
                          >
                            {selectedItems.includes(product.nombre) ? '[-] Quitar' : '[+] Añadir a mi Cotización'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ===== MODAL RESUMEN DE COTIZACIÓN ===== */}
        {showQuotationModal && selectedItems.length > 0 && (() => {
          const quotationMessage = encodeURIComponent(
            `Hola APIC, solicito una cotización formal para los siguientes equipos seleccionados en su web:\n\n` +
            selectedItems.map((item) => `- ${item}`).join('\n') +
            `\n\nQuedo atento a los precios.`
          )
          const whatsappLink = `https://wa.me/${numero_whatsapp}?text=${quotationMessage}`

          return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
                <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-[#0b0f19]">Resumen de tu Cotización</h3>
                  <button
                    onClick={() => setShowQuotationModal(false)}
                    className="p-1 hover:bg-gray-100 rounded transition"
                    aria-label="Cerrar cotización"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="mb-8">
                    <h5 className="font-bold text-[#0b0f19] mb-4 text-lg">Equipos Seleccionados:</h5>
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

                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      <span className="text-[#039dbf] font-semibold">Total de equipos:</span> {selectedItems.length}
                    </p>
                  </div>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#039dbf] text-white py-4 rounded-lg font-bold text-center hover:bg-[#02829e] transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Enviar Cotización por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )
        })()}
      </main>

      {/* ===== BOTÓN FLOTANTE DE WHATSAPP ===== */}
      <a
        href={`https://wa.me/${numero_whatsapp}?text=Hola%20APIC,%20quiero%20información%20sobre%20sus%20productos`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-[#25d366] text-white rounded-full shadow-lg hover:bg-[#20ba5a] transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer border border-emerald-400/20 group"
        title="Contactar por WhatsApp"
        aria-label="Abrir WhatsApp para contactar"
      >
        <svg
          className="w-7 h-7 fill-current transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
          xmlns="http://w3.org"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.05-.149-.471-1.134-.646-1.554-.17-.41-.357-.353-.471-.355-.119-.002-.256-.002-.394-.002-.138 0-.363.052-.553.254-.19.202-.723.707-.723 1.724 0 1.017.737 2.001.839 2.137.102.137 1.448 2.21 3.51 3.1 1.014.437 1.83.698 2.457.897.102.032.222.03.355.01.293-.021 1.758-.718 2.008-1.378.25-.66.25-1.226.175-1.348-.075-.122-.274-.196-.571-.346zm-5.421 7.412c-1.848 0-3.655-.497-5.247-1.438l-.377-.224-3.9 1.023 1.042-3.805-.246-.391A10.207 10.207 0 0 1 1.94 12.04c0-5.656 4.605-10.261 10.263-10.261 2.739 0 5.314 1.067 7.25 3.008a10.194 10.194 0 0 1 3.011 7.255c-.004 5.657-4.61 10.262-10.263 10.262zm10.254-17.523A11.817 11.817 0 0 0 12.04 0C5.414 0 0 5.414 0 12.04c0 2.12.553 4.189 1.601 6.012L0 24l6.135-1.61a11.77 11.77 0 0 0 5.905 1.62h.005c6.621 0 12.04-5.414 12.04-12.04a11.815 11.817 0 0 0-3.535-8.523z" />
        </svg>
      </a>
    </>
  )
}