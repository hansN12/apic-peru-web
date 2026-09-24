'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { WEBSITE_CONFIG, THEME_CONFIG } from '@/app/config'
import { Phone, MessageCircle, ChevronLeft, Shield, Truck, Mail, Home } from 'lucide-react'
import { useCart } from '@/app/hooks/useCart'
import { separarPrecio, calcularDescuentoPorcentaje } from '@/app/lib/catalogCardHelpers'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = parseInt(params.id as string)

  // 🔄 Búsqueda unificada de productos: usa el flujo ya combinado de config.ts
  // (WEBSITE_CONFIG.CATALOGO_GENERAL se genera dinámicamente sobre secciones_catalogo)
  const allProducts = WEBSITE_CONFIG.CATALOGO_GENERAL
  const product = allProducts.find((p: any) => p.id === productId)

  const [activeImage, setActiveImage] = useState(product?.imagenes_galeria?.[0] || '')
  const [activeTab, setActiveTab] = useState('descripcion')
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isZoomed, setIsZoomed] = useState(false)
  const { selectedItems, setSelectedItems, toggleItem } = useCart()
  const { numero_whatsapp, redes_sociales } = WEBSITE_CONFIG

  // Injected Product State Reset: wipe stale details when route ID changes
  useEffect(() => {
    setActiveImage(product?.imagenes_galeria?.[0] || '')
    setActiveTab('descripcion')
  }, [productId])

  // Handle not found
  if (!product) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-[#0b0f19] mb-4">Producto no encontrado</h1>
          <p className="text-gray-600 mb-8">Lo sentimos, el producto que buscas no existe en nuestro catálogo.</p>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ backgroundColor: THEME_CONFIG.color_primario }}
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const isSelected = selectedItems.includes(product.nombre)

  const handleAddToQuotation = () => {
    toggleItem(product.nombre)
  }

  const handleWhatsAppQuote = () => {
    const message = `Hola, me interesa cotizar el producto: *${product.nombre}* (SKU: ${product.sku})`
    const whatsappUrl = `https://wa.me/${WEBSITE_CONFIG.numero_whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#0b0f19] hover:text-[#039dbf] transition group hover:-translate-x-0.5 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-[#0b0f19] px-3 py-1.5 rounded-lg border border-gray-200 transition-all font-bold text-xs uppercase tracking-widest cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
          >
            <Home className="w-3.5 h-3.5" />
            APIC
          </button>
          <div className="text-xs font-medium text-gray-600">
            Mi Lista <span className="font-bold" style={{ color: THEME_CONFIG.color_primario }}>({selectedItems.length})</span>
          </div>
        </div>
      </header>

      <main className="w-full bg-white">
        {/* BREADCRUMBS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
            <button onClick={() => router.push('/')} className="hover:text-gray-600 transition">Inicio</button>
            {' > '}
            <span>{product.categoria}</span>
            {' > '}
            <span className="truncate">{product.nombre}</span>
          </p>
        </div>

        {/* WIDESCREEN LAYOUT MATRIX */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT COLUMN: VISUAL SHOWCASE */}
            <div className="space-y-4">
              {/* MAIN IMAGE VIEWPORT WITH ZOOM MAGNIFIER */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseEnter={() => setIsZoomed(true)}
                className="aspect-square bg-white border-2 border-gray-200 rounded-2xl overflow-hidden relative cursor-zoom-in group"
              >
                {product.en_oferta && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded text-xs font-semibold text-white bg-slate-900/85 border border-white/10 tracking-wide">
                    {calcularDescuentoPorcentaje(product) ? `-${calcularDescuentoPorcentaje(product)}%` : 'OFERTA'}
                  </span>
                )}
                <img
                  src={activeImage}
                  alt={product.nombre}
                  className={`w-full h-full object-contain p-4 transition-transform duration-200 ${isZoomed ? 'scale-[2]' : 'scale-100'}`}
                  style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                />
              </div>

              {/* THUMBNAIL STRIP - VERTICAL */}
              {product.imagenes_galeria && product.imagenes_galeria.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ overscrollBehavior: 'contain' }}>
                  {product.imagenes_galeria.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onMouseEnter={() => setActiveImage(img)}
                      onClick={() => setActiveImage(img)}
                      className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                      style={{
                        borderColor: activeImage === img ? THEME_CONFIG.color_primario : '#e5e7eb',
                      }}
                      aria-label={`Ver imagen ${idx + 1}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain bg-gray-50 p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: COMMERCIAL & TECHNICAL DATA */}
            <div className="space-y-8">
              {/* PRODUCT NAME & BADGES */}
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: THEME_CONFIG.color_primario }}>
                  {product.categoria}
                </p>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0b0f19] uppercase tracking-tight mb-4">
                  {product.nombre}
                </h1>

                {/* PREMIUM HIGHLIGHT BADGES */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-green-800">🛡️ 1 Año de Garantía de Fábrica APIC</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-blue-800">🚚 Envíos a Nivel Nacional</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  <strong>SKU:</strong> {product.sku}
                </p>
              </div>

              {/* DESCRIPTION */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {product.descripcion_larga || product.descripcion}
                </p>
              </div>

              {/* PRECIO */}
              {(() => {
                const { precio } = separarPrecio(product.especificaciones)
                if (!precio) return null
                const [clavePrecio, ...restoPrecio] = precio.split(':')
                const valorPrecio = restoPrecio.join(':').trim()
                return (
                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{clavePrecio.trim()}</p>
                    <div className="flex items-center justify-center gap-3">
                      {product.precio_antes && (
                        <span className="text-lg text-gray-400 line-through">
                          {product.precio_antes.split(':')[1]?.trim()}
                        </span>
                      )}
                      <p className="text-3xl sm:text-4xl font-black" style={{ color: THEME_CONFIG.color_primario }}>
                        {valorPrecio}
                      </p>
                    </div>
                  </div>
                )
              })()}

              {/* FULL-WIDTH CTA BUTTONS WITH ELASTIC BOUNCE FEEDBACK */}
              <div className="space-y-3 pt-6">
                <button
                  onClick={handleAddToQuotation}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97] cursor-pointer ease-out ${isSelected
                      ? 'bg-red-50/20 backdrop-blur-sm text-red-600 border-2 border-red-500 font-extrabold shadow-sm hover:bg-red-100/40'
                      : 'bg-[#039dbf] text-white border border-white/10 shadow-[0_4px_20px_rgba(3,157,191,0.25)] hover:bg-[#02829e] hover:shadow-xl'
                    }`}
                >
                  {isSelected ? '[-] Quitar de mi Lista de Cotización' : '[+] Añadir a mi Lista de Cotización'}
                </button>
                <button
                  onClick={handleWhatsAppQuote}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97] flex items-center justify-center gap-2 border border-emerald-400/20 shadow-[0_4px_20px_rgba(16,185,129,0.2)] cursor-pointer ease-out"
                >
                  <MessageCircle size={20} />
                  Cotizar Ahora por WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* TAB PANELS & CTSA */}
          <div className="mt-16 border-t-2 border-gray-200 pt-12">
            {/* TAB TOGGLES SELECTOR */}
            <div className="flex gap-1 mb-8 border-b-2 border-gray-100 overflow-x-auto">
              {[
                { id: 'descripcion', label: 'Descripción Comercial' },
                { id: 'marca', label: 'Sobre la marca' },
                { id: 'tecnica', label: 'Ficha Técnica' },
                { id: 'garantias', label: 'Garantías' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-6 py-3 text-sm font-bold transition-all whitespace-nowrap relative"
                  style={{
                    color: activeTab === tab.id ? THEME_CONFIG.color_primario : '#9ca3af',
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: THEME_CONFIG.color_primario }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="max-w-4xl">
              {/* DESCRIPCIÓN */}
              {activeTab === 'descripcion' && (
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {product.especificaciones?.map((spec: string, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <span style={{ color: THEME_CONFIG.color_primario }} className="font-bold flex-shrink-0">✓</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* SOBRE LA MARCA */}
              {activeTab === 'marca' && (
                <div className="text-gray-700 leading-relaxed">
                  {product.sobre_la_marca}
                </div>
              )}

              {/* FICHA TÉCNICA */}
              {activeTab === 'tecnica' && (
                <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                  {product.ficha_tecnica?.map((spec: any, idx: number) => {
                    const [propName, propValue] = spec.label.includes(':')
                      ? [spec.label.split(':')[0].trim(), spec.label.split(':')[1].trim()]
                      : [spec.label, spec.valor]

                    return (
                      <div
                        key={idx}
                        className="flex border-b border-gray-100 last:border-b-0"
                        style={{ backgroundColor: idx % 2 === 0 ? '#f9fafb' : '#ffffff' }}
                      >
                        <div className="flex-1 p-4 border-r border-gray-100">
                          <p className="font-bold text-sm" style={{ color: THEME_CONFIG.color_primario }}>
                            {propName}
                          </p>
                        </div>
                        <div className="flex-1 p-4">
                          <p className="text-gray-600 text-sm">{propValue}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* GARANTÍAS */}
              {activeTab === 'garantias' && (
                <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                  {product.garantias
                    ?.filter((gal: any) => !gal.pregunta.toLowerCase().includes('instalaci'))
                    .map((gal: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0"
                        style={{ backgroundColor: idx % 2 === 0 ? '#f9fafb' : '#ffffff' }}
                      >
                        <p className="text-gray-800 text-sm font-medium flex-1">{gal.pregunta}</p>
                        <p
                          className="font-bold text-sm px-4 py-1 rounded whitespace-nowrap"
                          style={{
                            color: gal.respuesta === 'SÍ' ? '#059669' : '#dc2626',
                            backgroundColor: gal.respuesta === 'SÍ' ? '#ecfdf5' : '#fef2f2',
                          }}
                        >
                          {gal.respuesta}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ===== FOOTER / CONTACTO - PREMIUM 4 COLUMN CORPORATE LAYOUT ===== */}
      <footer id="contacto" className="bg-[#0b0f19] text-white py-14 sm:py-20 border-t border-gray-800 min-h-[60vh] scroll-mt-14" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-6 mb-12 sm:mb-16">
            <div className="max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              <h4 className="text-xl font-bold mb-6 flex items-center space-x-2 max-sm:justify-center">
                <img
                  src="/apic_icon.png"
                  alt="APIC"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>APIC</span>
              </h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                Innovación, calidad y garantía en equipos para eventos y producción audiovisual.
              </p>
            </div>

            <div className="max-sm:text-center">
              <h4 className="text-sm sm:text-base font-bold mb-6 uppercase tracking-wider" style={{ color: THEME_CONFIG.color_primario }}>Navegación</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-white transition cursor-pointer" style={{ ':hover': { color: THEME_CONFIG.color_primario } }}>Inicio</a></li>
                <li><a href="/" className="hover:text-white transition cursor-pointer" style={{ ':hover': { color: THEME_CONFIG.color_primario } }}>Catálogo</a></li>
                <li><a href="/" className="hover:text-white transition cursor-pointer" style={{ ':hover': { color: THEME_CONFIG.color_primario } }}>Combos</a></li>
                <li><a href="/" className="hover:text-white transition cursor-pointer" style={{ ':hover': { color: THEME_CONFIG.color_primario } }}>Contacto</a></li>
              </ul>
            </div>

            <div className="max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              <h4 className="text-sm sm:text-base font-bold mb-6 uppercase tracking-wider" style={{ color: THEME_CONFIG.color_primario }}>Contacto</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2 max-sm:justify-center">
                  <Phone className="w-4 h-4" style={{ color: THEME_CONFIG.color_primario }} />
                  +{WEBSITE_CONFIG.numero_whatsapp_m}
                </li>
                <li className="flex items-center gap-2 max-sm:justify-center">
                  <Mail className="w-4 h-4" style={{ color: THEME_CONFIG.color_primario }} />
                  {WEBSITE_CONFIG.correo_contacto}
                </li>
              </ul>
            </div>

            <div className="max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              <h4 className="text-sm sm:text-base font-bold mb-6 uppercase tracking-wider" style={{ color: THEME_CONFIG.color_primario }}>Síguenos</h4>
              <div className="flex gap-3 max-sm:justify-center">
                {/* 🎵 TIKTOK (SVG Oficial) */}
                <a
                  href={redes_sociales?.tiktok || '#'}
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
                  href={redes_sociales?.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1f2937] hover:bg-[#039dbf] transition flex items-center justify-center text-white cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://w3.org">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <circle cx="17.5" cy="6.5" r="1.5"></circle>
                  </svg>
                </a>

                {/* 👥 FACEBOOK (SVG Oficial) */}
                <a
                  href={redes_sociales?.facebook || '#'}
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
    </>
  )
}