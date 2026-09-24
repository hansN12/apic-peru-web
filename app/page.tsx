'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MessageCircle, Mail, Phone, Menu, Shield, Truck, ShoppingCart, X } from 'lucide-react'
import { WEBSITE_CONFIG } from '@/app/config'
import { useCart } from '@/app/hooks/useCart'
import { extraerBadgeCombo, separarPrecio, obtenerPrecioNumerico, obtenerSpecsPreview, calcularDescuentoPorcentaje } from '@/app/lib/catalogCardHelpers'

export default function Page() {
  const router = useRouter()
  const { selectedItems, toggleItem: toggleProductInList } = useCart()
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const heroRef = useRef<HTMLElement>(null)

  const { numero_whatsapp, temporadas_carrusel, secciones_catalogo, metricas_nosotros, redes_sociales } = WEBSITE_CONFIG

  // 🔄 LÓGICA UNIFICADA: usar el flujo ya combinado de config.ts para búsqueda en modal
  const allProducts = WEBSITE_CONFIG.CATALOGO_GENERAL

  // 🗂️ ARQUITECTURA DINÁMICA DE CATEGORÍAS (Mega Menu + Grid Principal)
  // Se deriva directamente de 'secciones_catalogo' (WEBSITE_CONFIG): ahora cada
  // sección es una FAMILIA MADRE de producto (Plataforma 360, Domos, etc.), y
  // cada nivel Combo N dentro de ella es su propio producto individual. Agregar
  // una nueva familia en config.ts basta para que aparezca aquí automáticamente,
  // sin tocar este archivo.
  const catalogSections = secciones_catalogo.map((seccion) => ({
    slug: seccion.id_seccion,
    titulo: seccion.titulo_seccion,
    productos: seccion.productos,
  }))

  // 🏷️ LIQUIDACIÓN DE STOCK / PROMOCIONES: regla de negocio explícita —
  // solo entran productos marcados manualmente 'en_oferta: true' en
  // config.ts. Se ordenan mostrando primero el mayor % de descuento.
  const productosLiquidacion = WEBSITE_CONFIG.CATALOGO_GENERAL
    .filter((p: any) => p.en_oferta === true)
    .sort((a: any, b: any) => (calcularDescuentoPorcentaje(b) || 0) - (calcularDescuentoPorcentaje(a) || 0))

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % temporadas_carrusel.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + temporadas_carrusel.length) % temporadas_carrusel.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // ⏱️ AUTOPLAY CAROUSEL - 5 segundos (Pausa cuando hero no está visible).
  // Con un solo slide configurado no hay nada que rotar: el efecto no-opea
  // para no correr un intervalo inútil, pero queda listo para escalar
  // automáticamente en cuanto se agregue una segunda diapositiva.
  useEffect(() => {
    if (!isHeroVisible || temporadas_carrusel.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % temporadas_carrusel.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isHeroVisible, temporadas_carrusel.length])

  // 🎯 INTERSECTION OBSERVER - Detectar si hero section está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  // Cart management is now handled by useCart hook (SSOT)

  // 🔔 MANEJADOR DEL BOTÓN "MI LISTA"
  const handleMiListClick = () => {
    if (selectedItems.length === 0) {
      //alert('Por favor, añade al menos un equipo a tu lista para cotizar.')
      return
    }
    setShowQuotationModal(true)
  }

  // 🎬 NATIVE SMOOTH SCROLL ENGINE - BULLETPROOF BROWSER API
  // Uses native scrollIntoView with smooth behavior for reliable cross-browser performance
  // With html scroll-behavior: smooth in globals.css for guaranteed cinematic transitions
  const smoothScrollToElement = (elementId: string) => {
    // Ensure DOM is ready and use requestAnimationFrame for optimal timing
    requestAnimationFrame(() => {
      const element = document.getElementById(elementId)
      if (!element) {
        console.log('[v0] Element not found:', elementId)
        return
      }

      // Native browser smooth scroll with proper spacing for sticky header
      // scroll-mt-14 on target elements prevents header overlap
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    })
  }

  // 🧲 EFECTO MAGNÉTICO (tarjetas de Nosotros): actualiza la posición del
  // cursor directamente como variables CSS sobre el elemento vía el DOM,
  // sin pasar por estado de React. Es la vía de menor costo para un efecto
  // que se dispara en cada mousemove — evita re-renders y por lo tanto
  // cualquier lag de layout.
  const handleMetricCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <>
      {/* ===== HEADER NAVEGACIÓN - LIGHT THEME ===== */}
      {/* 🚨 EDITAR NAVEGACIÓN Y ENLACES AQUÍ 🚨 */}
      <header
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 relative"
        onMouseLeave={() => setIsMegaMenuOpen(false)}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between h-14">
          <div className="flex items-center space-x-2">
            <img
              src="/apic_icon.png"
              alt="APIC"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-lg sm:text-xl font-bold text-[#0b0f19]">APIC</span>
          </div>

          {/* DESKTOP NAVIGATION */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); smoothScrollToElement('inicio') }}
                className="text-[#0b0f19] hover:text-[#039dbf] transition font-semibold text-sm cursor-pointer"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); smoothScrollToElement('nosotros') }}
                className="text-[#0b0f19] hover:text-[#039dbf] transition font-semibold text-sm cursor-pointer"
              >
                Nosotros
              </a>
            </li>
            <li
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setIsMegaMenuOpen(false)
                  router.push('/combos/all')
                }}
                className="text-[#0b0f19] hover:text-[#039dbf] transition font-semibold text-sm cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isMegaMenuOpen}
              >
                Productos
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); smoothScrollToElement('contacto') }}
                className="text-[#0b0f19] hover:text-[#039dbf] transition font-semibold text-sm cursor-pointer"
              >
                Contacto
              </a>
            </li>
          </ul>

          {/* DESKTOP MI LISTA BUTTON */}
          <button
            onClick={handleMiListClick}
            className="hidden md:block bg-[#039dbf] text-white px-6 py-2 rounded-lg hover:bg-[#02829e] transition font-medium cursor-pointer relative"
          >
            Mi Lista ({selectedItems.length})
            {selectedItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {selectedItems.length}
              </span>
            )}
          </button>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#0b0f19]" />
            ) : (
              <Menu className="w-6 h-6 text-[#0b0f19]" />
            )}
          </button>
        </nav>

        {/* ===== MEGA MENU - PRODUCTOS (DESKTOP) ===== */}
        {/* 🚨 PANEL MINIMALISTA: enlaza únicamente a las FAMILIAS MADRE de producto  */}
        {/* (Plataforma 360, Domos, etc.), nunca a combos ni variantes individuales.  */}
        {/* Se genera automáticamente recorriendo 'catalogSections' — agregar una     */}
        {/* nueva familia en config.ts la refleja aquí sin tocar este bloque.         */}
        {/* 📐 CONTENCIÓN DE CRECIMIENTO: el área de familias tiene una altura tope   */}
        {/* (60% del viewport) con scroll interno propio — el panel nunca crece sin   */}
        {/* límite ni tapa la pantalla, sin importar si hay 11 o 40 familias.         */}
        {isMegaMenuOpen && (
          <div className="hidden md:block absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-xl z-40">
            <style>{`
              .mega-menu-scroll::-webkit-scrollbar { width: 6px; }
              .mega-menu-scroll::-webkit-scrollbar-track { background: transparent; }
              .mega-menu-scroll::-webkit-scrollbar-thumb { background-color: rgba(3, 157, 191, 0.3); border-radius: 9999px; }
              .mega-menu-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(3, 157, 191, 0.5); }
            `}</style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
              <div className="mega-menu-scroll max-h-[60vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {catalogSections.map((section) => (
                    <a
                      key={section.slug}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setIsMegaMenuOpen(false)
                        router.push(`/combos/${section.slug}`)
                      }}
                      className="flex items-center gap-3 p-3.5 rounded-lg border border-gray-200/80 hover:border-[#039dbf]/50 hover:bg-gray-50 transition-all duration-300 cursor-pointer group"
                    >
                      <span className="w-1 h-5 bg-[#039dbf] flex-shrink-0"></span>
                      <span className="text-sm font-semibold tracking-wide text-gray-700 group-hover:text-[#039dbf] transition">
                        {section.titulo}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              {/* Desvanecido inferior: indica sutilmente que hay más contenido para desplazar */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/95 to-transparent"></div>
            </div>
          </div>
        )}

        {/* MOBILE DROPDOWN MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    smoothScrollToElement('inicio')
                    setMobileMenuOpen(false)
                  }}
                  className="text-[#0b0f19] hover:text-[#039dbf] transition font-medium block py-2 cursor-pointer"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    smoothScrollToElement('nosotros')
                    setMobileMenuOpen(false)
                  }}
                  className="text-[#0b0f19] hover:text-[#039dbf] transition font-medium block py-2 cursor-pointer"
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setMobileMenuOpen(false)
                    router.push('/combos/all')
                  }}
                  className="text-[#0b0f19] hover:text-[#039dbf] transition font-medium block py-2 cursor-pointer"
                >
                  Productos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    smoothScrollToElement('contacto')
                    setMobileMenuOpen(false)
                  }}
                  className="text-[#0b0f19] hover:text-[#039dbf] transition font-medium block py-2 cursor-pointer"
                >
                  Contacto
                </a>
              </li>
              <li className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleMiListClick()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full bg-[#039dbf] text-white px-4 py-2 rounded-lg hover:bg-[#02829e] transition font-medium cursor-pointer relative"
                >
                  Mi Lista ({selectedItems.length})
                  {selectedItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {selectedItems.length}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main className="bg-white">
        {/* ===== HERO SECTION CON CARRUSEL - MAPEADO DESDE CONFIG.TS ===== */}
        {/* 🎡 Recorre 'temporadas_carrusel'. Hoy trae una sola diapositiva */}
        {/* (mensaje corporativo general), por lo que flechas/indicadores  */}
        {/* se ocultan automáticamente — pero el carrusel está listo para */}
        {/* escalar en cuanto se agregue una segunda diapositiva.         */}
        <section
          ref={heroRef}
          id="inicio"
          className="relative w-full min-h-[85vh] sm:min-h-screen overflow-hidden scroll-mt-14"
          role="region"
          aria-label="Carrusel principal"
        >
          <div
            className="flex w-full h-full min-h-[85vh] sm:min-h-screen transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {temporadas_carrusel.map((slide) => (
              <div
                key={slide.evento_id}
                className="relative w-full min-h-[85vh] sm:min-h-screen flex-shrink-0 flex items-center justify-center overflow-hidden bg-cover bg-center py-20 sm:py-24"
                style={{
                  backgroundImage: slide.imagen_url
                    ? `url(${slide.imagen_url})`
                    : slide.imagen_carrusel || 'linear-gradient(135deg, #0b0f19 0%, #1f2937 100%)',
                }}
              >
                {/* Overlay oscuro: asegura contraste del texto blanco tanto sobre una foto como sobre el degradado */}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #039dbf, transparent 55%)' }}></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                  <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance">{slide.titulo_carrusel}</h1>
                  <p className="text-base sm:text-lg lg:text-2xl mb-6 sm:mb-8 text-gray-300">{slide.subtitulo_carrusel}</p>
                  <button
                    onClick={() => smoothScrollToElement('liquidacion')}
                    className="bg-[#039dbf] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#02829e] transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    Ver Promociones de Stock
                  </button>
                </div>
              </div>
            ))}
          </div>

          {temporadas_carrusel.length > 1 && (
            <>
              <div
                onClick={() => prevSlide()}
                className="absolute left-0 top-0 w-[8%] h-full z-10 cursor-pointer group hover:bg-black/10 transition duration-300 flex items-center justify-start pl-3"
                aria-label="Ir a diapositiva anterior"
                role="button"
                tabIndex={0}
              >
                <ChevronLeft className="w-8 h-8 text-white/60 group-hover:text-white group-hover:scale-125 transition duration-300" />
              </div>
              <div
                onClick={() => nextSlide()}
                className="absolute right-0 top-0 w-[8%] h-full z-10 cursor-pointer group hover:bg-black/10 transition duration-300 flex items-center justify-end pr-3"
                aria-label="Ir a siguiente diapositiva"
                role="button"
                tabIndex={0}
              >
                <ChevronRight className="w-8 h-8 text-white/60 group-hover:text-white group-hover:scale-125 transition duration-300" />
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {temporadas_carrusel.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition duration-300 ${index === currentSlide ? 'bg-[#039dbf] w-8 h-3 rounded-full' : 'bg-white/50 hover:bg-white w-3 h-3 rounded-full'
                      }`}
                    aria-label={`Ir a la diapositiva ${index + 1}`}
                    aria-current={index === currentSlide ? 'true' : 'false'}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ===== TRUST BAR - GARANTÍA Y ENVÍOS ===== */}
        <section className="bg-[#0b0f19] text-white py-4 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Garantía */}
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-[#039dbf] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">1 Año de Garantía de Fábrica</h3>
                  <p className="text-sm text-gray-300">Equipos confiables preparados para uso profesional continuo</p>
                </div>
              </div>
              {/* Envíos */}
              <div className="flex items-start space-x-4">
                <Truck className="w-8 h-8 text-[#039dbf] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Envíos a Todo el Perú</h3>
                  <p className="text-sm text-gray-300">Despachos nacionales por: Marvisur, Shalom, Flores, etc.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECCIÓN NOSOTROS ===== */}
        <section id="nosotros" className="py-14 sm:py-20 lg:py-24 bg-[#111827] min-h-[85vh] scroll-mt-14">
          <style>{`
            @keyframes respirarTarjetaNosotros {
              0%, 100% { border-color: rgb(31 41 55); box-shadow: 0 0 0 rgba(3, 157, 191, 0); }
              50% { border-color: rgba(3, 157, 191, 0.45); box-shadow: 0 0 24px rgba(3, 157, 191, 0.18); }
            }
            .tarjeta-nosotros-respirando {
              animation: respirarTarjetaNosotros 4s ease-in-out infinite;
            }
          `}</style>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">Nosotros</h2>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg">En APIC diseñamos y fabricamos equipos para la industria audiovisual y el sector de eventos. Con más de 10 años de experiencia, desarrollamos soluciones innovadoras, confiables y de alta calidad, pensadas para ofrecer el máximo rendimiento en un uso profesional</p>
              <div className="w-20 h-1 bg-[#039dbf] mx-auto mt-4 sm:mt-6"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {metricas_nosotros.map((metrica, idx) => (
                <div
                  key={idx}
                  onMouseMove={handleMetricCardMouseMove}
                  className="tarjeta-nosotros-respirando relative group bg-gradient-to-br from-[#1f2937] to-[#0b0f19] rounded-xl border border-[#1f2937] hover:border-[#039dbf] transition-all duration-300 overflow-hidden"
                  style={{ ['--mouse-x' as any]: '50%', ['--mouse-y' as any]: '50%', animationDelay: `${idx * 0.6}s` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(3, 157, 191, 0.35), transparent 60%)',
                    }}
                  ></div>

                  <div className="relative z-10 flex flex-col items-center justify-center text-center h-full min-h-[220px] p-6 sm:p-8">
                    <div className="mb-4 sm:mb-6">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#039dbf] drop-shadow-lg" style={{
                        textShadow: '0 0 20px rgba(3, 157, 191, 0.5)'
                      }}>
                        {metrica.numero}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {metrica.subtitulo}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#039dbf] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECCIÓN LIQUIDACIÓN DE STOCK / PROMOCIONES ===== */}
        {/* 🏷️ Grilla compacta: solo el producto de entrada de cada familia, */}
        {/* ordenado por precio real ascendente (ver productosLiquidacion). */}
        <section id="liquidacion" className="py-14 sm:py-20 lg:py-24 bg-white border-t border-gray-100 scroll-mt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0b0f19] mb-4">Promociones de Stock</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Una selección de nuestros equipos de entrada con el mejor precio. Para ver todos los combos de cada familia, visita nuestro catálogo completo.</p>
              <div className="w-20 h-1 bg-[#039dbf] mx-auto mt-4 sm:mt-6"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {productosLiquidacion.map((product: any) => {
                const badge = extraerBadgeCombo(product.nombre)
                const { precio, resto } = separarPrecio(product.especificaciones)
                const specsPreview = obtenerSpecsPreview(resto, new Set(), 3)
                const descuento = calcularDescuentoPorcentaje(product)
                return (
                  <div
                    key={product.id}
                    onClick={() => router.push('/productos/' + product.id)}
                    className="group bg-gray-50 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full transition-all duration-300 hover:scale-[1.03] hover:shadow-md hover:border-[#039dbf]/50 cursor-pointer"
                  >
                    <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-t-xl bg-white">
                      {badge && (
                        <span
                          className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-md"
                          style={{ backgroundColor: '#039dbf' }}
                        >
                          {badge}
                        </span>
                      )}
                      {product.en_oferta && (
                        <span className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded text-[10px] font-semibold text-white bg-slate-900/85 border border-white/10 tracking-wide">
                          {descuento ? `-${descuento}%` : 'OFERTA'}
                        </span>
                      )}
                      <img
                        src={product.imagenes_galeria && product.imagenes_galeria[0] ? product.imagenes_galeria[0] : '/placeholder.jpg'}
                        alt={product.nombre}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-2"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      <h4 className="text-sm sm:text-base font-bold text-[#0b0f19] mb-2 line-clamp-1">{product.nombre}</h4>
                      <div className="relative flex-grow mb-3">
                        <ul className="space-y-1">
                          {specsPreview.slice(0, 2).map((spec, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <span className="w-2 h-px bg-[#039dbf] mt-2 mr-2 flex-shrink-0"></span>
                              <span className="truncate min-w-0 flex-1">{spec}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="absolute inset-x-0 top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 z-20 opacity-0 translate-y-2 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                          <ul className="space-y-1">
                            {specsPreview.map((spec, idx) => (
                              <li key={idx} className="text-[11px] text-gray-700 flex items-start">
                                <span className="w-2 h-px bg-[#039dbf] mt-2 mr-2 flex-shrink-0"></span>
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {precio && (() => {
                        const [clavePrecio, ...restoPrecio] = precio.split(':')
                        const valorPrecio = restoPrecio.join(':').trim()
                        return (
                          <div className="mb-2 text-center py-1.5 rounded-lg bg-gray-100 border border-gray-200">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{clavePrecio.trim()}</p>
                            <div className="flex items-center justify-center gap-2">
                              {product.precio_antes && (
                                <span className="text-xs text-gray-400 line-through">
                                  {product.precio_antes.split(':')[1]?.trim()}
                                </span>
                              )}
                              <p className="text-base sm:text-lg font-bold" style={{ color: '#039dbf' }}>{valorPrecio}</p>
                            </div>
                          </div>
                        )
                      })()}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleProductInList(product.nombre)
                        }}
                        className={`w-full py-1.5 sm:py-2 rounded text-xs sm:text-sm font-semibold transition-all duration-300 ${selectedItems.includes(product.nombre)
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-[#039dbf] hover:bg-[#02829e] text-white'
                          }`}
                        aria-label={selectedItems.includes(product.nombre) ? `Quitar ${product.nombre}` : `Añadir ${product.nombre}`}
                      >
                        {selectedItems.includes(product.nombre) ? '[-] Quitar' : '[+] Añadir'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-10 sm:mt-12">
              <button
                onClick={() => router.push('/combos/all')}
                className="bg-[#0b0f19] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1f2937] transition-all duration-300 cursor-pointer"
              >
                Ver Catálogo Completo →
              </button>
            </div>
          </div>
        </section>


        {/* ===== MODALES ===== */}


        {/* MODAL RESUMEN DE COTIZACIÓN */}
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
                            <span className="w-3 h-px bg-[#039dbf] mr-3 flex-shrink-0"></span>
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

      {/* ===== FLOATING WHATSAPP BUTTON CON LOGO OFICIAL CENTRADO SÍ O SÍ ===== */}
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


      {/* ===== FOOTER / CONTACTO ===== */}
      <footer id="contacto" className="bg-[#0b0f19] text-white py-14 sm:py-20 border-t border-gray-800 min-h-[80vh] scroll-mt-14" role="contentinfo">
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
              <h4 className="text-sm sm:text-base font-bold mb-6 uppercase tracking-wider text-[#039dbf]">Navegación</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" onClick={(e) => { e.preventDefault(); smoothScrollToElement('inicio') }} className="hover:text-[#039dbf] transition cursor-pointer">Inicio</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); smoothScrollToElement('nosotros') }} className="hover:text-[#039dbf] transition cursor-pointer">Nosotros</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); router.push('/combos/all') }} className="hover:text-[#039dbf] transition cursor-pointer">Productos</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); smoothScrollToElement('contacto') }} className="hover:text-[#039dbf] transition cursor-pointer">Contacto</a></li>
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
    </>
  )
}