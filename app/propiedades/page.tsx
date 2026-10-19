'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { ssr: false });

export default function PropiedadesPage() {
  const [operacion, setOperacion] = useState('venta');
  const [tipoInmueble, setTipoInmueble] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [properties, setProperties] = useState<any[]>([]);

  // Consultar propiedades desde la API conectada a MySQL al cargar la página
  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data);
        } else {
          // Datos de respaldo si la tabla de MySQL está vacía
          setProperties([
            { id: 1, title: 'Residencia Exclusiva en Venta', price: 3500000, location: 'Villahermosa, Tabasco', lat: 17.9892, lng: -92.9283 },
            { id: 2, title: 'Terreno Comercial Estratégico', price: 1800000, location: 'Cárdenas, Tabasco', lat: 17.9950, lng: -93.3750 },
            { id: 3, title: 'Bodega Industrial / Comercial', price: 5200000, location: 'Huimanguillo, Tabasco', lat: 17.8350, lng: -93.3900 },
          ]);
        }
      })
      .catch((err) => {
        console.error('Error al cargar propiedades:', err);
      });
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-900 font-sans">
      
      {/* BARRA SUPERIOR DE CONTACTO RÁPIDO */}
      <div className="bg-black text-white text-xs py-1.5 px-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span>✉️ INFO@GGIMPULSA.COM</span>
            <span>📞 +52 993 196 4892</span>
          </div>
          <div className="hidden md:block tracking-widest text-gray-400">
            VILLAHERMOSA, TABASCO
          </div>
        </div>
      </div>

      {/* HEADER PRINCIPAL / NAVEGACIÓN */}
      <header className="bg-white border-b border-gray-200 z-40 shadow-sm h-[70px]">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="G Impulsa Logo" width={160} height={45} className="object-contain" priority />
          </Link>

          <nav className="hidden md:flex space-x-8 items-center font-medium text-sm">
            <Link href="/" className="hover:text-[#C5A059] transition">INICIO</Link>
            <Link href="/propiedades" className="text-[#C5A059] font-bold border-b-2 border-[#C5A059] pb-1">PROPIEDADES</Link>
            <Link href="/servicios" className="hover:text-[#C5A059] transition">SERVICIOS</Link>
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

      {/* CONTENEDOR: MAPA CUBRIENDO TODA LA PANTALLA */}
      <div className="relative w-full flex-1">
        
        {/* MAPA INTERACTIVO DE FONDO */}
        <div className="absolute inset-0 z-0">
          <PropertyMap properties={properties} />
        </div>

        {/* FRANJA MORADA ELEGANTE EN EL LÍMITE INFERIOR */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#2E1A47] z-20 shadow-inner border-t border-[#C5A059]/40 pointer-events-none"></div>

        {/* TARJETA FLOTANTE DE FILTROS */}
        <div className="absolute top-6 left-20 z-30 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 backdrop-blur-sm bg-white/95">
          
          <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
            <button className="flex-1 py-2 text-xs font-bold bg-[#2E1A47] text-white rounded-lg shadow">
              PROPIEDADES
            </button>
            <button className="flex-1 py-2 text-xs font-bold text-gray-600 hover:text-gray-900">
              COMERCIAL & INDUSTRIAL
            </button>
          </div>

          <div className="flex space-x-6 mb-4 text-sm font-medium text-gray-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="operacion" 
                checked={operacion === 'venta'} 
                onChange={() => setOperacion('venta')}
                className="accent-[#2E1A47]"
              />
              <span>Venta</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="operacion" 
                checked={operacion === 'renta'} 
                onChange={() => setOperacion('renta')}
                className="accent-[#2E1A47]"
              />
              <span>Renta</span>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <select 
                value={tipoInmueble}
                onChange={(e) => setTipoInmueble(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl p-3 focus:outline-none focus:border-[#2E1A47]"
              >
                <option value="">Tipo de Inmueble</option>
                <option value="casa">Casa Residencial</option>
                <option value="terreno">Terreno / Lote</option>
                <option value="comercial">Local Comercial</option>
                <option value="bodega">Bodega / Industrial</option>
              </select>
            </div>

            <div>
              <input 
                type="text" 
                placeholder="📍 Estado, Municipio o Colonia"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl p-3 focus:outline-none focus:border-[#2E1A47]"
              />
            </div>

            <div>
              <input 
                type="number" 
                placeholder="$ Monto Máximo (MXN)"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl p-3 focus:outline-none focus:border-[#2E1A47]"
              />
            </div>

            <button className="w-full bg-[#2E1A47] text-white font-bold py-3.5 rounded-xl hover:bg-[#C5A059] hover:text-black transition shadow-lg mt-2">
              Buscar Inmuebles
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center text-xs">
            <a href="#" className="text-gray-600 hover:text-[#2E1A47] font-medium">Vende o renta tu propiedad</a>
            <a href="#contacto" className="text-[#2E1A47] font-bold hover:underline">Contáctanos</a>
          </div>

        </div>

      </div>

    </div>
  );
}