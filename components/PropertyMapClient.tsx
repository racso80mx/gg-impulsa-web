'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false });

interface Property {
  id: number;
  title: string;
  price: number;
  lat: number;
  lng: number;
  location: string;
}

export default function PropertyMapClient({ properties }: { properties: Property[] }) {
  const [operacion, setOperacion] = useState('venta');
  const [tipoInmueble, setTipoInmueble] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  return (
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
          <button className="flex-1 py-2 text-xs font-bold bg-[#2E1A47] text-white rounded-lg shadow">PROPIEDADES</button>
          <button className="flex-1 py-2 text-xs font-bold text-gray-600 hover:text-gray-900">COMERCIAL & INDUSTRIAL</button>
        </div>

        <form method="GET" action="/propiedades" className="space-y-3">
          <div className="flex space-x-6 mb-4 text-sm font-medium text-gray-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="operacion" value="venta" defaultChecked className="accent-[#2E1A47]" />
              <span>Venta</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="operacion" value="renta" className="accent-[#2E1A47]" />
              <span>Renta</span>
            </label>
          </div>

          <div>
            <select 
              value={tipoInmueble}
              onChange={(e) => setTipoInmueble(e.target.value)}
              name="tipo" 
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
              name="ubicacion" 
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="📍 Estado, Municipio o Colonia" 
              className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl p-3 focus:outline-none focus:border-[#2E1A47]" 
            />
          </div>

          <div>
            <input 
              type="number" 
              name="precio" 
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              placeholder="$ Monto Máximo (MXN)" 
              className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl p-3 focus:outline-none focus:border-[#2E1A47]" 
            />
          </div>

          <button type="submit" className="w-full bg-[#2E1A47] text-white font-bold py-3.5 rounded-xl hover:bg-[#C5A059] hover:text-black transition shadow-lg mt-2">
            Buscar Inmuebles
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center text-xs">
          <a href="#" className="text-gray-600 hover:text-[#2E1A47] font-medium">Vende o renta tu propiedad</a>
          <a href="#contacto" className="text-[#2E1A47] font-bold hover:underline">Contáctanos</a>
        </div>
      </div>

    </div>
  );
}