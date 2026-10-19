'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* HEADER */}
      <header className="bg-black text-white py-4 px-8 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="G Impulsa Logo" width={140} height={38} className="object-contain" priority />
          <span className="bg-[#C5A059] text-black text-xs font-bold px-3 py-1 rounded-full uppercase">Panel de Administración</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/propiedades" target="_blank" className="text-sm text-gray-300 hover:text-white transition">
            Ver Sitio Público &rarr;
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-black uppercase">Bienvenido al CRM G Impulsa</h1>
          <p className="text-sm text-gray-600 mt-1">Selecciona el módulo administrativo que deseas gestionar:</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* MÓDULO 1: NUEVA PROPIEDAD */}
          <Link 
            href="/admin/propiedades/nuevo"
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:border-[#2E1A47] hover:shadow-2xl transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-[#2E1A47] text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-[#C5A059] group-hover:text-black transition">
                🏠
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase group-hover:text-[#2E1A47] transition">Alta de Propiedad</h3>
              <p className="text-sm text-gray-500 mt-2">
                Registra nuevos inmuebles con mapa interactivo, geolocalización automática, características físicas y galería multimedia.
              </p>
            </div>
            <div className="mt-8 text-xs font-bold text-[#2E1A47] group-hover:translate-x-1 transition flex items-center gap-1">
              Acceder al módulo &rarr;
            </div>
          </Link>

          {/* MÓDULO 2: GESTOR DE CATÁLOGOS Y EXCEL */}
          <Link 
            href="/admin/catalogos"
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:border-[#2E1A47] hover:shadow-2xl transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-[#2E1A47] text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-[#C5A059] group-hover:text-black transition">
                📊
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase group-hover:text-[#2E1A47] transition">Gestor de Catálogos & Excel</h3>
              <p className="text-sm text-gray-500 mt-2">
                Administra tipos de inmuebles, municipios, estados y amenidades. Descarga plantillas oficiales y realiza cargas masivas vía Excel.
              </p>
            </div>
            <div className="mt-8 text-xs font-bold text-[#2E1A47] group-hover:translate-x-1 transition flex items-center gap-1">
              Acceder al módulo &rarr;
            </div>
          </Link>

        </div>
      </main>

    </div>
  );
}