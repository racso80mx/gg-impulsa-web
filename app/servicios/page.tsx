'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* ========================================================= */}
      {/* BARRA SUPERIOR DE CONTACTO RÁPIDO                         */}
      {/* ========================================================= */}
      <div className="bg-black text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-2">
              ✉️ INFO@GGIMPULSA.COM
            </span>
            <span className="flex items-center gap-2">
              📞 +52 993 196 4892
            </span>
          </div>
          <div className="hidden md:block tracking-widest text-gray-400">
            VILLAHERMOSA, TABASCO
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HEADER PRINCIPAL / NAVEGACIÓN                             */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="G Impulsa Logo" width={160} height={45} className="object-contain" priority />
          </Link>
          <nav className="hidden md:flex space-x-8 items-center font-medium text-sm">
            <Link href="/" className="hover:text-[#C5A059] transition">INICIO</Link>
            <Link href="/propiedades" className="hover:text-[#C5A059] transition">PROPIEDADES</Link>
            <Link href="/servicios" className="text-[#C5A059] font-bold border-b-2 border-[#C5A059] pb-1">SERVICIOS</Link>
            <Link href="/servicios" className="hover:text-[#C5A059] transition">NOSOTROS</Link>
            <Link href="/login" className="text-gray-700 hover:text-[#C5A059] transition flex items-center gap-1">
              <span>👤</span> STAFF
            </Link>
            <Link href="/servicios" className="bg-black text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#C5A059] hover:text-black transition flex items-center gap-2">
              <span>💬</span> CONTACTO
            </Link>
          </nav>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO SECTION: NUESTROS SERVICIOS                          */}
      {/* ========================================================= */}
      <section className="bg-gray-50 py-20 text-center border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight mb-4 uppercase">
            Nuestros Servicios
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ofrecemos soluciones integrales en bienes raíces e ingeniería, respaldadas por un equipo de profesionales certificados en Tabasco.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN 1: EDIFICACIÓN Y MANTENIMIENTO (Fondo Claro)        */}
      {/* ========================================================= */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="inline-block bg-[#C5A059]/15 text-[#8a7024] font-bold text-xs uppercase px-4 py-1.5 rounded-full mb-4 tracking-wider">
            🏗️ Ingeniería Civil
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Imagen ilustrativa de construcción */}
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10"></div>
              {/* Puedes cambiar esta URL por una imagen local en public/ */}
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18f1548?q=80&w=1000&auto=format&fit=crop" 
                alt="Edificación y Mantenimiento" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenido y características */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black mb-4 uppercase">
                Edificación y Mantenimiento
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Desarrollamos proyectos de obra civil desde la planeación hasta la entrega final, garantizando seguridad estructural y cumplimiento normativo en cada etapa.
              </p>

              {/* Cuadrícula de características */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <span className="text-[#C5A059] font-bold text-lg">✔</span>
                  <span className="font-bold text-sm text-gray-800">Obra Civil Integral</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <span className="text-[#C5A059] font-bold text-lg">✔</span>
                  <span className="font-bold text-sm text-gray-800">Instalaciones Eléctricas</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <span className="text-[#C5A059] font-bold text-lg">✔</span>
                  <span className="font-bold text-sm text-gray-800">Mantenimiento Industrial</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <span className="text-[#C5A059] font-bold text-lg">✔</span>
                  <span className="font-bold text-sm text-gray-800">Remodelaciones Corporativas</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <span className="text-[#C5A059] font-bold text-lg">✔</span>
                  <span className="font-bold text-sm text-gray-800">Supervisión de Obra</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                  <span className="text-[#C5A059] font-bold text-lg">✔</span>
                  <span className="font-bold text-sm text-gray-800">Presupuestos y Costos</span>
                </div>
              </div>

              <div className="mt-8">
                <Link href="#contacto" className="inline-block bg-black text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#C5A059] hover:text-black transition shadow-md">
                  Cotizar Proyecto
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN 2: TOPOGRAFÍA ESPECIALIZADA (Fondo Oscuro/Negro)    */}
      {/* ========================================================= */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="inline-block bg-[#C5A059] text-black font-bold text-xs uppercase px-4 py-1.5 rounded-full mb-4 tracking-wider">
            📐 Precisión Técnica
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Texto y características */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
                Topografía Especializada
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Utilizamos tecnología de punta para garantizar la precisión milimétrica en levantamientos y delimitaciones de propiedad en todo el sureste mexicano.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-[#111111] p-5 rounded-xl border border-gray-800 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#C5A059]/20 rounded-lg flex items-center justify-center text-[#C5A059] font-bold text-lg flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Levantamientos UTM</h4>
                    <p className="text-gray-400 text-sm">Coordenadas precisas para trámites oficiales y registros notariales.</p>
                  </div>
                </div>

                <div className="bg-[#111111] p-5 rounded-xl border border-gray-800 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#C5A059]/20 rounded-lg flex items-center justify-center text-[#C5A059] font-bold text-lg flex-shrink-0">
                    📐
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Deslindes de Propiedad</h4>
                    <p className="text-gray-400 text-sm">Definición exacta de límites territoriales para evitar litigios o controversias.</p>
                  </div>
                </div>
              </div>

              <Link href="#contacto" className="inline-block bg-[#C5A059] text-black font-bold px-8 py-3.5 rounded-xl hover:bg-white transition shadow-md">
                Solicitar Estudio Topográfico
              </Link>
            </div>

            {/* Imagen ilustrativa de topografía */}
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <img 
                src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1000&auto=format&fit=crop" 
                alt="Topografía Especializada" 
                className="w-full h-full object-cover"
              />
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN 3: LLAMADO A LA ACCIÓN (Asesoría Técnica)         */}
      {/* ========================================================= */}
      <section className="py-20 bg-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-4 bg-white p-12 rounded-3xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-black text-black mb-3 uppercase">
            ¿Necesitas Asesoría Técnica?
          </h2>
          <p className="text-gray-600 mb-8">
            Nuestros ingenieros y topógrafos certificados están listos para atenderte hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:9931964892" className="bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-[#C5A059] hover:text-black transition shadow-lg flex items-center justify-center gap-2">
              <span>📞</span> LLAMAR AHORA
            </a>
            <a href="https://wa.me/529931964892" target="_blank" rel="noopener noreferrer" className="border-2 border-black text-black font-bold px-8 py-4 rounded-xl hover:bg-black hover:text-white transition shadow-sm flex items-center justify-center gap-2">
              <span>💬</span> WHATSAPP ASESORÍA
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER CORPORATIVO                                        */}
      {/* ========================================================= */}
      <footer id="contacto" className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10 mb-12">
          
          <div>
            <h3 className="text-xl font-bold mb-4">GG Impulsa</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Expertos en el mercado inmobiliario y servicios de ingeniería civil en Villahermosa, Tabasco. Compromiso, transparencia y profesionalismo en cada proyecto.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase text-[#C5A059] mb-4 tracking-wider">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
              <li><Link href="/propiedades" className="hover:text-white transition">Mapa de Propiedades</Link></li>
              <li><Link href="/propiedades" className="hover:text-white transition">Venta de Propiedades</Link></li>
              <li><Link href="/servicios" className="hover:text-white transition">Servicios de Ingeniería</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase text-[#C5A059] mb-4 tracking-wider">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">📍 Villahermosa, Tabasco, México</li>
              <li className="flex items-center gap-2">📞 +52 993 196 4892</li>
              <li className="flex items-center gap-2">✉️ info@ggimpulsa.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase text-[#C5A059] mb-4 tracking-wider">Redes Sociales</h4>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-full flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition">f</a>
              <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-full flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition">ig</a>
              <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-full flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition">tk</a>
              <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-full flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition">in</a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-900 text-center text-xs text-gray-500">
          © 2026 GG Impulsa. Todos los derechos reservados. Villahermosa, Tabasco.
        </div>
      </footer>

    </div>
  );
}